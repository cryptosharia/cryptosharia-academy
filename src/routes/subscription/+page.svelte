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

	interface Course {
		id?: string;
		title: string;
		topics: number;
		duration: string;
		category: string;
		image: string;
	}

	let courses = $state<Course[]>([]);
	let isLoadingCourses = $state(true);

	onMount(async () => {
		try {
			const q = query(collection(db, 'elearning_courses'), orderBy('createdAt', 'desc'));
			const snap = await getDocs(q);
			courses = snap.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			})) as Course[];
		} catch (error) {
			console.error('Failed to load courses:', error);
		} finally {
			isLoadingCourses = false;
		}
	});

	const learningPaths: {
		title: string;
		courses: number;
		hours: number;
		emoji: string;
		gradient: string;
	}[] = [
		{
			title: 'Blockchain & Crypto',
			courses: 8,
			hours: 32,
			emoji: '⛓️',
			gradient: 'from-orange-500 to-orange-700'
		},
		{
			title: 'Fiqh Muamalah & Syariah',
			courses: 6,
			hours: 20,
			emoji: '🕌',
			gradient: 'from-emerald-500 to-emerald-700'
		},
		{
			title: 'Trading & Investasi',
			courses: 5,
			hours: 18,
			emoji: '📈',
			gradient: 'from-blue-500 to-blue-700'
		},
		{
			title: 'DeFi & Yield Halal',
			courses: 4,
			hours: 14,
			emoji: '🌾',
			gradient: 'from-teal-500 to-teal-700'
		},
		{
			title: 'Smart Contract & Web3',
			courses: 7,
			hours: 28,
			emoji: '💻',
			gradient: 'from-violet-500 to-violet-700'
		},
		{
			title: 'Data & AI for Crypto',
			courses: 5,
			hours: 20,
			emoji: '📊',
			gradient: 'from-cyan-500 to-cyan-700'
		},
		{
			title: 'Keamanan & Wallet',
			courses: 3,
			hours: 10,
			emoji: '🔐',
			gradient: 'from-red-500 to-red-700'
		},
		{
			title: 'NFT & Digital Assets',
			courses: 4,
			hours: 12,
			emoji: '🎨',
			gradient: 'from-pink-500 to-pink-700'
		}
	];

	const pricingPlans = [
		{
			id: '12-bulan',
			name: '12 Bulan',
			label: 'TERPOPULER',
			price: 'Rp 179.000',
			perMonth: 'Rp 14.900/bln',
			features: [
				'1400+ Materi Video',
				'500+ Modul Praktik Portfolio',
				'Sertifikat di Tiap Materi',
				'Grup Komunitas',
				'FREE Q&A Webinar Series',
				'Diskon untuk Bootcamp'
			],
			popular: true
		},
		{
			id: '6-bulan',
			name: '6 Bulan',
			label: '',
			price: 'Rp 99.000',
			perMonth: 'Rp 16.500/bln',
			features: [
				'1400+ Materi Video',
				'500+ Modul Praktik Portfolio',
				'Sertifikat di Tiap Materi',
				'Grup Komunitas',
				'FREE Q&A Webinar Series',
				'Diskon untuk Bootcamp'
			],
			popular: false
		},
		{
			id: '1-bulan',
			name: '1 Bulan',
			label: '',
			price: 'Rp 29.000',
			perMonth: '',
			features: [
				'1400+ Materi Video',
				'500+ Modul Praktik Portfolio',
				'Sertifikat di Tiap Materi',
				'Grup Komunitas'
			],
			popular: false
		}
	];

	const filteredCourses = $derived(
		activeCategory === 'Semua' ? courses : courses.filter((c) => c.category === activeCategory)
	);
</script>

<svelte:head>
	<title>Subscription | CryptoSharia Academy</title>
	<meta
		name="description"
		content="Akses semua materi e-learning tanpa batas dengan berlangganan bulanan. Lebih dari 1400 video, sertifikat, dan komunitas."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-black py-20 lg:py-28">
	<div class="absolute inset-0 z-0">
		<img
			src="/background-beranda.png"
			alt="Beranda Background"
			class="h-full w-full object-cover opacity-60"
		/>
	</div>
	<div class="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 sm:text-left lg:px-8">
		<div class="max-w-3xl">
			<div
				class="border-primary-500/30 bg-primary-500/10 text-primary-400 mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium backdrop-blur-sm"
			>
				<span class="bg-primary-500 mr-2 flex h-2 w-2 rounded-full"></span> Langganan Bulanan — Akses
				Tak Terbatas
			</div>
			<h1
				class="mb-6 font-sans text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
			>
				Satu Harga, <span
					class="from-primary-400 bg-gradient-to-r to-orange-400 bg-clip-text text-transparent"
					>Semua Materi</span
				>
			</h1>
			<p class="mx-auto mb-8 max-w-2xl text-lg text-gray-300 sm:mx-0 sm:text-xl">
				Berlangganan dan akses 1400+ jam video pembelajaran, modul praktik, dan sertifikat — selama
				masa berlanggananmu aktif.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row sm:justify-start">
				<a
					href="#pricing"
					class="bg-primary-600 shadow-primary-500/30 hover:bg-primary-700 orange-glow inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
				>
					Pilih Paket Langganan
				</a>
				<a
					href="#katalog"
					class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
				>
					Lihat Katalog Materi
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Stats Banner -->
<div class="bg-primary-900 border-primary-800 border-y">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="divide-primary-800/50 grid grid-cols-2 gap-8 divide-x md:grid-cols-4">
			<div class="text-center">
				<div class="text-3xl font-extrabold text-white">1400+</div>
				<div class="text-primary-300 mt-1 text-sm font-medium">Video Materi</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-extrabold text-white">500+</div>
				<div class="text-primary-300 mt-1 text-sm font-medium">Modul Praktik</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-extrabold text-white">125K+</div>
				<div class="text-primary-300 mt-1 text-sm font-medium">Member Aktif</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-extrabold text-white">4.9/5</div>
				<div class="text-primary-300 mt-1 text-sm font-medium">Rating Siswa</div>
			</div>
		</div>
	</div>
</div>

<!-- Katalog Materi Section -->
<section id="katalog" class="bg-gray-50 py-16 sm:py-24 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-12 text-center">
			<div
				class="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 mb-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
			>
				🔒 Akses dengan Langganan Bulanan
			</div>
			<h2 class="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
				Ratusan Skill Impian Kini Dalam Genggamanmu
			</h2>
			<p class="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400">
				Satu harga untuk akses semua materi. Belajar secara mandiri dan fleksibel kapanpun Anda mau.
			</p>
		</div>

		<!-- Category tabs -->
		<div class="mb-8 flex flex-wrap justify-center gap-2">
			{#each categories as cat}
				<button
					onclick={() => (activeCategory = cat)}
					class="rounded-full px-4 py-2 text-sm font-bold transition-all {activeCategory === cat
						? 'bg-primary-600 border-primary-600 border text-white shadow-sm'
						: 'hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'}"
				>
					{cat}
				</button>
			{/each}
		</div>

		<!-- Course cards grid -->
		{#if isLoadingCourses}
			<div class="py-16 text-center">
				<svg
					class="text-primary-600 mx-auto mb-4 h-8 w-8 animate-spin"
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
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Memuat materi...</p>
			</div>
		{:else if filteredCourses.length === 0}
			<div
				class="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="mb-2 text-4xl">📭</div>
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
					Belum ada materi untuk kategori ini.
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each filteredCourses.slice(0, 12) as course}
					<a href="/subscription/{course.id}" class="group block">
						<div
							class="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
						>
							<div
								class="relative h-40 border-b border-gray-100 bg-gray-100 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 dark:border-gray-700 dark:bg-gray-900"
								style="background-image: url('{course.image || '/background-beranda.png'}');"
							>
								<div
									class="bg-primary-600/90 absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm"
								>
									🔒 Langganan
								</div>
							</div>
							<div class="relative z-10 flex flex-1 flex-col bg-white p-5 dark:bg-gray-800">
								<div class="mb-3 flex items-center justify-between gap-2">
									<span
										class="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300"
										>{course.category}</span
									>
								</div>
								<h3
									class="group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-4 line-clamp-2 text-base leading-snug font-bold text-gray-900 transition-colors dark:text-white"
								>
									{course.title}
								</h3>
								<div
									class="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400"
								>
									<span class="flex items-center gap-1.5"
										><svg
											class="h-4 w-4 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/></svg
										>
										{course.topics} Materi</span
									>
									<span class="flex items-center gap-1.5"
										><svg
											class="h-4 w-4 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/></svg
										>
										{course.duration}</span
									>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}

		<div class="mt-12 text-center">
			<a
				href="#pricing"
				class="bg-primary-600 orange-glow hover:bg-primary-700 inline-flex items-center rounded-full px-8 py-3 text-base font-bold text-white transition-all active:scale-95"
				>Lihat Paket Harga Langganan</a
			>
		</div>
	</div>
</section>

<!-- Learning Paths -->
<section class="bg-white py-14 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="mb-2 font-sans text-xl font-extrabold text-gray-900 sm:text-2xl dark:text-white">
			Daftar Learning Path Rancangan Experts
		</h2>
		<p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
			Cari learning path yang sesuai kebutuhanmu.
		</p>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{#each learningPaths as path}
				<a href="#pricing" class="group block">
					<div
						class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
					>
						<div class="h-32 bg-gradient-to-br {path.gradient} flex items-center justify-center">
							<span class="text-5xl">{path.emoji}</span>
						</div>
						<div class="p-4">
							<h3
								class="group-hover:text-primary-600 mb-2 text-sm font-semibold text-gray-900 transition-colors dark:text-white"
							>
								{path.title}
							</h3>
							<div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
								<span>📖 {path.courses} Kursus</span>
								<span>⏱ {path.hours} Jam</span>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Pricing -->
<section id="pricing" class="bg-gray-50 py-20 dark:bg-gray-900">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<div class="mb-12 text-center">
			<div
				class="mb-4 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
			>
				✅ Akses Bulanan — Bayar Sekali, Nikmati Semua
			</div>
			<h2 class="mb-3 font-sans text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
				Berlangganan Sekarang dan Jadi Lebih Hebat
			</h2>
			<p class="mx-auto max-w-xl text-sm text-gray-500 dark:text-gray-400">
				Pilih paket yang sesuai. Bayar sekali, akses seluruh konten selama masa berlangganan aktif.
			</p>
		</div>
		<div class="grid gap-6 sm:grid-cols-3">
			{#each pricingPlans as plan}
				<div
					class="rounded-2xl {plan.popular
						? 'from-primary-600 to-primary-700 ring-primary-500 scale-[1.03] bg-gradient-to-b text-white ring-2 ring-offset-2'
						: 'border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'} relative p-7 shadow-sm"
				>
					{#if plan.label}
						<div
							class="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-gray-900 shadow"
						>
							{plan.label}
						</div>
					{/if}
					<div class="mb-6 text-center">
						<h3 class="mb-1 text-lg font-bold">{plan.name}</h3>
						<div class="text-3xl font-extrabold">{plan.price}</div>
						{#if plan.perMonth}
							<div class="mt-1 text-xs {plan.popular ? 'text-primary-200' : 'text-gray-400'}">
								{plan.perMonth}
							</div>
						{/if}
					</div>
					<ul class="mb-7 space-y-3">
						{#each plan.features as feature}
							<li
								class="flex items-center gap-2.5 text-sm {plan.popular
									? 'text-white/90'
									: 'text-gray-600 dark:text-gray-300'}"
							>
								<svg
									class="h-4 w-4 flex-shrink-0 {plan.popular
										? 'text-yellow-300'
										: 'text-primary-500'}"
									fill="currentColor"
									viewBox="0 0 20 20"
									><path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/></svg
								>
								{feature}
							</li>
						{/each}
					</ul>
					<a
						href="/payment/subscription/{plan.id}"
						class="block rounded-full text-center {plan.popular
							? 'text-primary-600 bg-white font-bold hover:bg-orange-50'
							: 'bg-primary-600 hover:bg-primary-700 font-semibold text-white'} px-6 py-3 text-sm transition-all active:scale-95"
					>
						Mulai Berlangganan
					</a>
				</div>
			{/each}
		</div>

		<!-- Compare with Units -->
		<div
			class="mt-10 rounded-2xl border border-gray-200 bg-white p-5 text-center dark:border-gray-700 dark:bg-gray-800"
		>
			<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
				Lebih suka beli materi satuan tanpa langganan?
			</p>
			<a
				href="/units"
				class="text-primary-600 dark:text-primary-400 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
			>
				Lihat Materi Satuan →
			</a>
		</div>
	</div>
</section>

<!-- Corporate CTA -->
<section class="bg-white py-14 dark:bg-gray-950">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<div
			class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center sm:p-12"
		>
			<div class="absolute inset-0 opacity-5">
				<div class="bg-primary-500 absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl"></div>
			</div>
			<div class="relative">
				<div class="mb-4 text-4xl">🏢</div>
				<h2 class="mb-3 font-sans text-xl font-extrabold text-white sm:text-2xl">
					Subscription & Training Untuk Perusahaan
				</h2>
				<p class="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-gray-400">
					Miliki akses ratusan konten serta dukungan corporate training untuk perusahaan di bidang
					crypto Syariah.
				</p>
				<a
					href="#"
					class="bg-primary-600 orange-glow hover:bg-primary-700 inline-flex items-center rounded-full px-8 py-3 text-sm font-bold text-white transition-all active:scale-95"
					>Hubungi Kami</a
				>
			</div>
		</div>
	</div>
</section>
