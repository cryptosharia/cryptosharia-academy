<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, query, getDocs, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let activeCategory = $state('Semua');
	const categories = ['Semua', 'Blockchain', 'Syariah', 'Trading', 'DeFi', 'Development', 'Data & AI', 'Security'];

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
			units = snap.docs.map(doc => ({
				id: doc.id,
				price: 49000,
				originalPrice: 299000,
				...doc.data()
			})) as Unit[];
		} catch (error: any) {
			console.error("Failed to load units:", error);
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
		activeCategory === 'Semua' ? units : units.filter(u => u.category === activeCategory)
	);

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
			.format(amount).replace('Rp', 'Rp ');

	const whyUnits = [
		{ icon: '🎯', title: 'Bayar Sekali, Milik Selamanya', desc: 'Akses materi yang kamu beli tanpa batas waktu. Tonton kapan saja, sesering apapun.' },
		{ icon: '💡', title: 'Pilih Sesuai Kebutuhan', desc: 'Tidak perlu beli semua. Cukup pilih materi yang sesuai topik yang ingin kamu kuasai.' },
		{ icon: '📜', title: 'Sertifikat per Materi', desc: 'Selesaikan materi dan dapatkan sertifikat yang bisa kamu bagikan ke LinkedIn.' },
		{ icon: '💰', title: 'Lebih Hemat dari Kursus Sejenis', desc: 'Harga per materi mulai dari Rp 49.000. Jauh lebih hemat dibanding kursus lain di pasaran.' },
	];


	const gradientColors = [
		'from-orange-500 to-amber-600',
		'from-emerald-500 to-teal-600',
		'from-teal-500 to-cyan-600',
		'from-violet-500 to-purple-600',
	];

	const categoryEmoji: Record<string, string> = {
		'Blockchain': '⛓️', 'Syariah': '🕌', 'Trading': '📈', 'DeFi': '🌾',
		'Development': '💻', 'Data & AI': '🤖', 'Security': '🔐',
	};
</script>

<svelte:head>
	<title>Materi Satuan (Units) | CryptoSharia Academy</title>
	<meta name="description" content="Beli materi satuan sekali bayar. Akses selamanya tanpa berlangganan. Pilih topik sesuai kebutuhanmu." />
</svelte:head>

<!-- Hero -->
<section class="relative bg-black py-20 lg:py-28 overflow-hidden">
	<div class="absolute inset-0 z-0">
		<img src="/background-beranda.png" alt="Background" class="w-full h-full object-cover opacity-50" />
		<div class="absolute inset-0 bg-gradient-to-br from-emerald-950/80 to-black/60"></div>
	</div>
	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
		<div class="max-w-3xl">
			<div class="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 backdrop-blur-sm mb-6">
				<span class="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span> Beli Satuan — Akses Selamanya
			</div>
			<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight font-sans">
				Beli Materi yang Kamu <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Butuhkan Saja</span>
			</h1>
			<p class="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto sm:mx-0">
				Tidak perlu berlangganan. Pilih materi, bayar sekali, akses selamanya. Ideal untuk yang ingin menguasai satu topik spesifik.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
				<a href="#katalog" class="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all">
					Lihat Semua Materi
				</a>
				<a href="/subscription" class="inline-flex items-center justify-center rounded-full bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all border border-white/10">
					Bandingkan dengan Langganan →
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Why Units -->
<section class="py-14 bg-white dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-10">
			<h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Kenapa Pilih Materi Satuan?</h2>
			<p class="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm">Cocok buat kamu yang sudah tahu topik apa yang mau dipelajari.</p>
		</div>
		<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each whyUnits as item}
				<div class="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all">
					<div class="text-3xl mb-3">{item.icon}</div>
					<h3 class="font-bold text-gray-900 dark:text-white mb-2 text-sm">{item.title}</h3>
					<p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Comparison Banner -->
<div class="bg-gradient-to-r from-gray-900 to-gray-800 border-y border-gray-700">
	<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
			<div>
				<h3 class="font-bold text-white mb-1">Mau akses semua materi dengan harga lebih hemat?</h3>
				<p class="text-sm text-gray-400">Langganan bulanan mulai Rp 29.000/bln — akses 1400+ materi tanpa batas.</p>
			</div>
			<a href="/subscription" class="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 orange-glow transition-all whitespace-nowrap">
				Lihat Paket Langganan →
			</a>
		</div>
	</div>
</div>

<section class="py-14 bg-gray-50 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Materi Terpopuler</h2>
		<p class="text-gray-500 dark:text-gray-400 text-sm mb-8">Pilihan terbaik dari para member CryptoSharia Academy.</p>
		{#if isLoadingUnits}
			<div class="text-center py-12">
				<svg class="animate-spin w-7 h-7 mx-auto text-emerald-600 mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
				<p class="text-sm text-gray-500 dark:text-gray-400">Memuat materi...</p>
			</div>
		{:else if loadError}
			<div class="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
				<div class="text-4xl mb-2">⚠️</div>
				<p class="text-sm font-medium text-red-600 dark:text-red-400 mb-3">{loadError}</p>
				<button onclick={loadUnits} class="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700 transition-all">
					🔄 Coba Lagi
				</button>
			</div>
		{:else if units.length === 0}
			<div class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
				<div class="text-4xl mb-2">📭</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">Belum ada materi tersedia.</p>
			</div>
		{:else}
			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{#each units.slice(0, 4) as unit, i}
					<a href="/units/{unit.id}" class="group block">
						<div class="h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
							{#if unit.image}
								<div class="h-36 bg-cover bg-center" style="background-image: url('{unit.image}');"></div>
							{:else}
								<div class="h-36 bg-gradient-to-br {gradientColors[i % gradientColors.length]} flex items-center justify-center">
									<span class="text-5xl">{categoryEmoji[unit.category] || '📚'}</span>
								</div>
							{/if}
							<div class="p-5 flex-1 flex flex-col">
								<span class="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-600 dark:text-gray-300 mb-3 inline-block self-start">{unit.category}</span>
								<h3 class="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">{unit.title}</h3>
								<div class="flex items-center gap-3 text-xs text-gray-400 mb-4">
									<span>📖 {unit.topics} Materi</span>
									{#if unit.duration}<span>⏱ {unit.duration}</span>{/if}
								</div>
								<div class="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
									<div>
										<div class="text-base font-extrabold text-emerald-600">{formatCurrency(unit.price ?? 49000)}</div>
										<div class="text-xs text-gray-400 line-through">{formatCurrency(unit.originalPrice ?? 299000)}</div>
									</div>
									<span class="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold group-hover:bg-emerald-700 transition-all">Beli</span>
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
<section id="katalog" class="py-16 sm:py-24 bg-white dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<div class="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-4">
				💳 Bayar Satuan — Akses Selamanya
			</div>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Semua Katalog Materi Satuan</h2>
			<p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Beli hanya materi yang kamu butuhkan. Tanpa langganan, tanpa batas waktu.</p>
		</div>

		<!-- Category tabs -->
		<div class="flex flex-wrap gap-2 justify-center mb-8">
			{#each categories as cat}
				<button onclick={() => (activeCategory = cat)} class="px-4 py-2 text-sm font-bold rounded-full transition-all {activeCategory === cat ? 'bg-emerald-600 text-white shadow-sm border border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400'}">
					{cat}
				</button>
			{/each}
		</div>

		<!-- Cards -->
		{#if isLoadingUnits}
			<div class="text-center py-16">
				<svg class="animate-spin w-8 h-8 mx-auto text-emerald-600 mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Memuat materi satuan...</p>
			</div>
		{:else if loadError}
			<div class="text-center py-16 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
				<div class="text-4xl mb-2">⚠️</div>
				<p class="text-sm font-medium text-red-600 dark:text-red-400 mb-3">{loadError}</p>
				<button onclick={loadUnits} class="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700 transition-all">
					🔄 Coba Lagi
				</button>
			</div>
		{:else if filteredUnits.length === 0}
			<div class="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
				<div class="text-4xl mb-2">📭</div>
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Belum ada materi untuk kategori ini.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each filteredUnits.slice(0, 12) as unit}
					<a href="/units/{unit.id}" class="group block">
						<div class="h-full rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
							<div class="h-40 bg-cover bg-center border-b border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 transition-transform duration-500 group-hover:scale-105 relative" style="background-image: url('{unit.image || '/background-beranda.png'}');">
								<div class="absolute top-2 right-2 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">💳 Satuan</div>
							</div>
							<div class="p-5 flex-1 flex flex-col">
								<div class="flex items-center justify-between gap-2 mb-3">
									<span class="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-600 dark:text-gray-300">{unit.category}</span>
								</div>
								<h3 class="font-bold text-gray-900 dark:text-white text-base leading-snug mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">{unit.title}</h3>
								<div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
									<div class="flex items-center justify-between">
										<div>
											<div class="text-base font-extrabold text-emerald-600">{formatCurrency(unit.price ?? 49000)}</div>
											<div class="text-xs text-gray-400 line-through">{formatCurrency(unit.originalPrice ?? 299000)}</div>
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
<section class="py-14 bg-gray-50 dark:bg-gray-900">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12 text-center relative overflow-hidden">
			<div class="absolute inset-0 opacity-5"><div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div></div>
			<div class="relative">
				<div class="text-4xl mb-4">🚀</div>
				<h2 class="font-sans text-xl sm:text-2xl font-extrabold text-white mb-3">Ingin Akses Semua Materi?</h2>
				<p class="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto mb-6">Dengan langganan bulanan, kamu bisa akses 1400+ materi hanya dengan Rp 29.000/bulan. Jauh lebih hemat dari beli satuan.</p>
				<a href="/subscription" class="inline-flex items-center rounded-full bg-primary-600 px-8 py-3 text-sm font-bold text-white orange-glow hover:bg-primary-700 active:scale-95 transition-all">Lihat Paket Langganan</a>
			</div>
		</div>
	</div>
</section>
