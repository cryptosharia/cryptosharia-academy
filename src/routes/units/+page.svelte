<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, query, getDocs, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let activeCategory = $state('Semua');
	const categories = [
		'Semua',
		'Blockchain',
		'Syariah',
		'Trading',
		'DeFi',
		'Development',
		'Data & AI',
		'Security'
	];

	interface Unit {
		id?: string;
		title: string;
		topics: number;
		duration: string;
		category: string;
		image: string;
		price?: number;
		originalPrice?: number;
	}

	let units = $state<Unit[]>([]);
	let isLoadingUnits = $state(true);
	let loadError = $state<string | null>(null);

	async function loadUnits() {
		isLoadingUnits = true;
		loadError = null;
		try {
			const q = query(collection(db, 'elearning_courses'), orderBy('createdAt', 'desc'));
			const snap = await getDocs(q);
			units = snap.docs.map((doc) => ({
				id: doc.id,
				price: 49000,
				originalPrice: 299000,
				...doc.data()
			})) as Unit[];
		} catch (error: any) {
			console.error('Failed to load units:', error);
			if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
				loadError = 'Akses ditolak. Silakan hubungi admin untuk memperbaiki konfigurasi database.';
			} else {
				loadError = 'Gagal memuat materi. Silakan coba lagi.';
			}
		} finally {
			isLoadingUnits = false;
		}
	}

	onMount(loadUnits);

	const filteredUnits = $derived(
		activeCategory === 'Semua' ? units : units.filter((u) => u.category === activeCategory)
	);

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
			.format(amount)
			.replace('Rp', 'Rp ');

	const whyUnits = [
		{
			icon: '🎯',
			title: 'Bayar Sekali, Milik Selamanya',
			desc: 'Akses materi yang kamu beli tanpa batas waktu. Tonton kapan saja, sesering apapun.'
		},
		{
			icon: '💡',
			title: 'Pilih Sesuai Kebutuhan',
			desc: 'Tidak perlu beli semua. Cukup pilih materi yang sesuai topik yang ingin kamu kuasai.'
		},
		{
			icon: '📜',
			title: 'Sertifikat per Materi',
			desc: 'Selesaikan materi dan dapatkan sertifikat yang bisa kamu bagikan ke LinkedIn.'
		},
		{
			icon: '💰',
			title: 'Lebih Hemat dari Kursus Sejenis',
			desc: 'Harga per materi mulai dari Rp 49.000. Jauh lebih hemat dibanding kursus lain di pasaran.'
		}
	];

	const gradientColors = [
		'from-orange-500 to-amber-600',
		'from-emerald-500 to-teal-600',
		'from-teal-500 to-cyan-600',
		'from-violet-500 to-purple-600'
	];

	const categoryEmoji: Record<string, string> = {
		Blockchain: '⛓️',
		Syariah: '🕌',
		Trading: '📈',
		DeFi: '🌾',
		Development: '💻',
		'Data & AI': '🤖',
		Security: '🔐'
	};
</script>

<svelte:head>
	<title>Materi Satuan (Units) | CryptoSharia Academy</title>
	<meta
		name="description"
		content="Beli materi satuan sekali bayar. Akses selamanya tanpa berlangganan. Pilih topik sesuai kebutuhanmu."
	/>
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-black py-20 lg:py-28">
	<div class="absolute inset-0 z-0">
		<img
			src="/background-beranda.png"
			alt="Background"
			class="h-full w-full object-cover opacity-50"
		/>
		<div class="absolute inset-0 bg-gradient-to-br from-emerald-950/80 to-black/60"></div>
	</div>
	<div class="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 sm:text-left lg:px-8">
		<div class="max-w-3xl">
			<div
				class="mb-6 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 backdrop-blur-sm"
			>
				<span class="mr-2 flex h-2 w-2 rounded-full bg-emerald-500"></span> Beli Satuan — Akses Selamanya
			</div>
			<h1
				class="mb-6 font-sans text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
			>
				Beli Materi yang Kamu <span
					class="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
					>Butuhkan Saja</span
				>
			</h1>
			<p class="mx-auto mb-8 max-w-2xl text-lg text-gray-300 sm:mx-0 sm:text-xl">
				Tidak perlu berlangganan. Pilih materi, bayar sekali, akses selamanya. Ideal untuk yang
				ingin menguasai satu topik spesifik.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row sm:justify-start">
				<a
					href="#katalog"
					class="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
				>
					Lihat Semua Materi
				</a>
				<a
					href="/subscription"
					class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
				>
					Bandingkan dengan Langganan →
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Why Units -->
<section class="bg-white py-14 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-10 text-center">
			<h2 class="mb-3 text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
				Kenapa Pilih Materi Satuan?
			</h2>
			<p class="mx-auto max-w-xl text-sm text-gray-500 dark:text-gray-400">
				Cocok buat kamu yang sudah tahu topik apa yang mau dipelajari.
			</p>
		</div>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each whyUnits as item}
				<div
					class="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all hover:border-emerald-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-800"
				>
					<div class="mb-3 text-3xl">{item.icon}</div>
					<h3 class="mb-2 text-sm font-bold text-gray-900 dark:text-white">{item.title}</h3>
					<p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Comparison Banner -->
<div class="border-y border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
	<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
			<div>
				<h3 class="mb-1 font-bold text-white">Mau akses semua materi dengan harga lebih hemat?</h3>
				<p class="text-sm text-gray-400">
					Langganan bulanan mulai Rp 29.000/bln — akses 1400+ materi tanpa batas.
				</p>
			</div>
			<a
				href="/subscription"
				class="bg-primary-600 hover:bg-primary-700 orange-glow inline-flex flex-shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold whitespace-nowrap text-white transition-all"
			>
				Lihat Paket Langganan →
			</a>
		</div>
	</div>
</div>

<section class="bg-gray-50 py-14 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="mb-2 text-xl font-extrabold text-gray-900 sm:text-2xl dark:text-white">
			Materi Terpopuler
		</h2>
		<p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
			Pilihan terbaik dari para member CryptoSharia Academy.
		</p>
		{#if isLoadingUnits}
			<div class="py-12 text-center">
				<svg
					class="mx-auto mb-3 h-7 w-7 animate-spin text-emerald-600"
					fill="none"
					viewBox="0 0 24 24"
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
				<p class="text-sm text-gray-500 dark:text-gray-400">Memuat materi...</p>
			</div>
		{:else if loadError}
			<div
				class="rounded-2xl border border-red-200 bg-red-50 py-12 text-center dark:border-red-800 dark:bg-red-900/20"
			>
				<div class="mb-2 text-4xl">⚠️</div>
				<p class="mb-3 text-sm font-medium text-red-600 dark:text-red-400">{loadError}</p>
				<button
					onclick={loadUnits}
					class="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-red-700"
				>
					🔄 Coba Lagi
				</button>
			</div>
		{:else if units.length === 0}
			<div
				class="rounded-2xl border border-gray-200 bg-white py-12 text-center dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="mb-2 text-4xl">📭</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">Belum ada materi tersedia.</p>
			</div>
		{:else}
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{#each units.slice(0, 4) as unit, i}
					<a href="/units/{unit.id}" class="group block">
						<div
							class="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
						>
							{#if unit.image}
								<div
									class="h-36 bg-cover bg-center"
									style="background-image: url('{unit.image}');"
								></div>
							{:else}
								<div
									class="h-36 bg-gradient-to-br {gradientColors[
										i % gradientColors.length
									]} flex items-center justify-center"
								>
									<span class="text-5xl">{categoryEmoji[unit.category] || '📚'}</span>
								</div>
							{/if}
							<div class="flex flex-1 flex-col p-5">
								<span
									class="mb-3 inline-block self-start rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300"
									>{unit.category}</span
								>
								<h3
									class="mb-3 line-clamp-2 text-sm leading-snug font-bold text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400"
								>
									{unit.title}
								</h3>
								<div class="mb-4 flex items-center gap-3 text-xs text-gray-400">
									<span>📖 {unit.topics} Materi</span>
									{#if unit.duration}<span>⏱ {unit.duration}</span>{/if}
								</div>
								<div
									class="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700"
								>
									<div>
										<div class="text-base font-extrabold text-emerald-600">
											{formatCurrency(unit.price ?? 49000)}
										</div>
										<div class="text-xs text-gray-400 line-through">
											{formatCurrency(unit.originalPrice ?? 299000)}
										</div>
									</div>
									<span
										class="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition-all group-hover:bg-emerald-700"
										>Beli</span
									>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Full Catalog -->
<section id="katalog" class="bg-white py-16 sm:py-24 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-12 text-center">
			<div
				class="mb-4 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
			>
				💳 Bayar Satuan — Akses Selamanya
			</div>
			<h2 class="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
				Semua Katalog Materi Satuan
			</h2>
			<p class="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400">
				Beli hanya materi yang kamu butuhkan. Tanpa langganan, tanpa batas waktu.
			</p>
		</div>

		<!-- Category tabs -->
		<div class="mb-8 flex flex-wrap justify-center gap-2">
			{#each categories as cat}
				<button
					onclick={() => (activeCategory = cat)}
					class="rounded-full px-4 py-2 text-sm font-bold transition-all {activeCategory === cat
						? 'border border-emerald-600 bg-emerald-600 text-white shadow-sm'
						: 'border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-emerald-700 dark:hover:text-emerald-400'}"
				>
					{cat}
				</button>
			{/each}
		</div>

		<!-- Cards -->
		{#if isLoadingUnits}
			<div class="py-16 text-center">
				<svg
					class="mx-auto mb-4 h-8 w-8 animate-spin text-emerald-600"
					fill="none"
					viewBox="0 0 24 24"
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
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Memuat materi satuan...</p>
			</div>
		{:else if loadError}
			<div
				class="rounded-2xl border border-red-200 bg-red-50 py-16 text-center dark:border-red-800 dark:bg-red-900/20"
			>
				<div class="mb-2 text-4xl">⚠️</div>
				<p class="mb-3 text-sm font-medium text-red-600 dark:text-red-400">{loadError}</p>
				<button
					onclick={loadUnits}
					class="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-red-700"
				>
					🔄 Coba Lagi
				</button>
			</div>
		{:else if filteredUnits.length === 0}
			<div
				class="rounded-2xl border border-gray-200 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="mb-2 text-4xl">📭</div>
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
					Belum ada materi untuk kategori ini.
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each filteredUnits.slice(0, 12) as unit}
					<a href="/units/{unit.id}" class="group block">
						<div
							class="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
						>
							<div
								class="relative h-40 border-b border-gray-100 bg-gray-100 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 dark:border-gray-700 dark:bg-gray-900"
								style="background-image: url('{unit.image || '/background-beranda.png'}');"
							>
								<div
									class="absolute top-2 right-2 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm"
								>
									💳 Satuan
								</div>
							</div>
							<div class="flex flex-1 flex-col p-5">
								<div class="mb-3 flex items-center justify-between gap-2">
									<span
										class="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300"
										>{unit.category}</span
									>
								</div>
								<h3
									class="mb-3 line-clamp-2 text-base leading-snug font-bold text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400"
								>
									{unit.title}
								</h3>
								<div class="mt-auto border-t border-gray-100 pt-4 dark:border-gray-700">
									<div class="flex items-center justify-between">
										<div>
											<div class="text-base font-extrabold text-emerald-600">
												{formatCurrency(unit.price ?? 49000)}
											</div>
											<div class="text-xs text-gray-400 line-through">
												{formatCurrency(unit.originalPrice ?? 299000)}
											</div>
										</div>
										<div class="flex items-center gap-2 text-xs text-gray-400">
											<span>{unit.topics} Materi</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Bottom CTA -->
<section class="bg-gray-50 py-14 dark:bg-gray-900">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<div
			class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center sm:p-12"
		>
			<div class="absolute inset-0 opacity-5">
				<div class="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500 blur-3xl"></div>
			</div>
			<div class="relative">
				<div class="mb-4 text-4xl">🚀</div>
				<h2 class="mb-3 font-sans text-xl font-extrabold text-white sm:text-2xl">
					Ingin Akses Semua Materi?
				</h2>
				<p class="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-gray-400">
					Dengan langganan bulanan, kamu bisa akses 1400+ materi hanya dengan Rp 29.000/bulan. Jauh
					lebih hemat dari beli satuan.
				</p>
				<a
					href="/subscription"
					class="bg-primary-600 orange-glow hover:bg-primary-700 inline-flex items-center rounded-full px-8 py-3 text-sm font-bold text-white transition-all active:scale-95"
					>Lihat Paket Langganan</a
				>
			</div>
		</div>
	</div>
</section>
