<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userAuth } from '$lib/auth.svelte';
	import {
		defaultLandingContent,
		fetchLandingContent,
		saveLandingContent,
		SECTION_LABELS,
		type LandingContent,
		type SectionId
	} from '$lib/landingContent';

	const ADMIN_EMAILS = ['admin@cryptosharia.id'];

	const isAdmin = $derived(
		userAuth.isLoggedIn && userAuth.user?.email && ADMIN_EMAILS.includes(userAuth.user.email)
	);

	let content = $state<LandingContent>(structuredClone(defaultLandingContent));
	let isLoading = $state(true);
	let isSaving = $state(false);
	let savedAt = $state<string | null>(null);
	let openSection = $state<SectionId | 'global' | null>('global');

	$effect(() => {
		if (!userAuth.loading && !isAdmin) {
			goto('/');
		}
	});

	onMount(async () => {
		content = await fetchLandingContent();
		isLoading = false;
	});

	function toggleSection(id: SectionId | 'global') {
		openSection = openSection === id ? null : id;
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

	// ---- Generic list helpers ----
	function addItem<T>(arr: T[], template: T) {
		return [...arr, structuredClone(template)];
	}
	function removeItem<T>(arr: T[], index: number) {
		return arr.filter((_, i) => i !== index);
	}

	async function save() {
		isSaving = true;
		try {
			await saveLandingContent($state.snapshot(content));
			savedAt = new Date().toLocaleTimeString('id-ID');
		} catch (e) {
			console.error(e);
			alert('Gagal menyimpan. Coba lagi.');
		} finally {
			isSaving = false;
		}
	}

	function resetToDefault() {
		if (!confirm('Kembalikan SEMUA konten ke bawaan? Perubahan tersimpan akan tertimpa.')) return;
		content = structuredClone(defaultLandingContent);
	}

	const inputClass =
		'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white';
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
	<div class="min-h-screen bg-gray-50 pt-20 pb-24 dark:bg-gray-950">
		<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
			<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Editor Landing Page</h1>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Edit teks, tambah/kurang item, sembunyikan & urutkan section. Perubahan tampil setelah
						disimpan.
					</p>
				</div>
				<a
					href="/"
					target="_blank"
					class="flex items-center gap-2 self-start rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
				>
					Lihat Halaman
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

			<!-- ===== Section order / visibility ===== -->
			<div
				class="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
			>
				<button
					type="button"
					onclick={() => toggleSection('global')}
					class="flex w-full items-center justify-between px-5 py-4 text-left"
				>
					<span class="font-bold text-gray-900 dark:text-white">⚙️ Urutan & Tampilan Section</span>
					<span class="text-gray-400">{openSection === 'global' ? '−' : '+'}</span>
				</button>
				{#if openSection === 'global'}
					<div class="border-t border-gray-100 p-5 dark:border-gray-700">
						<p class="mb-4 text-xs text-gray-500 dark:text-gray-400">
							Atur urutan tampil dengan tombol panah, dan matikan toggle untuk menyembunyikan
							section dari halaman.
						</p>
						<div class="space-y-2">
							{#each content.layout as entry, i (entry.id)}
								<div
									class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900"
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
									<span class="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
										{i + 1}. {SECTION_LABELS[entry.id]}
									</span>
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
											class="text-xs font-medium {entry.visible
												? 'text-primary-600'
												: 'text-gray-400'}">{entry.visible ? 'Tampil' : 'Sembunyi'}</span
										>
									</label>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- ===== Global / shared ===== -->
			{@render accordion('global', '🌐 Pengaturan Umum (WhatsApp & SEO)', globalForm)}

			<!-- ===== Per-section editors ===== -->
			{@render accordion('hero', '1. ' + SECTION_LABELS.hero, heroForm)}
			{@render accordion('authority', '2. ' + SECTION_LABELS.authority, authorityForm)}
			{@render accordion('valueProps', '3. ' + SECTION_LABELS.valueProps, valuePropsForm)}
			{@render accordion('testimonials', '4. ' + SECTION_LABELS.testimonials, testimonialsForm)}
			{@render accordion('usp', '5. ' + SECTION_LABELS.usp, uspForm)}
			{@render accordion('pricing', '6. ' + SECTION_LABELS.pricing, pricingForm)}
			{@render accordion('curriculum', '7. ' + SECTION_LABELS.curriculum, curriculumForm)}
			{@render accordion('urgency', '8. ' + SECTION_LABELS.urgency, urgencyForm)}
			{@render accordion('faq', '9. ' + SECTION_LABELS.faq, faqForm)}
			{@render accordion('finalCta', '10. ' + SECTION_LABELS.finalCta, finalCtaForm)}

			<div class="mt-6 flex justify-between">
				<button
					type="button"
					onclick={resetToDefault}
					class="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
				>
					Reset ke Bawaan
				</button>
			</div>
		</div>
	</div>

	<!-- Sticky save bar -->
	<div
		class="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95"
	>
		<div
			class="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
		>
			<span class="text-xs text-gray-500 dark:text-gray-400">
				{#if savedAt}✅ Tersimpan pukul {savedAt}{:else}Belum disimpan{/if}
			</span>
			<button
				type="button"
				onclick={save}
				disabled={isSaving}
				class="bg-primary-600 hover:bg-primary-700 cursor-pointer rounded-lg px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50"
			>
				{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
			</button>
		</div>
	</div>
{/if}

<!-- ============ Reusable accordion wrapper ============ -->
{#snippet accordion(id: SectionId | 'global', title: string, body: () => any)}
	<div
		class="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
	>
		<button
			type="button"
			onclick={() => toggleSection(id)}
			class="flex w-full items-center justify-between px-5 py-4 text-left"
		>
			<span class="font-bold text-gray-900 dark:text-white">{title}</span>
			<span class="text-gray-400">{openSection === id ? '−' : '+'}</span>
		</button>
		{#if openSection === id}
			<div class="space-y-4 border-t border-gray-100 p-5 dark:border-gray-700">
				{@render body()}
			</div>
		{/if}
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

<!-- ============ Section forms ============ -->
{#snippet globalForm()}
	{@render textField(
		'Nomor WhatsApp (cth. 6281234567890)',
		() => content.whatsapp.phone,
		(v) => (content.whatsapp.phone = v)
	)}
	{@render areaField(
		'Pesan WhatsApp Otomatis',
		() => content.whatsapp.message,
		(v) => (content.whatsapp.message = v)
	)}
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
	{@render textField(
		'Label Video',
		() => content.hero.videoLabel,
		(v) => (content.hero.videoLabel = v)
	)}
	{@render textField(
		'Judul Video',
		() => content.hero.videoTitle,
		(v) => (content.hero.videoTitle = v)
	)}
	{@render areaField(
		'Deskripsi Video',
		() => content.hero.videoDescription,
		(v) => (content.hero.videoDescription = v)
	)}
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
		'Eyebrow',
		() => content.authority.eyebrow,
		(v) => (content.authority.eyebrow = v)
	)}
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
					description: ''
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
					<input bind:value={a.meta} placeholder="Label (cth. Live mentoring)" class={inputClass} />
					<input bind:value={a.title} placeholder="Judul" class={inputClass} />
					<textarea
						bind:value={a.description}
						rows="2"
						placeholder="Deskripsi"
						class="{inputClass} resize-none"
					></textarea>
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
		'Eyebrow',
		() => content.valueProps.eyebrow,
		(v) => (content.valueProps.eyebrow = v)
	)}
	{@render textField(
		'Judul',
		() => content.valueProps.title,
		(v) => (content.valueProps.title = v)
	)}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Item Value',
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
					<input bind:value={item.label} placeholder="Nomor/label (cth. 01)" class={inputClass} />
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
			'Dokumentasi — Eyebrow',
			() => content.valueProps.docEyebrow,
			(v) => (content.valueProps.docEyebrow = v)
		)}
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
{/snippet}

{#snippet testimonialsForm()}
	{@render textField(
		'Eyebrow',
		() => content.testimonials.eyebrow,
		(v) => (content.testimonials.eyebrow = v)
	)}
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
					<input
						bind:value={item.meta}
						placeholder="Label (cth. Discord Community)"
						class={inputClass}
					/>
					<input bind:value={item.title} placeholder="Kutipan singkat" class={inputClass} />
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

{#snippet uspForm()}
	{@render textField(
		'Eyebrow',
		() => content.usp.eyebrow,
		(v) => (content.usp.eyebrow = v)
	)}
	{@render textField(
		'Judul',
		() => content.usp.title,
		(v) => (content.usp.title = v)
	)}
	{@render areaField(
		'Kutipan / Quote',
		() => content.usp.quote,
		(v) => (content.usp.quote = v)
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
					<input bind:value={item.label} placeholder="Label (cth. Practice)" class={inputClass} />
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
		'Eyebrow',
		() => content.pricing.eyebrow,
		(v) => (content.pricing.eyebrow = v)
	)}
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
			'Badge Harga',
			() => content.pricing.priceBadge,
			(v) => (content.pricing.priceBadge = v)
		)}
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
			'Kartu Benefit',
			() =>
				(content.pricing.benefitCards = addItem(content.pricing.benefitCards, {
					title: '',
					items: ['']
				}))
		)}
		<div class="mt-3 space-y-3">
			{#each content.pricing.benefitCards as card, i}
				<div class="space-y-2 {cardClass}">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold text-gray-400">KARTU {i + 1}</span>
						{@render removeBtn(
							() => (content.pricing.benefitCards = removeItem(content.pricing.benefitCards, i))
						)}
					</div>
					<input bind:value={card.title} placeholder="Judul kartu" class={inputClass} />
					<div class="space-y-2">
						{#each card.items as _, j}
							<div class="flex items-center gap-2">
								<input bind:value={card.items[j]} placeholder="Poin benefit" class={inputClass} />
								{@render removeBtn(() => (card.items = removeItem(card.items, j)))}
							</div>
						{/each}
						<button
							type="button"
							onclick={() => (card.items = [...card.items, ''])}
							class="text-primary-600 hover:text-primary-700 text-xs font-semibold"
							>+ Tambah poin</button
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet curriculumForm()}
	{@render textField(
		'Eyebrow',
		() => content.curriculum.eyebrow,
		(v) => (content.curriculum.eyebrow = v)
	)}
	{@render textField(
		'Judul',
		() => content.curriculum.title,
		(v) => (content.curriculum.title = v)
	)}
	<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
		{@render listHeader(
			'Materi / Topik',
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

{#snippet urgencyForm()}
	{@render textField(
		'Eyebrow',
		() => content.urgency.eyebrow,
		(v) => (content.urgency.eyebrow = v)
	)}
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
		'Eyebrow',
		() => content.faq.eyebrow,
		(v) => (content.faq.eyebrow = v)
	)}
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
		'Eyebrow',
		() => content.finalCta.eyebrow,
		(v) => (content.finalCta.eyebrow = v)
	)}
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
