<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, query, getDocs, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let activeCategory = $state('Semua');

	const categories = ['Semua', 'Blockchain', 'Syariah', 'Trading', 'DeFi', 'Development', 'Data & AI', 'Security'];

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
			courses = snap.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			})) as Course[];
		} catch (error) {
			console.error("Failed to load courses:", error);
		} finally {
			isLoadingCourses = false;
		}
	});

	const learningPaths: { title: string; courses: number; hours: number; emoji: string; gradient: string }[] = [
		{ title: 'Blockchain & Crypto', courses: 8, hours: 32, emoji: '⛓️', gradient: 'from-orange-500 to-orange-700' },
		{ title: 'Fiqh Muamalah & Syariah', courses: 6, hours: 20, emoji: '🕌', gradient: 'from-emerald-500 to-emerald-700' },
		{ title: 'Trading & Investasi', courses: 5, hours: 18, emoji: '📈', gradient: 'from-blue-500 to-blue-700' },
		{ title: 'DeFi & Yield Halal', courses: 4, hours: 14, emoji: '🌾', gradient: 'from-teal-500 to-teal-700' },
		{ title: 'Smart Contract & Web3', courses: 7, hours: 28, emoji: '💻', gradient: 'from-violet-500 to-violet-700' },
		{ title: 'Data & AI for Crypto', courses: 5, hours: 20, emoji: '📊', gradient: 'from-cyan-500 to-cyan-700' },
		{ title: 'Keamanan & Wallet', courses: 3, hours: 10, emoji: '🔐', gradient: 'from-red-500 to-red-700' },
		{ title: 'NFT & Digital Assets', courses: 4, hours: 12, emoji: '🎨', gradient: 'from-pink-500 to-pink-700' },
	];

	const pricingPlans = [
		{ id: '12-bulan', name: '12 bulan', label: 'TERPOPULER', price: 'Rp 179.000', perMonth: '', features: ['1400+ Materi Video', '500+ Modul Praktik Portfolio', 'Sertifikat di Tiap Materi', 'Grup Komunitas', 'FREE Q&A Webinar Series', 'Diskon untuk Bootcamp'], popular: true, gradient: 'from-primary-600 to-primary-700' },
		{ id: '6-bulan', name: '6 bulan', label: '', price: 'Rp 99.000', perMonth: '', features: ['1400+ Materi Video', '500+ Modul Praktik Portfolio', 'Sertifikat di Tiap Materi', 'Grup Komunitas', 'FREE Q&A Webinar Series', 'Diskon untuk Bootcamp'], popular: false, gradient: '' },
		{ id: '1-bulan', name: '1 bulan', label: '', price: 'Rp 29.000', perMonth: '', features: ['1400+ Materi Video', '500+ Modul Praktik Portfolio', 'Sertifikat di Tiap Materi', 'Grup Komunitas'], popular: false, gradient: '' },
	];

	const filteredCourses = $derived(
		activeCategory === 'Semua' ? courses : courses.filter(c => c.category === activeCategory)
	);

	const features = [
		{ icon: '📚', title: 'Belajar Fleksibel dan Bersertifikat', desc: 'Akses semua materi sekali bayar. Lebih dari ratusan materi video, studi kasus, bahan bacaan, dan komunitas.' },
		{ icon: '🎯', title: 'Kombinasi Strategi, Praktik & Portfolio', desc: 'Bukan hanya teori. Setiap materi dilengkapi modul praktik untuk membangun portfolio nyata.' },
		{ icon: '👥', title: 'Gabung Komunitas Diskusi secara Lifetime', desc: 'Diskusikan materi, tanya jawab, dan networking bersama ribuan member lainnya.' },
		{ icon: '📈', title: 'Ratusan Ribu Member. Terbukti Berdampak', desc: 'Ribuan alumni sudah berkarir di industri crypto dan keuangan Syariah berkat platform ini.' },
	];
</script>

<svelte:head>
	<title>Materi E-Learning | CryptoSharia Academy</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-black py-20 lg:py-28 overflow-hidden">
	<div class="absolute inset-0 z-0">
		<img src="/background-beranda.png" alt="Beranda Background" class="w-full h-full object-cover opacity-60" />
	</div>
	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
		<div class="max-w-3xl">
			<div class="inline-flex items-center rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-sm font-medium text-primary-400 backdrop-blur-sm mb-6">
				<span class="flex h-2 w-2 rounded-full bg-primary-500 mr-2"></span> Akses Ratusan Materi
			</div>
			<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight font-sans">
				Mulai Perjalanan Karirmu di <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-400">Web3 & Crypto</span>
			</h1>
			<p class="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto sm:mx-0">
				Akses ratusan jam video pembelajaran komprehensif, dari dasar blockchain hingga smart contract development tingkat lanjut dengan pendekatan Syariah.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
				<a href="#pricing" class="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-0.5 transition-all orange-glow">
					Mulai Belajar
				</a>
				<a href="#katalog" class="inline-flex items-center justify-center rounded-full bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all border border-white/10">
					Lihat Katalog
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Stats Banner -->
<div class="bg-primary-900 border-y border-primary-800">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4 divide-x divide-primary-800/50">
			<div class="text-center">
				<div class="text-3xl font-extrabold text-white">1400+</div>
				<div class="mt-1 text-sm font-medium text-primary-300">Video Materi</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-extrabold text-white">500+</div>
				<div class="mt-1 text-sm font-medium text-primary-300">Studi Kasus</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-extrabold text-white">125K+</div>
				<div class="mt-1 text-sm font-medium text-primary-300">Member Aktif</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-extrabold text-white">4.9/5</div>
				<div class="mt-1 text-sm font-medium text-primary-300">Rating Siswa</div>
			</div>
		</div>
	</div>
</div>

<!-- Katalog Materi Section -->
<section id="katalog" class="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<div class="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-semibold text-blue-800 dark:text-blue-300 mb-4">
				E-Learning Katalog
			</div>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Ratusan Skill Impian Kini Dalam Genggamanmu</h2>
			<p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Satu harga untuk akses semua materi. Belajar secara mandiri dan fleksibel kapanpun Anda mau.</p>
		</div>

		<!-- Category tabs -->
		<div class="flex flex-wrap gap-2 justify-center mb-8">
			{#each categories as cat}
				<button onclick={() => (activeCategory = cat)} class="px-4 py-2 text-sm font-bold rounded-full transition-all {activeCategory === cat ? 'bg-primary-600 text-white shadow-sm border border-primary-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400'}">
					{cat}
				</button>
			{/each}
		</div>

		<!-- Course cards grid -->
		{#if isLoadingCourses}
			<div class="text-center py-16">
				<svg class="animate-spin w-8 h-8 mx-auto text-primary-600 mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Memuat materi e-learning...</p>
			</div>
		{:else if filteredCourses.length === 0}
			<div class="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
				<div class="text-4xl mb-2">📭</div>
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Belum ada materi untuk kategori ini.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each filteredCourses.slice(0, 12) as course}
					<a href="/e-learning/{course.id}" class="group block">
						<div class="h-full rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
							<div class="h-40 bg-cover bg-center border-b border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 transition-transform duration-500 group-hover:scale-105" style="background-image: url('{course.image || '/background-beranda.png'}');">
							</div>
							<div class="p-5 flex-1 flex flex-col bg-white dark:bg-gray-800 relative z-10">
								<div class="flex items-center justify-between gap-2 mb-3">
									<span class="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-600 dark:text-gray-300">{course.category}</span>
								</div>
								<h3 class="font-bold text-gray-900 dark:text-white text-base leading-snug mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">{course.title}</h3>
								
								<div class="mt-auto flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
									<span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> {course.topics} Materi</span>
									<span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> {course.duration}</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}

		<div class="text-center mt-12">
			<a href="#pricing" class="inline-flex items-center rounded-full bg-primary-600 px-8 py-3 text-base font-bold text-white orange-glow hover:bg-primary-700 active:scale-95 transition-all">Lihat Paket Harga Langganan</a>
		</div>
	</div>
</section>

<!-- Learning Paths -->
<section class="py-14 bg-white dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="font-sans text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Daftar Learning Path Rancangan Experts</h2>
		<p class="text-gray-500 dark:text-gray-400 text-sm mb-8">Cari learning path yang sesuai kebutuhanmu.</p>
		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each learningPaths as path}
				<a href="/payment/e-learning/path-{path.title.toLowerCase().replace(/\s+/g, '-')}" class="group block">
					<div class="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
						<div class="h-32 bg-gradient-to-br {path.gradient} flex items-center justify-center">
							<span class="text-5xl">{path.emoji}</span>
						</div>
						<div class="p-4">
							<h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-2 group-hover:text-primary-600 transition-colors">{path.title}</h3>
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
<section id="pricing" class="py-16 bg-gray-50 dark:bg-gray-900">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-sans text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Langganan Sekarang dan Jadi Lebih Hebat</h2>
		<p class="text-center text-gray-500 dark:text-gray-400 text-sm mb-10">Langganan bulanan untuk akses semua materi, tanpa batas.</p>
		<div class="grid sm:grid-cols-3 gap-5">
			{#each pricingPlans as plan}
				<div class="rounded-2xl {plan.popular ? 'bg-gradient-to-b from-primary-600 to-primary-700 text-white ring-2 ring-primary-500 ring-offset-2 scale-105' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'} p-6 shadow-sm relative">
					{#if plan.label}
						<div class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900 dark:text-white">{plan.label}</div>
					{/if}
					<div class="text-center mb-5">
						<h3 class="font-bold text-lg mb-1">{plan.name}</h3>
						<div class="text-3xl font-extrabold">{plan.price}</div>
					</div>
					<ul class="space-y-2.5 mb-6">
						{#each plan.features as feature}
							<li class="flex items-center gap-2 text-sm {plan.popular ? 'text-white/90' : 'text-gray-600'}">
								<svg class="w-4 h-4 flex-shrink-0 {plan.popular ? 'text-yellow-300' : 'text-primary-500'}" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
								{feature}
							</li>
						{/each}
					</ul>
					<a href="/payment/e-learning/{plan.id}" class="block text-center rounded-full {plan.popular ? 'bg-white text-primary-600 font-bold hover:bg-orange-50' : 'bg-primary-600 text-white font-semibold hover:bg-primary-700'} px-6 py-2.5 text-sm transition-all active:scale-95">
						Mulai Berlangganan
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Corporate CTA -->
<section class="py-14 bg-white dark:bg-gray-950">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12 text-center relative overflow-hidden">
			<div class="absolute inset-0 opacity-5"><div class="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div></div>
			<div class="relative">
				<div class="text-4xl mb-4">🏢</div>
				<h2 class="font-sans text-xl sm:text-2xl font-extrabold text-white mb-3">E-learning & Training Untuk Perusahaan</h2>
				<p class="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto mb-6">Miliki akses ratusan konten e-learning serta dukungan corporate training untuk perusahaan di bidang crypto Syariah.</p>
				<a href="#" class="inline-flex items-center rounded-full bg-primary-600 px-8 py-3 text-sm font-bold text-white orange-glow hover:bg-primary-700 active:scale-95 transition-all">Hubungi Kami</a>
			</div>
		</div>
	</div>
</section>
