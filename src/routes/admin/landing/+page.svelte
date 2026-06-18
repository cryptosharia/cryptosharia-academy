<script lang="ts">
	import { goto, beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ADMIN_EMAILS } from '$lib/admin';
	import { userAuth } from '$lib/auth.svelte';
	import {
		MAX_IMAGE_SIZE_BYTES,
		isAllowedImageFile,
		uploadImageToVercelBlob
	} from '$lib/blobUpload';
	import {
		defaultLandingContent,
		fetchLandingContent,
		saveLandingContent,
		sectionCompleteness,
		seoCompleteness,
		resolveVideoEmbed,
		SECTION_LABELS,
		type LandingContent,
		type SectionId
	} from '$lib/landingContent';

	const isAdmin = $derived(
		userAuth.isLoggedIn && userAuth.user?.email && ADMIN_EMAILS.includes(userAuth.user.email)
	);

	const SECTION_ORDER: SectionId[] = defaultLandingContent.layout.map((entry) => entry.id);

	// A "view" is either a settings panel, a content section id, or advanced.
	type View = 'overview' | 'layout' | 'global' | SectionId | 'reset';

	let content = $state<LandingContent>(structuredClone(defaultLandingContent));
	// Snapshot of last-saved content, used for dirty tracking + discard.
	let savedSnapshot = $state<string>('');
	let isLoading = $state(true);
	let isSaving = $state(false);
	let savedAt = $state<string | null>(null);
	let saveError = $state(false);
	let activeView = $state<View>('overview');
	let searchQuery = $state('');
	let showResetModal = $state(false);

	const currentJson = $derived(JSON.stringify(content));
	const isDirty = $derived(currentJson !== savedSnapshot);

	// ---- Derived status for the mini dashboard ----
	const visibleCount = $derived(content.layout.filter((s) => s.visible).length);
	const hiddenCount = $derived(content.layout.length - visibleCount);
	const seoPct = $derived(seoCompleteness(content));

	$effect(() => {
		if (!userAuth.loading && !isAdmin) {
			goto('/');
		}
	});

	onMount(async () => {
		content = await fetchLandingContent();
		savedSnapshot = JSON.stringify(content);
		isLoading = false;
	});

	// Warn before leaving with unsaved changes (in-app navigation).
	beforeNavigate(({ to, cancel }) => {
		if (isDirty && to?.url.pathname !== '/admin/landing') {
			if (!confirm('Ada perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?')) {
				cancel();
			}
		}
	});

	// Warn before closing/refreshing the browser tab.
	$effect(() => {
		const handler = (e: BeforeUnloadEvent) => {
			if (isDirty) {
				e.preventDefault();
				e.returnValue = '';
			}
		};
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	});

	function go(view: View) {
		activeView = view;
		// Scroll editor to top on section switch for a clean context.
		if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// ---- Layout (order + visibility) ----
	function moveSection(index: number, dir: -1 | 1) {
		const next = index + dir;
		if (next < 0 || next >= content.layout.length) return;
		const layout = [...content.layout];
		[layout[index], layout[next]] = [layout[next], layout[index]];
		content.layout = layout;
	}

	function toggleVisible(index: number) {
		content.layout[index].visible = !content.layout[index].visible;
	}

	function isSectionVisible(id: SectionId) {
		return content.layout.find((s) => s.id === id)?.visible ?? false;
	}

	function toggleVisibleById(id: SectionId) {
		const idx = content.layout.findIndex((s) => s.id === id);
		if (idx >= 0) toggleVisible(idx);
	}

	function sectionMeta(id: SectionId) {
		const comp = sectionCompleteness(content, id);
		return {
			filled: comp.filled,
			total: comp.total,
			complete: comp.filled === comp.total,
			visible: isSectionVisible(id),
			missingMedia: sectionMissingMedia(id)
		};
	}

	/**
	 * Counts media slots (image/video URLs) that are still empty for a section.
	 * Used to flag "media belum lengkap" without opening the editor.
	 */
	function sectionMissingMedia(id: SectionId): number {
		if (id === 'hero') {
			return content.hero.videoUrl.trim() ? 0 : 1;
		}
		if (id === 'authority') {
			return content.authority.activities.filter((a) => !a.image.trim()).length;
		}
		if (id === 'valueProps') {
			const imgs = content.valueProps.docImages;
			if (imgs.length === 0) return 1;
			return imgs.filter((u) => !u.trim()).length;
		}
		if (id === 'instructors') {
			return content.instructors.items.filter((i) => !i.photo.trim()).length;
		}
		return 0;
	}

	function matchesSearch(id: SectionId) {
		if (!searchQuery.trim()) return true;
		return SECTION_LABELS[id].toLowerCase().includes(searchQuery.trim().toLowerCase());
	}

	const visibleSections = $derived(SECTION_ORDER.filter((id) => matchesSearch(id)));

	const activeTitle = $derived(
		activeView === 'overview'
			? 'Overview'
			: activeView === 'layout'
				? 'Urutan & Tampilan Section'
				: activeView === 'global'
					? 'Pengaturan Umum (WhatsApp & SEO)'
					: activeView === 'reset'
						? 'Reset Konten'
						: SECTION_LABELS[activeView as SectionId]
	);

	const isContentSection = $derived(SECTION_ORDER.includes(activeView as SectionId));

	// ---- Generic list helpers ----
	function addItem<T>(arr: T[], template: T) {
		return [...arr, structuredClone(template)];
	}
	function removeItem<T>(arr: T[], index: number) {
		return arr.filter((_, i) => i !== index);
	}

	// ---- Image upload to Vercel Blob ----
	// Tracks which upload slot is busy (keyed by an arbitrary id) for spinners.
	let uploadingKey = $state<string | null>(null);
	let uploadProgress = $state(0);
	let uploadError = $state<string | null>(null);

	const UPLOAD_TIMEOUT_MS = 60_000;

	function formatUploadError(error: unknown) {
		if (error instanceof DOMException && error.name === 'AbortError') {
			return 'Upload melebihi 60 detik. Coba ulangi dengan gambar yang lebih kecil.';
		}
		if (error instanceof Error && error.message) return error.message;
		return 'Gagal mengunggah gambar ke Vercel Blob. Coba lagi.';
	}

	async function uploadImage(file: File, key: string, onDone: (url: string) => void) {
		if (!isAllowedImageFile(file)) {
			alert('File harus berupa gambar JPG, PNG, WebP, GIF, atau AVIF.');
			return;
		}
		if (file.size > MAX_IMAGE_SIZE_BYTES) {
			alert('Ukuran gambar maksimal 5 MB. Kompres gambar dulu lalu coba lagi.');
			return;
		}

		uploadingKey = key;
		uploadProgress = 0;
		uploadError = null;
		const controller = new AbortController();
		const timeout = window.setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
		try {
			const idToken = await userAuth.user?.getIdToken();
			if (!idToken) throw new Error('Sesi admin tidak ditemukan. Login ulang lalu coba upload.');

			const url = await uploadImageToVercelBlob({
				file,
				scope: 'landing',
				idToken,
				abortSignal: controller.signal,
				onProgress: (percentage) => (uploadProgress = percentage)
			});
			onDone(url);
		} catch (e) {
			const message = formatUploadError(e);
			console.error('Upload error:', e);
			uploadError = message;
			alert(message);
		} finally {
			window.clearTimeout(timeout);
			uploadingKey = null;
			uploadProgress = 0;
		}
	}

	function handleUpload(event: Event, key: string, onDone: (url: string) => void) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) uploadImage(file, key, onDone);
		target.value = '';
	}

	function handleMultiUpload(event: Event, key: string, onDone: (url: string) => void) {
		const target = event.target as HTMLInputElement;
		const files = Array.from(target.files ?? []);
		target.value = '';
		// Upload sequentially so each finished URL is appended in order.
		(async () => {
			for (const file of files) {
				await uploadImage(file, key, onDone);
			}
		})();
	}

	async function save() {
		isSaving = true;
		saveError = false;
		try {
			await saveLandingContent($state.snapshot(content));
			savedSnapshot = JSON.stringify(content);
			savedAt = new Date().toLocaleTimeString('id-ID');
		} catch (e) {
			console.error(e);
			saveError = true;
		} finally {
			isSaving = false;
		}
	}

	function discardChanges() {
		if (!isDirty) return;
		if (!confirm('Batalkan semua perubahan yang belum disimpan?')) return;
		content = JSON.parse(savedSnapshot);
	}

	function confirmReset() {
		content = structuredClone(defaultLandingContent);
		showResetModal = false;
		activeView = 'overview';
	}

	const inputClass =
		'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40 dark:border-gray-700 dark:bg-gray-900 dark:text-white';
	const labelClass = 'mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300';
	const cardClass =
		'rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900';
</script>

<svelte:head>
	<title>Admin — Editor Landing Page | CryptoSharia Academy</title>
</svelte:head>

{#if userAuth.loading || isLoading}
	<div class="flex min-h-[60vh] items-center justify-center">
		<svg class="text-primary-600 h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24"
			><circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
			/><path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/></svg
		>
	</div>
{:else if isAdmin}
	<div class="min-h-screen bg-gray-50 pt-20 pb-28 dark:bg-gray-950">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<!-- ===== Header ===== -->
			<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Editor Landing Page</h1>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
						Edit teks, gambar, item, urutan & SEO. Perubahan tampil di halaman publik setelah
						disimpan.
					</p>
				</div>
				<a
					href="/"
					target="_blank"
					class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
				>
					Preview
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						/></svg
					>
				</a>
			</div>

			<!-- Stat strip -->
			<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
				<div
					class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
				>
					<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Section</p>
					<p class="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
						{content.layout.length}
					</p>
				</div>
				<div
					class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
				>
					<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Tampil / Sembunyi</p>
					<p class="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
						<span class="text-emerald-600 dark:text-emerald-400">{visibleCount}</span>
						<span class="text-gray-300 dark:text-gray-600">/</span>
						<span class="text-gray-400">{hiddenCount}</span>
					</p>
				</div>
				<div
					class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
				>
					<p class="text-xs font-medium text-gray-500 dark:text-gray-400">SEO Lengkap</p>
					<div class="mt-2 flex items-center gap-2">
						<div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
							<div
								class="h-full rounded-full {seoPct >= 75
									? 'bg-emerald-500'
									: seoPct >= 50
										? 'bg-amber-500'
										: 'bg-red-500'}"
								style="width: {seoPct}%"
							></div>
						</div>
						<span class="text-xs font-bold text-gray-700 dark:text-gray-200">{seoPct}%</span>
					</div>
				</div>
				<div
					class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
				>
					<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
					<p
						class="mt-1 text-sm font-bold {isDirty
							? 'text-amber-600 dark:text-amber-400'
							: 'text-emerald-600 dark:text-emerald-400'}"
					>
						{#if isDirty}● Belum disimpan{:else}✓ Tersimpan{/if}
					</p>
					{#if savedAt}<p class="mt-0.5 text-[11px] text-gray-400">pukul {savedAt}</p>{/if}
				</div>
			</div>

			<!-- Mobile section picker -->
			<div class="mb-4 lg:hidden">
				<label
					class="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300"
					for="mobile-section">Pilih Section</label
				>
				<select
					id="mobile-section"
					value={activeView}
					onchange={(e) => go(e.currentTarget.value as View)}
					class={inputClass}
				>
					<optgroup label="Pengaturan">
						<option value="overview">Overview</option>
						<option value="layout">Urutan Section</option>
						<option value="global">SEO & WhatsApp</option>
					</optgroup>
					<optgroup label="Konten Landing Page">
						{#each SECTION_ORDER as id, idx}
							<option value={id}>{idx + 1}. {SECTION_LABELS[id]}</option>
						{/each}
					</optgroup>
					<optgroup label="Lanjutan">
						<option value="reset">Reset Konten</option>
					</optgroup>
				</select>
			</div>

			<!-- ===== 2-column workspace ===== -->
			<div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<!-- Sidebar (desktop) -->
				<aside class="hidden lg:block">
					<div class="lg:sticky lg:top-24">
						<!-- Search -->
						<div class="relative mb-3">
							<svg
								class="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/></svg
							>
							<input
								bind:value={searchQuery}
								placeholder="Cari section..."
								class="{inputClass} pl-9"
							/>
						</div>

						<nav
							class="space-y-5 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
						>
							<!-- Pengaturan -->
							<div>
								<p class="mb-1.5 px-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
									Pengaturan
								</p>
								<div class="space-y-0.5">
									{@render navItem('overview', 'Overview')}
									{@render navItem('layout', 'Urutan Section')}
									{@render navItemSeo()}
								</div>
							</div>

							<!-- Konten -->
							<div>
								<p class="mb-1.5 px-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
									Konten Landing Page
								</p>
								<div class="space-y-0.5">
									{#each visibleSections as id (id)}
										{@render navItemSection(id)}
									{/each}
									{#if visibleSections.length === 0}
										<p class="px-2 py-2 text-xs text-gray-400">Tidak ada yang cocok.</p>
									{/if}
								</div>
							</div>

							<!-- Lanjutan -->
							<div>
								<p class="mb-1.5 px-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
									Lanjutan
								</p>
								<button
									type="button"
									onclick={() => go('reset')}
									class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors {activeView ===
									'reset'
										? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
										: 'text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'}"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/></svg
									>
									Reset Konten
								</button>
							</div>
						</nav>
					</div>
				</aside>

				<!-- Main editor -->
				<div
					class="min-w-0 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
				>
					<!-- Panel header -->
					<div
						class="flex flex-col gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700"
					>
						<div>
							<h2 class="text-lg font-extrabold text-gray-900 dark:text-white">{activeTitle}</h2>
							{#if isContentSection}
								{@const m = sectionMeta(activeView as SectionId)}
								<div class="mt-1 flex flex-wrap items-center gap-2 text-xs">
									<span
										class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold {m.visible
											? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
											: 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}"
									>
										{m.visible ? '● Aktif' : '○ Hidden'}
									</span>
									<span
										class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold {m.complete
											? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
											: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}"
									>
										{m.complete ? '✓' : '!'}
										{m.filled}/{m.total} terisi
									</span>
									{#if m.missingMedia > 0}
										<span
											class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
										>
											<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
												/></svg
											>
											{m.missingMedia} media belum ada
										</span>
									{/if}
								</div>
							{/if}
						</div>
						{#if isContentSection}
							<label class="inline-flex cursor-pointer items-center gap-2 self-start">
								<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Tampilkan</span>
								<input
									type="checkbox"
									checked={isSectionVisible(activeView as SectionId)}
									onchange={() => toggleVisibleById(activeView as SectionId)}
									class="peer sr-only"
								/>
								<span
									class="peer-checked:bg-primary-600 relative h-5 w-9 rounded-full bg-gray-300 transition after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4 dark:bg-gray-600"
								></span>
							</label>
						{/if}
					</div>

					<!-- Panel body -->
					<div class="space-y-4 p-5">
						{#if activeView === 'overview'}
							{@render overviewPanel()}
						{:else if activeView === 'layout'}
							{@render layoutPanel()}
						{:else if activeView === 'global'}
							{@render globalForm()}
						{:else if activeView === 'reset'}
							{@render resetPanel()}
						{:else if activeView === 'hero'}{@render heroForm()}
						{:else if activeView === 'authority'}{@render authorityForm()}
						{:else if activeView === 'valueProps'}{@render valuePropsForm()}
						{:else if activeView === 'testimonials'}{@render testimonialsForm()}
						{:else if activeView === 'usp'}{@render uspForm()}
						{:else if activeView === 'curriculum'}{@render curriculumForm()}
						{:else if activeView === 'instructors'}{@render instructorsForm()}
						{:else if activeView === 'pricing'}{@render pricingForm()}
						{:else if activeView === 'urgency'}{@render urgencyForm()}
						{:else if activeView === 'faq'}{@render faqForm()}
						{:else if activeView === 'finalCta'}{@render finalCtaForm()}
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Sticky save bar -->
	<div
		class="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95"
	>
		<div
			class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
		>
			<span
				class="text-sm font-medium {saveError
					? 'text-red-600 dark:text-red-400'
					: isDirty
						? 'text-amber-600 dark:text-amber-400'
						: 'text-emerald-600 dark:text-emerald-400'}"
			>
				{#if saveError}
					⚠️ Gagal menyimpan. Coba lagi.
				{:else if isDirty}
					● Ada perubahan belum disimpan
				{:else if savedAt}
					✓ Semua perubahan tersimpan · {savedAt}
				{:else}
					Belum ada perubahan
				{/if}
			</span>
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={discardChanges}
					disabled={!isDirty}
					class="cursor-pointer rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
				>
					Batalkan
				</button>
				<button
					type="button"
					onclick={save}
					disabled={isSaving || !isDirty}
					class="bg-primary-600 hover:bg-primary-700 cursor-pointer rounded-lg px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50"
				>
					{isSaving ? 'Menyimpan...' : 'Simpan ke Landing Page'}
				</button>
			</div>
		</div>
	</div>

	<!-- Reset confirmation modal -->
	{#if showResetModal}
		<div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
			<button
				aria-label="Tutup"
				onclick={() => (showResetModal = false)}
				class="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
			></button>
			<div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
				<h2 class="text-lg font-extrabold text-gray-900 dark:text-white">Reset Semua Konten?</h2>
				<p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
					Tindakan ini akan menghapus perubahan landing page saat ini dan mengembalikan konten ke
					bawaan sistem. Tindakan ini tidak bisa dibatalkan. Kamu tetap perlu klik <strong
						>Simpan</strong
					> agar tersimpan ke halaman publik.
				</p>
				<div class="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onclick={() => (showResetModal = false)}
						class="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
						>Batal</button
					>
					<button
						type="button"
						onclick={confirmReset}
						class="cursor-pointer rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700"
						>Ya, Reset Semua</button
					>
				</div>
			</div>
		</div>
	{/if}
{/if}

<!-- ============ Sidebar nav item snippets ============ -->
{#snippet navItem(view: View, label: string)}
	{@const active = activeView === view}
	<button
		type="button"
		onclick={() => go(view)}
		class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors {active
			? 'bg-primary-50 text-primary-700 ring-primary-200 dark:bg-primary-900/40 dark:text-primary-300 dark:ring-primary-800 ring-1'
			: 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'}"
	>
		{label}
	</button>
{/snippet}

{#snippet navItemSeo()}
	{@const active = activeView === 'global'}
	<button
		type="button"
		onclick={() => go('global')}
		class="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors {active
			? 'bg-primary-50 text-primary-700 ring-primary-200 dark:bg-primary-900/40 dark:text-primary-300 dark:ring-primary-800 ring-1'
			: 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'}"
	>
		<span>SEO & WhatsApp</span>
		<span
			class="rounded-full px-1.5 py-0.5 text-[10px] font-bold {seoPct === 100
				? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
				: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}">{seoPct}%</span
		>
	</button>
{/snippet}

{#snippet navItemSection(id: SectionId)}
	{@const active = activeView === id}
	{@const m = sectionMeta(id)}
	<button
		type="button"
		onclick={() => go(id)}
		class="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors {active
			? 'bg-primary-50 text-primary-700 ring-primary-200 dark:bg-primary-900/40 dark:text-primary-300 dark:ring-primary-800 ring-1'
			: 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'}"
	>
		<span class="flex min-w-0 items-center gap-1.5">
			<span class="shrink-0 {m.complete ? 'text-emerald-500' : 'text-amber-500'}"
				>{m.complete ? '✓' : '!'}</span
			>
			<span class="truncate {!m.visible ? 'text-gray-400 dark:text-gray-500' : ''}"
				>{SECTION_LABELS[id]}</span
			>
		</span>
		<span class="flex shrink-0 items-center gap-1">
			{#if m.missingMedia > 0}
				<span
					class="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
					title="{m.missingMedia} media belum ada"
				>
					<svg class="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.2"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/></svg
					>
					{m.missingMedia}
				</span>
			{/if}
			<span class="text-[10px] font-bold text-gray-400">
				{#if !m.visible}Hidden{:else}{m.filled}/{m.total}{/if}
			</span>
		</span>
	</button>
{/snippet}

<!-- ============ Settings panels ============ -->
{#snippet overviewPanel()}
	<p class="text-sm text-gray-500 dark:text-gray-400">
		Ringkasan kondisi landing page. Klik salah satu section untuk mulai mengedit.
	</p>
	<div class="space-y-2">
		{#each SECTION_ORDER as id, idx (id)}
			{@const m = sectionMeta(id)}
			<button
				type="button"
				onclick={() => go(id)}
				class="hover:border-primary-300 hover:bg-primary-50/40 dark:hover:border-primary-700 dark:hover:bg-primary-900/10 flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left transition-colors dark:border-gray-700 dark:bg-gray-900"
			>
				<span class="flex items-center gap-2">
					<span class="text-sm font-semibold text-gray-800 dark:text-gray-100"
						>{idx + 1}. {SECTION_LABELS[id]}</span
					>
				</span>
				<span class="flex items-center gap-2">
					{#if !m.visible}
						<span
							class="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-400"
							>Hidden</span
						>
					{/if}
					{#if m.missingMedia > 0}
						<span
							class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
						>
							<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/></svg
							>
							{m.missingMedia} media kosong
						</span>
					{/if}
					<span
						class="rounded-full px-2 py-0.5 text-[10px] font-bold {m.complete
							? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
							: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}"
						>{m.filled}/{m.total}</span
					>
					<svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/></svg
					>
				</span>
			</button>
		{/each}
	</div>
{/snippet}

{#snippet layoutPanel()}
	<p class="text-sm text-gray-500 dark:text-gray-400">
		Atur urutan tampil dengan tombol panah, dan matikan toggle untuk menyembunyikan section dari
		halaman publik.
	</p>
	<div class="space-y-2">
		{#each content.layout as entry, i (entry.id)}
			<div
				class="flex items-center gap-3 rounded-lg border px-3 py-2.5 {entry.visible
					? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
					: 'border-dashed border-gray-300 bg-gray-100/50 dark:border-gray-600 dark:bg-gray-900/40'}"
			>
				<div class="flex flex-col">
					<button
						type="button"
						onclick={() => moveSection(i, -1)}
						disabled={i === 0}
						class="hover:text-primary-600 cursor-pointer text-gray-400 disabled:opacity-20"
						aria-label="Naik"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M5 15l7-7 7 7"
							/></svg
						>
					</button>
					<button
						type="button"
						onclick={() => moveSection(i, 1)}
						disabled={i === content.layout.length - 1}
						class="hover:text-primary-600 cursor-pointer text-gray-400 disabled:opacity-20"
						aria-label="Turun"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M19 9l-7 7-7-7"
							/></svg
						>
					</button>
				</div>
				<button
					type="button"
					onclick={() => go(entry.id)}
					class="flex-1 text-left text-sm font-semibold hover:underline {entry.visible
						? 'text-gray-800 dark:text-gray-200'
						: 'text-gray-400 dark:text-gray-500'}"
				>
					{i + 1}. {SECTION_LABELS[entry.id]}
				</button>
				<label class="inline-flex cursor-pointer items-center gap-2">
					<input
						type="checkbox"
						checked={entry.visible}
						onchange={() => toggleVisible(i)}
						class="peer sr-only"
					/>
					<span
						class="peer-checked:bg-primary-600 relative h-5 w-9 rounded-full bg-gray-300 transition after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4 dark:bg-gray-600"
					></span>
					<span
						class="w-14 text-xs font-medium {entry.visible
							? 'text-primary-600 dark:text-primary-400'
							: 'text-gray-400'}">{entry.visible ? 'Tampil' : 'Sembunyi'}</span
					>
				</label>
			</div>
		{/each}
	</div>
{/snippet}

{#snippet resetPanel()}
	<div
		class="rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/40 dark:bg-red-950/20"
	>
		<p class="text-sm font-bold text-red-700 dark:text-red-300">Reset Semua Konten ke Default</p>
		<p class="mt-1 text-xs leading-relaxed text-red-500/80 dark:text-red-400/80">
			Mengembalikan seluruh konten landing page ke bawaan sistem. Tindakan ini tidak bisa dibatalkan
			dan tetap perlu disimpan agar berlaku di halaman publik.
		</p>
		<button
			type="button"
			onclick={() => (showResetModal = true)}
			class="mt-4 cursor-pointer rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
		>
			Reset Semua Konten
		</button>
	</div>
{/snippet}

<!-- ============ Field snippets ============ -->
{#snippet textField(label: string, getVal: () => string, setVal: (v: string) => void)}
	<div>
		<span class={labelClass}>{label}</span>
		<input
			type="text"
			value={getVal()}
			oninput={(e) => setVal(e.currentTarget.value)}
			class={inputClass}
		/>
	</div>
{/snippet}

{#snippet areaField(label: string, getVal: () => string, setVal: (v: string) => void)}
	<div>
		<span class={labelClass}>{label}</span>
		<textarea
			value={getVal()}
			oninput={(e) => setVal(e.currentTarget.value)}
			rows="3"
			class="{inputClass} resize-none"
		></textarea>
	</div>
{/snippet}

{#snippet listHeader(title: string, onAdd: () => void)}
	<div class="flex items-center justify-between">
		<span class="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400"
			>{title}</span
		>
		<button
			type="button"
			onclick={onAdd}
			class="text-primary-600 hover:text-primary-700 flex cursor-pointer items-center gap-1 text-xs font-semibold"
		>
			<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
				/></svg
			>
			Tambah
		</button>
	</div>
{/snippet}

{#snippet removeBtn(onRemove: () => void)}
	<button
		type="button"
		onclick={onRemove}
		class="cursor-pointer text-red-400 hover:text-red-600"
		aria-label="Hapus item"
	>
		<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
			/></svg
		>
	</button>
{/snippet}

<!-- Single image field: URL input + upload button + preview/clear -->
{#snippet imageField(label: string, key: string, getVal: () => string, setVal: (v: string) => void)}
	<div>
		<div class="mb-1 flex items-center gap-2">
			<span class="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span>
			{#if getVal().trim()}
				<span
					class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Ada gambar
				</span>
			{:else}
				<span
					class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Belum ada gambar
				</span>
			{/if}
		</div>
		<div class="flex gap-2">
			<input
				type="text"
				value={getVal()}
				oninput={(e) => setVal(e.currentTarget.value)}
				placeholder="Tempel URL gambar atau unggah"
				class={inputClass}
			/>
			<label
				class="relative flex cursor-pointer items-center justify-center rounded-lg bg-gray-200 px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
			>
				{#if uploadingKey === key}
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
						><circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						/><path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						/></svg
					>
					<span class="ml-1.5">{uploadProgress}%</span>
				{:else}
					Upload
				{/if}
				<input
					type="file"
					accept="image/*"
					class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					onchange={(e) => handleUpload(e, key, setVal)}
					disabled={uploadingKey === key}
				/>
			</label>
		</div>
		{#if uploadError && uploadingKey === null}
			<p class="mt-2 text-[11px] font-semibold text-red-500">{uploadError}</p>
		{/if}
		{#if getVal()}
			<div class="mt-2 flex items-center gap-3">
				<img
					src={getVal()}
					alt="Preview"
					class="h-16 w-24 rounded-md border border-gray-200 object-cover dark:border-gray-700"
				/>
				<button
					type="button"
					onclick={() => setVal('')}
					class="text-xs font-semibold text-red-500 hover:text-red-700">Hapus gambar</button
				>
			</div>
		{:else}
			<div
				class="mt-2 flex h-16 w-24 flex-col items-center justify-center rounded-md border border-dashed border-amber-300 bg-amber-50 text-amber-500 dark:border-amber-700/60 dark:bg-amber-950/20"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/></svg
				>
				<span class="mt-0.5 text-[9px] font-bold">Kosong</span>
			</div>
		{/if}
	</div>
{/snippet}

<!-- Multi-image gallery field -->
{#snippet galleryField(
	label: string,
	key: string,
	getList: () => string[],
	setList: (v: string[]) => void
)}
	{@const filled = getList().filter((u) => u.trim()).length}
	{@const total = getList().length}
	<div>
		<div class="mb-1 flex items-center gap-2">
			<span class="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400"
				>{label}</span
			>
			{#if total === 0}
				<span
					class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Belum ada gambar
				</span>
			{:else if filled < total}
				<span
					class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
					{filled}/{total} terisi
				</span>
			{:else}
				<span
					class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
					{total} gambar
				</span>
			{/if}
			<button
				type="button"
				onclick={() => setList([...getList(), ''])}
				class="text-primary-600 hover:text-primary-700 ml-auto flex cursor-pointer items-center gap-1 text-xs font-semibold"
			>
				<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/></svg
				>
				Tambah URL
			</button>
		</div>
		<label
			class="hover:border-primary-400 hover:bg-primary-50/40 dark:hover:border-primary-600 mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 transition-colors dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
		>
			{#if uploadingKey === key}
				<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
					><circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/><path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					/></svg
				>
				Mengunggah... {uploadProgress}%
			{:else}
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
					/></svg
				>
				Unggah Gambar (bisa pilih banyak)
			{/if}
			<input
				type="file"
				accept="image/*"
				multiple
				class="hidden"
				onchange={(e) => handleMultiUpload(e, key, (url) => setList([...getList(), url]))}
				disabled={uploadingKey === key}
			/>
		</label>
		{#if uploadError && uploadingKey === null}
			<p class="mt-2 text-[11px] font-semibold text-red-500">{uploadError}</p>
		{/if}
		{#if getList().length === 0}
			<div
				class="mt-3 flex flex-col items-center gap-1 rounded-lg border border-dashed border-amber-300 bg-amber-50 py-6 text-center dark:border-amber-700/60 dark:bg-amber-950/20"
			>
				<svg class="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/></svg
				>
				<p class="text-xs font-semibold text-amber-600 dark:text-amber-400">
					Belum ada gambar dokumentasi
				</p>
				<p class="text-[11px] text-amber-500/80">
					Halaman publik akan menampilkan kotak placeholder.
				</p>
			</div>
		{:else}
			<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
				{#each getList() as _, i}
					<div
						class="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900"
					>
						<div
							class="relative aspect-[4/3] overflow-hidden rounded-md border bg-white dark:bg-gray-950 {getList()[
								i
							].trim()
								? 'border-gray-200 dark:border-gray-700'
								: 'border-dashed border-amber-300 dark:border-amber-700/60'}"
						>
							{#if getList()[i].trim()}
								<img
									src={getList()[i]}
									alt="Dokumentasi {i + 1}"
									class="h-full w-full object-cover"
								/>
							{:else}
								<div
									class="flex h-full flex-col items-center justify-center gap-0.5 bg-amber-50 text-amber-500 dark:bg-amber-950/20"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.8"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/></svg
									>
									<span class="text-[9px] font-bold">URL kosong</span>
								</div>
							{/if}
							<button
								type="button"
								onclick={() => setList(removeItem(getList(), i))}
								class="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600"
								aria-label="Hapus gambar"
							>
								<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/></svg
								>
							</button>
						</div>
						<input
							type="text"
							value={getList()[i]}
							oninput={(e) => {
								const next = [...getList()];
								next[i] = e.currentTarget.value;
								setList(next);
							}}
							placeholder="URL gambar"
							class="w-full rounded border bg-white px-2 py-1 text-[11px] text-gray-900 outline-none dark:bg-gray-800 dark:text-white {getList()[
								i
							].trim()
								? 'border-gray-200 dark:border-gray-700'
								: 'border-amber-300 dark:border-amber-700/60'}"
						/>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<!-- ============ Section forms ============ -->
{#snippet globalForm()}
	{@render textField(
		'Nomor WhatsApp (cth. +6282186584279)',
		() => content.whatsapp.phone,
		(v) => (content.whatsapp.phone = v)
	)}
	{@render areaField(
		'Pesan WhatsApp Otomatis',
		() => content.whatsapp.message,
		(v) => (content.whatsapp.message = v)
	)}
	<!-- WhatsApp preview -->
	<div
		class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900/40 dark:bg-green-950/20"
	>
		<p
			class="mb-2 text-[10px] font-bold tracking-wide text-green-700 uppercase dark:text-green-400"
		>
			Preview Pesan WhatsApp
		</p>
		<div
			class="rounded-lg rounded-tl-none bg-white p-3 text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200"
		>
			{content.whatsapp.message || 'Pesan kosong...'}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700"></div>
	{@render textField(
		'Judul Browser / SEO Title',
		() => content.seo.title,
		(v) => (content.seo.title = v)
	)}
	{@render areaField(
		'Meta Description',
		() => content.seo.description,
		(v) => (content.seo.description = v)
	)}
	<!-- Google preview -->
	<div class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
		<p class="mb-2 text-[10px] font-bold tracking-wide text-gray-400 uppercase">
			Preview Hasil Pencarian Google
		</p>
		<p class="truncate text-xs text-emerald-700 dark:text-emerald-500">https://cryptosharia.id</p>
		<p class="truncate text-base font-medium text-blue-700 dark:text-blue-400">
			{content.seo.title || 'Judul halaman...'}
		</p>
		<p class="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
			{content.seo.description || 'Meta description...'}
		</p>
	</div>
{/snippet}

{#snippet heroForm()}
	{@render textField(
		'Badge',
		() => content.hero.badge,
		(v) => (content.hero.badge = v)
	)}
	{@render textField(
		'Judul Utama',
		() => content.hero.title,
		(v) => (content.hero.title = v)
	)}
	{@render areaField(
		'Subjudul',
		() => content.hero.subtitle,
		(v) => (content.hero.subtitle = v)
	)}
	{@render areaField(
		'Deskripsi',
		() => content.hero.description,
		(v) => (content.hero.description = v)
	)}
	{@render textField(
		'Label Tombol Utama',
		() => content.hero.primaryCtaLabel,
		(v) => (content.hero.primaryCtaLabel = v)
	)}
	<div class="grid grid-cols-2 gap-4">
		{@render textField(
			'Tombol Kedua (label)',
			() => content.hero.secondaryCta.label,
			(v) => (content.hero.secondaryCta.label = v)
		)}
		{@render textField(
			'Tombol Kedua (link)',
			() => content.hero.secondaryCta.href,
			(v) => (content.hero.secondaryCta.href = v)
		)}
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		<div class="mb-3 flex items-center gap-2">
			<p class="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">
				Video Perkenalan Program
			</p>
			{#if content.hero.videoUrl.trim()}
				<span
					class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Video aktif
				</span>
			{:else}
				<span
					class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Belum ada video
				</span>
			{/if}
		</div>
		{@render textField(
			'Link Video (YouTube, Vimeo, atau file .mp4)',
			() => content.hero.videoUrl,
			(v) => (content.hero.videoUrl = v)
		)}
		<p class="mt-1 text-[11px] text-gray-400">
			Tempel link YouTube/Vimeo atau URL file video. Kosongkan untuk menampilkan placeholder.
		</p>
		{#if content.hero.videoUrl.trim()}
			{@const embed = resolveVideoEmbed(content.hero.videoUrl)}
			<div class="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
				<div class="aspect-video bg-black">
					{#if embed.kind === 'iframe'}
						<iframe
							class="h-full w-full"
							src={embed.src}
							title="Preview video"
							frameborder="0"
							allowfullscreen
						></iframe>
					{:else if embed.kind === 'file'}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video class="h-full w-full" src={embed.src} controls></video>
					{/if}
				</div>
			</div>
		{:else}
			<div
				class="mt-3 flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-amber-300 bg-amber-50 text-amber-500 dark:border-amber-700/60 dark:bg-amber-950/20"
			>
				<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.6"
						d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/></svg
				>
				<p class="text-xs font-semibold">Belum ada video</p>
				<p class="text-[11px] text-amber-500/80">
					Halaman publik menampilkan placeholder (judul & deskripsi di bawah).
				</p>
			</div>
		{/if}
		<div class="mt-3 space-y-4">
			{@render textField(
				'Label Video (cth. intro.mp4)',
				() => content.hero.videoLabel,
				(v) => (content.hero.videoLabel = v)
			)}
			{@render textField(
				'Judul Video (saat kosong)',
				() => content.hero.videoTitle,
				(v) => (content.hero.videoTitle = v)
			)}
			{@render areaField(
				'Deskripsi Video (saat kosong)',
				() => content.hero.videoDescription,
				(v) => (content.hero.videoDescription = v)
			)}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Highlight Aset',
			() =>
				(content.hero.highlights = addItem(content.hero.highlights, {
					symbol: '',
					performance: ''
				}))
		)}
		<div class="mt-3 space-y-2">
			{#each content.hero.highlights as h, i}
				<div class="flex items-center gap-2 {cardClass}">
					<input bind:value={h.symbol} placeholder="Simbol" class={inputClass} />
					<input bind:value={h.performance} placeholder="cth. +400%" class={inputClass} />
					{@render removeBtn(
						() => (content.hero.highlights = removeItem(content.hero.highlights, i))
					)}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet authorityForm()}
	{@render textField(
		'Judul',
		() => content.authority.title,
		(v) => (content.authority.title = v)
	)}
	{@render areaField(
		'Deskripsi',
		() => content.authority.description,
		(v) => (content.authority.description = v)
	)}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Aktivitas Komunitas',
			() =>
				(content.authority.activities = addItem(content.authority.activities, {
					meta: '',
					title: '',
					description: '',
					image: ''
				}))
		)}
		<div class="mt-3 space-y-3">
			{#each content.authority.activities as a, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">ITEM {i + 1}</span>
						{@render removeBtn(
							() => (content.authority.activities = removeItem(content.authority.activities, i))
						)}
					</div>
					<input bind:value={a.title} placeholder="Judul" class={inputClass} />
					<textarea
						bind:value={a.description}
						rows="2"
						placeholder="Deskripsi"
						class="{inputClass} resize-none"
					></textarea>
					{@render imageField(
						'Gambar',
						`activity-${i}`,
						() => a.image,
						(v) => (a.image = v)
					)}
				</div>
			{/each}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Kartu Bawah',
			() =>
				(content.authority.cards = addItem(content.authority.cards, { label: '', description: '' }))
		)}
		<div class="mt-3 space-y-3">
			{#each content.authority.cards as c, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">KARTU {i + 1}</span>
						{@render removeBtn(
							() => (content.authority.cards = removeItem(content.authority.cards, i))
						)}
					</div>
					<input bind:value={c.label} placeholder="Label" class={inputClass} />
					<textarea
						bind:value={c.description}
						rows="2"
						placeholder="Deskripsi"
						class="{inputClass} resize-none"
					></textarea>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet valuePropsForm()}
	{@render textField(
		'Judul',
		() => content.valueProps.title,
		(v) => (content.valueProps.title = v)
	)}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Item Manfaat',
			() =>
				(content.valueProps.items = addItem(content.valueProps.items, {
					label: '',
					title: '',
					description: ''
				}))
		)}
		<div class="mt-3 space-y-3">
			{#each content.valueProps.items as item, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">ITEM {i + 1}</span>
						{@render removeBtn(
							() => (content.valueProps.items = removeItem(content.valueProps.items, i))
						)}
					</div>
					<input bind:value={item.title} placeholder="Judul" class={inputClass} />
					<textarea
						bind:value={item.description}
						rows="2"
						placeholder="Deskripsi"
						class="{inputClass} resize-none"
					></textarea>
				</div>
			{/each}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render textField(
			'Dokumentasi — Judul',
			() => content.valueProps.docTitle,
			(v) => (content.valueProps.docTitle = v)
		)}
		{@render areaField(
			'Dokumentasi — Deskripsi',
			() => content.valueProps.docDescription,
			(v) => (content.valueProps.docDescription = v)
		)}
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render galleryField(
			'Galeri Foto Dokumentasi',
			'doc-gallery',
			() => content.valueProps.docImages,
			(v) => (content.valueProps.docImages = v)
		)}
		<p class="mt-2 text-[11px] text-gray-400">
			Kosongkan untuk menampilkan placeholder kotak. Tampil di grid samping teks dokumentasi.
		</p>
	</div>
{/snippet}

{#snippet testimonialsForm()}
	{@render textField(
		'Judul',
		() => content.testimonials.title,
		(v) => (content.testimonials.title = v)
	)}
	{@render areaField(
		'Deskripsi',
		() => content.testimonials.description,
		(v) => (content.testimonials.description = v)
	)}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Testimoni',
			() =>
				(content.testimonials.items = addItem(content.testimonials.items, {
					meta: '',
					title: '',
					description: ''
				}))
		)}
		<div class="mt-3 space-y-3">
			{#each content.testimonials.items as item, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">ITEM {i + 1}</span>
						{@render removeBtn(
							() => (content.testimonials.items = removeItem(content.testimonials.items, i))
						)}
					</div>
					<input bind:value={item.title} placeholder="Kutipan singkat" class={inputClass} />
					<textarea
						bind:value={item.description}
						rows="2"
						placeholder="Deskripsi"
						class="{inputClass} resize-none"
					></textarea>
					{@render imageField(
						'Gambar Screenshot',
						`testimonial-${i}`,
						() => item.image ?? '',
						(v) => (item.image = v)
					)}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet uspForm()}
	{@render textField(
		'Judul',
		() => content.usp.title,
		(v) => (content.usp.title = v)
	)}
	{@render areaField(
		'Deskripsi',
		() => content.usp.description,
		(v) => (content.usp.description = v)
	)}
	{@render areaField(
		'Kutipan / Quote',
		() => content.usp.quote,
		(v) => (content.usp.quote = v)
	)}
	{@render areaField(
		'Catatan Quote',
		() => content.usp.quoteNote,
		(v) => (content.usp.quoteNote = v)
	)}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Keunggulan',
			() =>
				(content.usp.items = addItem(content.usp.items, { label: '', title: '', description: '' }))
		)}
		<div class="mt-3 space-y-3">
			{#each content.usp.items as item, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">ITEM {i + 1}</span>
						{@render removeBtn(() => (content.usp.items = removeItem(content.usp.items, i)))}
					</div>
					<input bind:value={item.title} placeholder="Judul" class={inputClass} />
					<textarea
						bind:value={item.description}
						rows="2"
						placeholder="Deskripsi"
						class="{inputClass} resize-none"
					></textarea>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet pricingForm()}
	{@render textField(
		'Judul',
		() => content.pricing.title,
		(v) => (content.pricing.title = v)
	)}
	{@render areaField(
		'Deskripsi',
		() => content.pricing.description,
		(v) => (content.pricing.description = v)
	)}
	<div class="grid grid-cols-2 gap-4">
		{@render textField(
			'Label Card Tanggal',
			() => content.pricing.dateCard?.label || '',
			(v) => {
				if (content.pricing.dateCard) content.pricing.dateCard.label = v;
			}
		)}
		{@render textField(
			'Info Tanggal',
			() => content.pricing.dateCard?.date || '',
			(v) => {
				if (content.pricing.dateCard) content.pricing.dateCard.date = v;
			}
		)}
	</div>
	{@render textField(
		'Info Waktu (opsional)',
		() => content.pricing.dateCard?.time || '',
		(v) => {
			if (content.pricing.dateCard) content.pricing.dateCard.time = v;
		}
	)}
	<div class="grid grid-cols-2 gap-4">
		{@render textField(
			'Label Tombol',
			() => content.pricing.ctaLabel,
			(v) => (content.pricing.ctaLabel = v)
		)}
	</div>
	<div class="grid grid-cols-2 gap-4">
		{@render textField(
			'Harga Coret',
			() => content.pricing.originalPrice,
			(v) => (content.pricing.originalPrice = v)
		)}
		{@render textField(
			'Harga',
			() => content.pricing.price,
			(v) => (content.pricing.price = v)
		)}
	</div>
	{@render areaField(
		'Catatan Harga',
		() => content.pricing.note,
		(v) => (content.pricing.note = v)
	)}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Pilihan Paket',
			() =>
				(content.pricing.packages = addItem(content.pricing.packages, {
					code: '',
					title: '',
					description: '',
					image: '',
					lessons: [''],
					price: '',
					sessionPrice: '',
					ctaMessage: ''
				}))
		)}
		<div class="mt-3 space-y-3">
			{#each content.pricing.packages as pkg, i (pkg)}
				<div class="space-y-3 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">PAKET {i + 1}</span>
						{@render removeBtn(
							() => (content.pricing.packages = removeItem(content.pricing.packages, i))
						)}
					</div>
					<div class="grid gap-3 md:grid-cols-2">
						<input bind:value={pkg.code} placeholder="Kode, contoh: Paket A" class={inputClass} />
						<input bind:value={pkg.title} placeholder="Judul paket" class={inputClass} />
					</div>
					<textarea
						bind:value={pkg.description}
						rows="2"
						placeholder="Deskripsi singkat paket"
						class="{inputClass} resize-none"
					></textarea>
					{@render imageField(
						'Gambar Paket',
						`pricing-package-${i}`,
						() => pkg.image,
						(v) => (pkg.image = v)
					)}
					<div class="grid gap-3 md:grid-cols-2">
						<input bind:value={pkg.price} placeholder="Harga" class={inputClass} />
						<input
							bind:value={pkg.sessionPrice}
							placeholder="Info harga per sesi"
							class={inputClass}
						/>
					</div>
					<textarea
						bind:value={pkg.ctaMessage}
						rows="2"
						placeholder="Pesan WhatsApp khusus paket"
						class="{inputClass} resize-none"
					></textarea>
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span
								class="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400"
								>Materi Paket</span
							>
							<button
								type="button"
								onclick={() => (pkg.lessons = [...pkg.lessons, ''])}
								class="text-primary-600 hover:text-primary-700 flex cursor-pointer items-center gap-1 text-xs font-semibold"
							>
								+ Tambah materi
							</button>
						</div>
						{#each pkg.lessons as lesson, j (j)}
							<div class="flex items-center gap-2">
								<span class="text-xs font-bold text-gray-400">{j + 1}.</span>
								<input
									value={lesson}
									oninput={(e) => (pkg.lessons[j] = e.currentTarget.value)}
									placeholder="Materi"
									class={inputClass}
								/>
								{@render removeBtn(() => (pkg.lessons = removeItem(pkg.lessons, j)))}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Benefit Semua Paket',
			() => (content.pricing.packageBenefits = [...content.pricing.packageBenefits, ''])
		)}
		<div class="mt-3 space-y-2">
			{#each content.pricing.packageBenefits as benefit, i (i)}
				<div class="flex items-center gap-2">
					<span class="text-xs font-bold text-gray-400">{i + 1}.</span>
					<input
						value={benefit}
						oninput={(e) => (content.pricing.packageBenefits[i] = e.currentTarget.value)}
						placeholder="Benefit bersama"
						class={inputClass}
					/>
					{@render removeBtn(
						() => (content.pricing.packageBenefits = removeItem(content.pricing.packageBenefits, i))
					)}
				</div>
			{/each}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Termasuk Dalam Program',
			() => (content.pricing.programIncludes = [...content.pricing.programIncludes, ''])
		)}
		<div class="mt-3 space-y-2">
			{#each content.pricing.programIncludes as point, i (i)}
				<div class="flex items-center gap-2">
					<span class="text-xs font-bold text-gray-400">{i + 1}.</span>
					<input
						value={point}
						oninput={(e) => (content.pricing.programIncludes[i] = e.currentTarget.value)}
						placeholder="Poin benefit"
						class={inputClass}
					/>
					{@render removeBtn(
						() => (content.pricing.programIncludes = removeItem(content.pricing.programIncludes, i))
					)}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet curriculumForm()}
	{@render textField(
		'Judul',
		() => content.curriculum.title,
		(v) => (content.curriculum.title = v)
	)}
	{@render areaField(
		'Deskripsi',
		() => content.curriculum.description,
		(v) => (content.curriculum.description = v)
	)}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Jadwal Bootcamp',
			() =>
				(content.curriculum.schedule = addItem(content.curriculum.schedule, {
					stage: '',
					date: '',
					time: '',
					sessions: ['', ''],
					sessionSpeakers: ['', ''],
					outcome: ''
				}))
		)}
		<div class="mt-3 space-y-3">
			{#each content.curriculum.schedule as day, i}
				<div class="space-y-3 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">HARI {i + 1}</span>
						{@render removeBtn(
							() => (content.curriculum.schedule = removeItem(content.curriculum.schedule, i))
						)}
					</div>
					<input
						bind:value={day.stage}
						placeholder="Tahap, contoh: Foundation"
						class={inputClass}
					/>
					<input
						bind:value={day.date}
						placeholder="Tanggal, contoh: Sabtu, 27 Juni 2026"
						class={inputClass}
					/>
					<input
						bind:value={day.time}
						placeholder="Waktu (opsional), contoh: 08.30 - 12.00 WIB"
						class={inputClass}
					/>
					<div class="space-y-2">
						{#each day.sessions as _, j}
							<div class="grid gap-2 md:grid-cols-[72px_1fr_1fr_auto] md:items-center">
								<span class="text-xs font-bold text-gray-400">Sesi {j + 1}</span>
								<input bind:value={day.sessions[j]} placeholder="Judul sesi" class={inputClass} />
								<input
									bind:value={day.sessionSpeakers[j]}
									placeholder="Pemateri sesi"
									class={inputClass}
								/>
								{@render removeBtn(() => {
									day.sessions = removeItem(day.sessions, j);
									day.sessionSpeakers = removeItem(day.sessionSpeakers, j);
								})}
							</div>
						{/each}
						<button
							type="button"
							onclick={() => {
								day.sessions = [...day.sessions, ''];
								day.sessionSpeakers = [...day.sessionSpeakers, ''];
							}}
							class="text-primary-600 hover:text-primary-700 text-xs font-semibold"
							>+ Tambah sesi</button
						>
					</div>
					<textarea
						bind:value={day.outcome}
						rows="2"
						placeholder="Outcome hari ini"
						class="{inputClass} resize-none"
					></textarea>
				</div>
			{/each}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Hasil Akhir Peserta',
			() => (content.curriculum.outcomes = [...content.curriculum.outcomes, ''])
		)}
		<div class="mt-3 space-y-2">
			{#each content.curriculum.outcomes as _, i}
				<div class="flex items-center gap-2">
					<span class="text-xs font-bold text-gray-400">{i + 1}.</span>
					<input
						bind:value={content.curriculum.outcomes[i]}
						placeholder="Hasil akhir peserta"
						class={inputClass}
					/>
					{@render removeBtn(
						() => (content.curriculum.outcomes = removeItem(content.curriculum.outcomes, i))
					)}
				</div>
			{/each}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render areaField(
			'Disclaimer',
			() => content.curriculum.disclaimer,
			(v) => (content.curriculum.disclaimer = v)
		)}
		<div class="grid gap-3 md:grid-cols-2">
			{@render textField(
				'Judul CTA',
				() => content.curriculum.ctaTitle,
				(v) => (content.curriculum.ctaTitle = v)
			)}
			{@render textField(
				'Deskripsi CTA',
				() => content.curriculum.ctaDescription,
				(v) => (content.curriculum.ctaDescription = v)
			)}
			{@render textField(
				'Label CTA Utama',
				() => content.curriculum.primaryCta.label,
				(v) => (content.curriculum.primaryCta.label = v)
			)}
			{@render textField(
				'Link CTA Utama',
				() => content.curriculum.primaryCta.href,
				(v) => (content.curriculum.primaryCta.href = v)
			)}
			{@render textField(
				'Label CTA Kedua',
				() => content.curriculum.secondaryCta.label,
				(v) => (content.curriculum.secondaryCta.label = v)
			)}
			{@render textField(
				'Link CTA Kedua',
				() => content.curriculum.secondaryCta.href,
				(v) => (content.curriculum.secondaryCta.href = v)
			)}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Materi / Topik Ringkas',
			() => (content.curriculum.topics = [...content.curriculum.topics, ''])
		)}
		<div class="mt-3 space-y-2">
			{#each content.curriculum.topics as _, i}
				<div class="flex items-center gap-2">
					<span class="text-xs font-bold text-gray-400">{i + 1}.</span>
					<input
						bind:value={content.curriculum.topics[i]}
						placeholder="Judul topik"
						class={inputClass}
					/>
					{@render removeBtn(
						() => (content.curriculum.topics = removeItem(content.curriculum.topics, i))
					)}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet instructorsForm()}
	{@render textField(
		'Judul',
		() => content.instructors.title,
		(v) => (content.instructors.title = v)
	)}
	{@render areaField(
		'Deskripsi',
		() => content.instructors.description,
		(v) => (content.instructors.description = v)
	)}
	{@render areaField(
		'Penutup Section',
		() => content.instructors.closing,
		(v) => (content.instructors.closing = v)
	)}
	<div class="grid gap-3 md:grid-cols-2">
		{@render textField(
			'Judul CTA',
			() => content.instructors.ctaTitle,
			(v) => (content.instructors.ctaTitle = v)
		)}
		{@render textField(
			'Deskripsi CTA',
			() => content.instructors.ctaDescription,
			(v) => (content.instructors.ctaDescription = v)
		)}
		{@render textField(
			'Label CTA Utama',
			() => content.instructors.primaryCta.label,
			(v) => (content.instructors.primaryCta.label = v)
		)}
		{@render textField(
			'Link CTA Utama',
			() => content.instructors.primaryCta.href,
			(v) => (content.instructors.primaryCta.href = v)
		)}
		{@render textField(
			'Label CTA Kedua',
			() => content.instructors.secondaryCta.label,
			(v) => (content.instructors.secondaryCta.label = v)
		)}
		{@render textField(
			'Link CTA Kedua',
			() => content.instructors.secondaryCta.href,
			(v) => (content.instructors.secondaryCta.href = v)
		)}
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Pemateri',
			() =>
				(content.instructors.items = addItem(content.instructors.items, {
					badge: '',
					name: '',
					credentials: '',
					role: '',
					highlights: [''],
					description: '',
					photo: ''
				}))
		)}
		<div class="mt-3 space-y-3">
			{#each content.instructors.items as instructor, i}
				<div class="space-y-3 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">PEMATERI {i + 1}</span>
						{@render removeBtn(
							() => (content.instructors.items = removeItem(content.instructors.items, i))
						)}
					</div>
					<input bind:value={instructor.badge} placeholder="Badge bidang" class={inputClass} />
					<input bind:value={instructor.name} placeholder="Nama lengkap" class={inputClass} />
					<input
						bind:value={instructor.credentials}
						placeholder="Credential ringkas"
						class={inputClass}
					/>
					<input bind:value={instructor.role} placeholder="Jabatan" class={inputClass} />
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-[10px] font-bold text-gray-400">HIGHLIGHT KREDENSIAL</span>
							<button
								type="button"
								onclick={() => (instructor.highlights = addItem(instructor.highlights, ''))}
								class="text-primary-600 hover:text-primary-700 text-xs font-semibold"
							>
								+ Tambah
							</button>
						</div>
						{#each instructor.highlights as highlight, j}
							<div class="flex items-center gap-2">
								<input
									bind:value={instructor.highlights[j]}
									placeholder="Poin highlight"
									class={inputClass}
								/>
								{@render removeBtn(
									() => (instructor.highlights = removeItem(instructor.highlights, j))
								)}
							</div>
						{/each}
					</div>
					<textarea
						bind:value={instructor.description}
						rows="3"
						placeholder="Fokus Materi"
						class="{inputClass} resize-none"
					></textarea>
					{@render imageField(
						'Foto',
						`instructor-${i}`,
						() => instructor.photo,
						(v) => (instructor.photo = v)
					)}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet urgencyForm()}
	{@render textField(
		'Judul',
		() => content.urgency.title,
		(v) => (content.urgency.title = v)
	)}
	{@render areaField(
		'Deskripsi',
		() => content.urgency.description,
		(v) => (content.urgency.description = v)
	)}
	{@render textField(
		'Label Tombol',
		() => content.urgency.ctaLabel,
		(v) => (content.urgency.ctaLabel = v)
	)}
{/snippet}

{#snippet faqForm()}
	{@render textField(
		'Judul',
		() => content.faq.title,
		(v) => (content.faq.title = v)
	)}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Pertanyaan',
			() => (content.faq.items = addItem(content.faq.items, { question: '', answer: '' }))
		)}
		<div class="mt-3 space-y-3">
			{#each content.faq.items as item, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">FAQ {i + 1}</span>
						{@render removeBtn(() => (content.faq.items = removeItem(content.faq.items, i)))}
					</div>
					<input bind:value={item.question} placeholder="Pertanyaan" class={inputClass} />
					<textarea
						bind:value={item.answer}
						rows="3"
						placeholder="Jawaban"
						class="{inputClass} resize-none"
					></textarea>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet finalCtaForm()}
	{@render textField(
		'Judul',
		() => content.finalCta.title,
		(v) => (content.finalCta.title = v)
	)}
	{@render areaField(
		'Deskripsi',
		() => content.finalCta.description,
		(v) => (content.finalCta.description = v)
	)}
	{@render textField(
		'Label Tombol',
		() => content.finalCta.ctaLabel,
		(v) => (content.finalCta.ctaLabel = v)
	)}
{/snippet}
