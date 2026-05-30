<script lang="ts">
	import { goto, beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userAuth } from '$lib/auth.svelte';
	import {
		defaultLandingContent,
		fetchLandingContent,
		saveLandingContent,
		sectionCompleteness,
		seoCompleteness,
		SECTION_LABELS,
		type LandingContent,
		type SectionId
	} from '$lib/landingContent';

	const ADMIN_EMAILS = ['admin@cryptosharia.id'];

	const isAdmin = $derived(
		userAuth.isLoggedIn && userAuth.user?.email && ADMIN_EMAILS.includes(userAuth.user.email)
	);

	const SECTION_ORDER: SectionId[] = [
		'hero',
		'authority',
		'valueProps',
		'testimonials',
		'usp',
		'pricing',
		'curriculum',
		'urgency',
		'faq',
		'finalCta'
	];

	let content = $state<LandingContent>(structuredClone(defaultLandingContent));
	// Snapshot of last-saved content, used for dirty tracking + discard.
	let savedSnapshot = $state<string>('');
	let isLoading = $state(true);
	let isSaving = $state(false);
	let savedAt = $state<string | null>(null);
	let saveError = $state(false);
	let openSections = $state<Set<string>>(new Set(['layout']));
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

	function toggleSection(id: string) {
		const next = new Set(openSections);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		openSections = next;
	}

	function expandAll() {
		openSections = new Set(['layout', 'global', ...SECTION_ORDER]);
	}
	function collapseAll() {
		openSections = new Set();
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

	function matchesSearch(id: SectionId) {
		if (!searchQuery.trim()) return true;
		return SECTION_LABELS[id].toLowerCase().includes(searchQuery.trim().toLowerCase());
	}

	// ---- Generic list helpers ----
	function addItem<T>(arr: T[], template: T) {
		return [...arr, structuredClone(template)];
	}
	function removeItem<T>(arr: T[], index: number) {
		return arr.filter((_, i) => i !== index);
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
			><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/></svg
		>
	</div>
{:else if isAdmin}
	<div class="min-h-screen bg-gray-50 pt-20 pb-28 dark:bg-gray-950">
		<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
			<!-- ===== Header + mini dashboard ===== -->
			<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Editor Landing Page</h1>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
						Edit teks, gambar, item, urutan & SEO. Perubahan tampil di halaman publik setelah disimpan.
					</p>
				</div>
				<div class="flex shrink-0 gap-2">
					<a
						href="/"
						target="_blank"
						class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
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
			</div>

			<!-- Stat strip -->
			<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
				<div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
					<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Section</p>
					<p class="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">{content.layout.length}</p>
				</div>
				<div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
					<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Tampil / Sembunyi</p>
					<p class="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
						<span class="text-emerald-600 dark:text-emerald-400">{visibleCount}</span>
						<span class="text-gray-300 dark:text-gray-600">/</span>
						<span class="text-gray-400">{hiddenCount}</span>
					</p>
				</div>
				<div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
					<p class="text-xs font-medium text-gray-500 dark:text-gray-400">SEO Lengkap</p>
					<div class="mt-2 flex items-center gap-2">
						<div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
							<div
								class="h-full rounded-full {seoPct >= 75 ? 'bg-emerald-500' : seoPct >= 50 ? 'bg-amber-500' : 'bg-red-500'}"
								style="width: {seoPct}%"
							></div>
						</div>
						<span class="text-xs font-bold text-gray-700 dark:text-gray-200">{seoPct}%</span>
					</div>
				</div>
				<div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
					<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
					<p class="mt-1 text-sm font-bold {isDirty ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">
						{#if isDirty}● Belum disimpan{:else}✓ Tersimpan{/if}
					</p>
					{#if savedAt}<p class="mt-0.5 text-[11px] text-gray-400">pukul {savedAt}</p>{/if}
				</div>
			</div>

			<!-- Toolbar: search + expand/collapse -->
			<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div class="relative max-w-xs flex-1">
					<svg class="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
					<input bind:value={searchQuery} placeholder="Cari section..." class="{inputClass} pl-9" />
				</div>
				<div class="flex gap-2">
					<button type="button" onclick={expandAll} class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Buka Semua</button>
					<button type="button" onclick={collapseAll} class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Tutup Semua</button>
				</div>
			</div>

			<!-- ===== GROUP 1: Pengaturan Utama ===== -->
			<h2 class="mt-6 mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">Pengaturan Utama</h2>

			<!-- Section order / visibility (control panel — emphasised) -->
			<div class="mb-4 overflow-hidden rounded-xl border-l-4 border-primary-500 border-y border-r border-y-gray-200 border-r-gray-200 bg-white dark:border-y-gray-700 dark:border-r-gray-700 dark:bg-gray-800">
				<button type="button" onclick={() => toggleSection('layout')} class="flex w-full items-center justify-between px-5 py-4 text-left">
					<span class="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
						<span class="rounded-md bg-primary-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary-700 uppercase dark:bg-primary-900/40 dark:text-primary-300">Kontrol</span>
						Urutan & Tampilan Section
					</span>
					<span class="text-gray-400">{openSections.has('layout') ? '−' : '+'}</span>
				</button>
				{#if openSections.has('layout')}
					<div class="border-t border-gray-100 p-5 dark:border-gray-700">
						<p class="mb-4 text-xs text-gray-500 dark:text-gray-400">
							Atur urutan tampil dengan tombol panah, dan matikan toggle untuk menyembunyikan section dari halaman publik.
						</p>
						<div class="space-y-2">
							{#each content.layout as entry, i (entry.id)}
								<div class="flex items-center gap-3 rounded-lg border px-3 py-2.5 {entry.visible ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900' : 'border-dashed border-gray-300 bg-gray-100/50 dark:border-gray-600 dark:bg-gray-900/40'}">
									<div class="flex flex-col">
										<button type="button" onclick={() => moveSection(i, -1)} disabled={i === 0} class="cursor-pointer text-gray-400 hover:text-primary-600 disabled:opacity-20" aria-label="Naik">
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" /></svg>
										</button>
										<button type="button" onclick={() => moveSection(i, 1)} disabled={i === content.layout.length - 1} class="cursor-pointer text-gray-400 hover:text-primary-600 disabled:opacity-20" aria-label="Turun">
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
										</button>
									</div>
									<span class="flex-1 text-sm font-semibold {entry.visible ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}">
										{i + 1}. {SECTION_LABELS[entry.id]}
									</span>
									<label class="inline-flex cursor-pointer items-center gap-2">
										<input type="checkbox" checked={entry.visible} onchange={() => toggleVisible(i)} class="peer sr-only" />
										<span class="relative h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-primary-600 dark:bg-gray-600 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4"></span>
										<span class="w-14 text-xs font-medium {entry.visible ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}">{entry.visible ? 'Tampil' : 'Sembunyi'}</span>
									</label>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Global / SEO + WhatsApp -->
			{@render accordion('global', '🌐 Pengaturan Umum (WhatsApp & SEO)', globalForm, seoPct === 100 ? 'lengkap' : `SEO ${seoPct}%`, seoPct === 100)}

			<!-- ===== GROUP 2: Konten Landing Page ===== -->
			<h2 class="mt-8 mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">Konten Landing Page</h2>

			{#each SECTION_ORDER as id, idx (id)}
				{#if matchesSearch(id)}
					{@const comp = sectionCompleteness(content, id)}
					{@render accordion(
						id,
						`${idx + 1}. ${SECTION_LABELS[id]}`,
						sectionForm,
						`${comp.filled}/${comp.total} terisi`,
						comp.filled === comp.total,
						id
					)}
				{/if}
			{/each}

			{#if searchQuery.trim() && !SECTION_ORDER.some((id) => matchesSearch(id))}
				<p class="py-8 text-center text-sm text-gray-400">Tidak ada section yang cocok dengan "{searchQuery}".</p>
			{/if}

			<!-- ===== GROUP 3: Lanjutan ===== -->
			<h2 class="mt-8 mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">Lanjutan</h2>
			<div class="rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
				<div class="flex items-center justify-between gap-4">
					<div>
						<p class="text-sm font-bold text-red-700 dark:text-red-300">Reset Semua Konten ke Default</p>
						<p class="mt-0.5 text-xs text-red-500/80 dark:text-red-400/80">Mengembalikan seluruh konten ke bawaan sistem. Tidak bisa dibatalkan.</p>
					</div>
					<button type="button" onclick={() => (showResetModal = true)} class="shrink-0 cursor-pointer rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30">
						Reset
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Sticky save bar -->
	<div class="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95">
		<div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
			<span class="text-sm font-medium {saveError ? 'text-red-600 dark:text-red-400' : isDirty ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">
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
				<button type="button" onclick={discardChanges} disabled={!isDirty} class="cursor-pointer rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
					Batalkan
				</button>
				<button type="button" onclick={save} disabled={isSaving || !isDirty} class="bg-primary-600 hover:bg-primary-700 cursor-pointer rounded-lg px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50">
					{isSaving ? 'Menyimpan...' : 'Simpan ke Landing Page'}
				</button>
			</div>
		</div>
	</div>

	<!-- Reset confirmation modal -->
	{#if showResetModal}
		<div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
			<button aria-label="Tutup" onclick={() => (showResetModal = false)} class="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"></button>
			<div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
				<h2 class="text-lg font-extrabold text-gray-900 dark:text-white">Reset Semua Konten?</h2>
				<p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
					Tindakan ini akan menghapus perubahan landing page saat ini dan mengembalikan konten ke bawaan sistem. Tindakan ini tidak bisa dibatalkan. Kamu tetap perlu klik <strong>Simpan</strong> agar tersimpan ke halaman publik.
				</p>
				<div class="mt-6 flex justify-end gap-3">
					<button type="button" onclick={() => (showResetModal = false)} class="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
					<button type="button" onclick={confirmReset} class="cursor-pointer rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700">Ya, Reset Semua</button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<!-- ============ Reusable accordion wrapper ============ -->
{#snippet accordion(
	id: string,
	title: string,
	body: (sid?: SectionId) => any,
	statusLabel: string,
	statusOk: boolean,
	sectionId?: SectionId
)}
	{@const open = openSections.has(id)}
	{@const hidden = sectionId ? !isSectionVisible(sectionId) : false}
	<div class="mb-4 overflow-hidden rounded-xl border bg-white transition-all dark:bg-gray-800 {open ? 'border-l-4 border-l-primary-500 border-y-gray-200 border-r-gray-200 dark:border-y-gray-700 dark:border-r-gray-700' : 'border-gray-200 dark:border-gray-700'}">
		<button type="button" onclick={() => toggleSection(id)} class="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
			<span class="font-bold text-gray-900 dark:text-white">{title}</span>
			<span class="flex items-center gap-2">
				{#if hidden}
					<span class="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase dark:bg-gray-700 dark:text-gray-400">Hidden</span>
				{/if}
				<span class="hidden items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline-flex {statusOk ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}">
					{statusOk ? '✓' : '!'} {statusLabel}
				</span>
				<span class="text-gray-400">{open ? '−' : '+'}</span>
			</span>
		</button>
		{#if open}
			<div class="space-y-4 border-t border-gray-100 p-5 dark:border-gray-700">
				{@render body(sectionId)}
			</div>
		{/if}
	</div>
{/snippet}

<!-- Dispatcher so each content section renders its own form -->
{#snippet sectionForm(sid?: SectionId)}
	{#if sid === 'hero'}{@render heroForm()}
	{:else if sid === 'authority'}{@render authorityForm()}
	{:else if sid === 'valueProps'}{@render valuePropsForm()}
	{:else if sid === 'testimonials'}{@render testimonialsForm()}
	{:else if sid === 'usp'}{@render uspForm()}
	{:else if sid === 'pricing'}{@render pricingForm()}
	{:else if sid === 'curriculum'}{@render curriculumForm()}
	{:else if sid === 'urgency'}{@render urgencyForm()}
	{:else if sid === 'faq'}{@render faqForm()}
	{:else if sid === 'finalCta'}{@render finalCtaForm()}
	{/if}
{/snippet}

<!-- ============ Field snippets ============ -->
{#snippet textField(label: string, getVal: () => string, setVal: (v: string) => void)}
	<div>
		<span class={labelClass}>{label}</span>
		<input type="text" value={getVal()} oninput={(e) => setVal(e.currentTarget.value)} class={inputClass} />
	</div>
{/snippet}

{#snippet areaField(label: string, getVal: () => string, setVal: (v: string) => void)}
	<div>
		<span class={labelClass}>{label}</span>
		<textarea value={getVal()} oninput={(e) => setVal(e.currentTarget.value)} rows="3" class="{inputClass} resize-none"></textarea>
	</div>
{/snippet}

{#snippet listHeader(title: string, onAdd: () => void)}
	<div class="flex items-center justify-between">
		<span class="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">{title}</span>
		<button type="button" onclick={onAdd} class="text-primary-600 hover:text-primary-700 flex cursor-pointer items-center gap-1 text-xs font-semibold">
			<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
			Tambah
		</button>
	</div>
{/snippet}

{#snippet removeBtn(onRemove: () => void)}
	<button type="button" onclick={onRemove} class="cursor-pointer text-red-400 hover:text-red-600" aria-label="Hapus item">
		<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
	</button>
{/snippet}

<!-- ============ Section forms ============ -->
{#snippet globalForm()}
	{@render textField('Nomor WhatsApp (cth. 6281234567890)', () => content.whatsapp.phone, (v) => (content.whatsapp.phone = v))}
	{@render areaField('Pesan WhatsApp Otomatis', () => content.whatsapp.message, (v) => (content.whatsapp.message = v))}
	<!-- WhatsApp preview -->
	<div class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900/40 dark:bg-green-950/20">
		<p class="mb-2 text-[10px] font-bold tracking-wide text-green-700 uppercase dark:text-green-400">Preview Pesan WhatsApp</p>
		<div class="rounded-lg rounded-tl-none bg-white p-3 text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200">
			{content.whatsapp.message || 'Pesan kosong...'}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700"></div>
	{@render textField('Judul Browser / SEO Title', () => content.seo.title, (v) => (content.seo.title = v))}
	{@render areaField('Meta Description', () => content.seo.description, (v) => (content.seo.description = v))}
	<!-- Google preview -->
	<div class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
		<p class="mb-2 text-[10px] font-bold tracking-wide text-gray-400 uppercase">Preview Hasil Pencarian Google</p>
		<p class="truncate text-xs text-emerald-700 dark:text-emerald-500">https://cryptosharia.id</p>
		<p class="truncate text-base font-medium text-blue-700 dark:text-blue-400">{content.seo.title || 'Judul halaman...'}</p>
		<p class="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{content.seo.description || 'Meta description...'}</p>
	</div>
{/snippet}

{#snippet heroForm()}
	{@render textField('Badge', () => content.hero.badge, (v) => (content.hero.badge = v))}
	{@render textField('Judul Utama', () => content.hero.title, (v) => (content.hero.title = v))}
	{@render areaField('Subjudul', () => content.hero.subtitle, (v) => (content.hero.subtitle = v))}
	{@render areaField('Deskripsi', () => content.hero.description, (v) => (content.hero.description = v))}
	{@render textField('Label Tombol Utama', () => content.hero.primaryCtaLabel, (v) => (content.hero.primaryCtaLabel = v))}
	<div class="grid grid-cols-2 gap-4">
		{@render textField('Tombol Kedua (label)', () => content.hero.secondaryCta.label, (v) => (content.hero.secondaryCta.label = v))}
		{@render textField('Tombol Kedua (link)', () => content.hero.secondaryCta.href, (v) => (content.hero.secondaryCta.href = v))}
	</div>
	{@render textField('Label Video', () => content.hero.videoLabel, (v) => (content.hero.videoLabel = v))}
	{@render textField('Judul Video', () => content.hero.videoTitle, (v) => (content.hero.videoTitle = v))}
	{@render areaField('Deskripsi Video', () => content.hero.videoDescription, (v) => (content.hero.videoDescription = v))}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader('Highlight Aset', () => (content.hero.highlights = addItem(content.hero.highlights, { symbol: '', performance: '' })))}
		<div class="mt-3 space-y-2">
			{#each content.hero.highlights as h, i}
				<div class="flex items-center gap-2 {cardClass}">
					<input bind:value={h.symbol} placeholder="Simbol" class={inputClass} />
					<input bind:value={h.performance} placeholder="cth. +400%" class={inputClass} />
					{@render removeBtn(() => (content.hero.highlights = removeItem(content.hero.highlights, i)))}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet authorityForm()}
	{@render textField('Eyebrow', () => content.authority.eyebrow, (v) => (content.authority.eyebrow = v))}
	{@render textField('Judul', () => content.authority.title, (v) => (content.authority.title = v))}
	{@render areaField('Deskripsi', () => content.authority.description, (v) => (content.authority.description = v))}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader('Aktivitas Komunitas', () => (content.authority.activities = addItem(content.authority.activities, { meta: '', title: '', description: '' })))}
		<div class="mt-3 space-y-3">
			{#each content.authority.activities as a, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">ITEM {i + 1}</span>
						{@render removeBtn(() => (content.authority.activities = removeItem(content.authority.activities, i)))}
					</div>
					<input bind:value={a.meta} placeholder="Label (cth. Live mentoring)" class={inputClass} />
					<input bind:value={a.title} placeholder="Judul" class={inputClass} />
					<textarea bind:value={a.description} rows="2" placeholder="Deskripsi" class="{inputClass} resize-none"></textarea>
				</div>
			{/each}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader('Kartu Bawah', () => (content.authority.cards = addItem(content.authority.cards, { label: '', description: '' })))}
		<div class="mt-3 space-y-3">
			{#each content.authority.cards as c, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">KARTU {i + 1}</span>
						{@render removeBtn(() => (content.authority.cards = removeItem(content.authority.cards, i)))}
					</div>
					<input bind:value={c.label} placeholder="Label" class={inputClass} />
					<textarea bind:value={c.description} rows="2" placeholder="Deskripsi" class="{inputClass} resize-none"></textarea>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet valuePropsForm()}
	{@render textField('Eyebrow', () => content.valueProps.eyebrow, (v) => (content.valueProps.eyebrow = v))}
	{@render textField('Judul', () => content.valueProps.title, (v) => (content.valueProps.title = v))}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader('Item Manfaat', () => (content.valueProps.items = addItem(content.valueProps.items, { label: '', title: '', description: '' })))}
		<div class="mt-3 space-y-3">
			{#each content.valueProps.items as item, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">ITEM {i + 1}</span>
						{@render removeBtn(() => (content.valueProps.items = removeItem(content.valueProps.items, i)))}
					</div>
					<input bind:value={item.label} placeholder="Nomor/label (cth. 01)" class={inputClass} />
					<input bind:value={item.title} placeholder="Judul" class={inputClass} />
					<textarea bind:value={item.description} rows="2" placeholder="Deskripsi" class="{inputClass} resize-none"></textarea>
				</div>
			{/each}
		</div>
	</div>
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render textField('Dokumentasi — Eyebrow', () => content.valueProps.docEyebrow, (v) => (content.valueProps.docEyebrow = v))}
		{@render textField('Dokumentasi — Judul', () => content.valueProps.docTitle, (v) => (content.valueProps.docTitle = v))}
		{@render areaField('Dokumentasi — Deskripsi', () => content.valueProps.docDescription, (v) => (content.valueProps.docDescription = v))}
	</div>
{/snippet}

{#snippet testimonialsForm()}
	{@render textField('Eyebrow', () => content.testimonials.eyebrow, (v) => (content.testimonials.eyebrow = v))}
	{@render textField('Judul', () => content.testimonials.title, (v) => (content.testimonials.title = v))}
	{@render areaField('Deskripsi', () => content.testimonials.description, (v) => (content.testimonials.description = v))}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader('Testimoni', () => (content.testimonials.items = addItem(content.testimonials.items, { meta: '', title: '', description: '' })))}
		<div class="mt-3 space-y-3">
			{#each content.testimonials.items as item, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">ITEM {i + 1}</span>
						{@render removeBtn(() => (content.testimonials.items = removeItem(content.testimonials.items, i)))}
					</div>
					<input bind:value={item.meta} placeholder="Label (cth. Discord Community)" class={inputClass} />
					<input bind:value={item.title} placeholder="Kutipan singkat" class={inputClass} />
					<textarea bind:value={item.description} rows="2" placeholder="Deskripsi" class="{inputClass} resize-none"></textarea>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet uspForm()}
	{@render textField('Eyebrow', () => content.usp.eyebrow, (v) => (content.usp.eyebrow = v))}
	{@render textField('Judul', () => content.usp.title, (v) => (content.usp.title = v))}
	{@render areaField('Kutipan / Quote', () => content.usp.quote, (v) => (content.usp.quote = v))}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader('Keunggulan', () => (content.usp.items = addItem(content.usp.items, { label: '', title: '', description: '' })))}
		<div class="mt-3 space-y-3">
			{#each content.usp.items as item, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">ITEM {i + 1}</span>
						{@render removeBtn(() => (content.usp.items = removeItem(content.usp.items, i)))}
					</div>
					<input bind:value={item.label} placeholder="Label (cth. Practice)" class={inputClass} />
					<input bind:value={item.title} placeholder="Judul" class={inputClass} />
					<textarea bind:value={item.description} rows="2" placeholder="Deskripsi" class="{inputClass} resize-none"></textarea>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet pricingForm()}
	{@render textField('Eyebrow', () => content.pricing.eyebrow, (v) => (content.pricing.eyebrow = v))}
	{@render textField('Judul', () => content.pricing.title, (v) => (content.pricing.title = v))}
	{@render areaField('Deskripsi', () => content.pricing.description, (v) => (content.pricing.description = v))}
	<div class="grid grid-cols-2 gap-4">
		{@render textField('Badge Harga', () => content.pricing.priceBadge, (v) => (content.pricing.priceBadge = v))}
		{@render textField('Label Tombol', () => content.pricing.ctaLabel, (v) => (content.pricing.ctaLabel = v))}
	</div>
	<div class="grid grid-cols-2 gap-4">
		{@render textField('Harga Coret', () => content.pricing.originalPrice, (v) => (content.pricing.originalPrice = v))}
		{@render textField('Harga', () => content.pricing.price, (v) => (content.pricing.price = v))}
	</div>
	{@render areaField('Catatan Harga', () => content.pricing.note, (v) => (content.pricing.note = v))}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader('Kartu Benefit', () => (content.pricing.benefitCards = addItem(content.pricing.benefitCards, { title: '', items: [''] })))}
		<div class="mt-3 space-y-3">
			{#each content.pricing.benefitCards as card, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">KARTU {i + 1}</span>
						{@render removeBtn(() => (content.pricing.benefitCards = removeItem(content.pricing.benefitCards, i)))}
					</div>
					<input bind:value={card.title} placeholder="Judul kartu" class={inputClass} />
					<div class="space-y-2">
						{#each card.items as _, j}
							<div class="flex items-center gap-2">
								<input bind:value={card.items[j]} placeholder="Poin benefit" class={inputClass} />
								{@render removeBtn(() => (card.items = removeItem(card.items, j)))}
							</div>
						{/each}
						<button type="button" onclick={() => (card.items = [...card.items, ''])} class="text-primary-600 hover:text-primary-700 text-xs font-semibold">+ Tambah poin</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet curriculumForm()}
	{@render textField('Eyebrow', () => content.curriculum.eyebrow, (v) => (content.curriculum.eyebrow = v))}
	{@render textField('Judul', () => content.curriculum.title, (v) => (content.curriculum.title = v))}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader('Materi / Topik', () => (content.curriculum.topics = [...content.curriculum.topics, '']))}
		<div class="mt-3 space-y-2">
			{#each content.curriculum.topics as _, i}
				<div class="flex items-center gap-2">
					<span class="text-xs font-bold text-gray-400">{i + 1}.</span>
					<input bind:value={content.curriculum.topics[i]} placeholder="Judul topik" class={inputClass} />
					{@render removeBtn(() => (content.curriculum.topics = removeItem(content.curriculum.topics, i)))}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet urgencyForm()}
	{@render textField('Eyebrow', () => content.urgency.eyebrow, (v) => (content.urgency.eyebrow = v))}
	{@render textField('Judul', () => content.urgency.title, (v) => (content.urgency.title = v))}
	{@render areaField('Deskripsi', () => content.urgency.description, (v) => (content.urgency.description = v))}
	{@render textField('Label Tombol', () => content.urgency.ctaLabel, (v) => (content.urgency.ctaLabel = v))}
{/snippet}

{#snippet faqForm()}
	{@render textField('Eyebrow', () => content.faq.eyebrow, (v) => (content.faq.eyebrow = v))}
	{@render textField('Judul', () => content.faq.title, (v) => (content.faq.title = v))}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader('Pertanyaan', () => (content.faq.items = addItem(content.faq.items, { question: '', answer: '' })))}
		<div class="mt-3 space-y-3">
			{#each content.faq.items as item, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">FAQ {i + 1}</span>
						{@render removeBtn(() => (content.faq.items = removeItem(content.faq.items, i)))}
					</div>
					<input bind:value={item.question} placeholder="Pertanyaan" class={inputClass} />
					<textarea bind:value={item.answer} rows="3" placeholder="Jawaban" class="{inputClass} resize-none"></textarea>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet finalCtaForm()}
	{@render textField('Eyebrow', () => content.finalCta.eyebrow, (v) => (content.finalCta.eyebrow = v))}
	{@render textField('Judul', () => content.finalCta.title, (v) => (content.finalCta.title = v))}
	{@render areaField('Deskripsi', () => content.finalCta.description, (v) => (content.finalCta.description = v))}
	{@render textField('Label Tombol', () => content.finalCta.ctaLabel, (v) => (content.finalCta.ctaLabel = v))}
{/snippet}
