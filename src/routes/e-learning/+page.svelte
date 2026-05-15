<script lang="ts">
	let activeCategory = $state('Semua');

	const categories = ['Semua', 'Blockchain', 'Syariah', 'Trading', 'DeFi', 'Development', 'Data & AI', 'Security'];

	interface Course {
		title: string;
		topics: number;
		duration: string;
		price: string;
		category: string;
		emoji: string;
		gradient: string;
	}

	const courses: Course[] = [
		{ title: 'Blockchain & Crypto Fundamentals', topics: 24, duration: '8 Jam', price: 'Rp 99.000', category: 'Blockchain', emoji: '⛓️', gradient: 'from-orange-400 to-orange-600' },
		{ title: 'Fiqh Muamalah Digital', topics: 18, duration: '6 Jam', price: 'Rp 79.000', category: 'Syariah', emoji: '🕌', gradient: 'from-emerald-400 to-emerald-600' },
		{ title: 'Crypto Trading Fundamental', topics: 22, duration: '7 Jam', price: 'Rp 99.000', category: 'Trading', emoji: '📈', gradient: 'from-blue-400 to-blue-600' },
		{ title: 'DeFi & Yield Farming Halal', topics: 16, duration: '5 Jam', price: 'Rp 79.000', category: 'DeFi', emoji: '🌾', gradient: 'from-teal-400 to-teal-600' },
		{ title: 'Smart Contract & Solidity', topics: 30, duration: '12 Jam', price: 'Rp 149.000', category: 'Development', emoji: '📝', gradient: 'from-violet-400 to-violet-600' },
		{ title: 'Token Screening Syariah', topics: 14, duration: '4 Jam', price: 'Rp 59.000', category: 'Syariah', emoji: '🔍', gradient: 'from-amber-400 to-amber-600' },
		{ title: 'Data Analysis for Crypto', topics: 20, duration: '8 Jam', price: 'Rp 99.000', category: 'Data & AI', emoji: '📊', gradient: 'from-cyan-400 to-cyan-600' },
		{ title: 'NFT Creation & Marketing', topics: 12, duration: '4 Jam', price: 'Rp 59.000', category: 'Blockchain', emoji: '🎨', gradient: 'from-pink-400 to-pink-600' },
		{ title: 'Web3 Frontend Development', topics: 28, duration: '10 Jam', price: 'Rp 129.000', category: 'Development', emoji: '💻', gradient: 'from-indigo-400 to-indigo-600' },
		{ title: 'Crypto Wallet & Security', topics: 10, duration: '3 Jam', price: 'Rp 49.000', category: 'Security', emoji: '🔐', gradient: 'from-red-400 to-red-600' },
		{ title: 'Technical Analysis Crypto', topics: 18, duration: '6 Jam', price: 'Rp 79.000', category: 'Trading', emoji: '📉', gradient: 'from-sky-400 to-sky-600' },
		{ title: 'AI & Machine Learning for Crypto', topics: 22, duration: '8 Jam', price: 'Rp 99.000', category: 'Data & AI', emoji: '🤖', gradient: 'from-fuchsia-400 to-fuchsia-600' },
		{ title: 'Ekonomi Syariah & Fintech', topics: 16, duration: '5 Jam', price: 'Rp 69.000', category: 'Syariah', emoji: '💰', gradient: 'from-lime-500 to-lime-700' },
		{ title: 'Stablecoin & CBDC Analysis', topics: 12, duration: '4 Jam', price: 'Rp 59.000', category: 'Blockchain', emoji: '🪙', gradient: 'from-yellow-400 to-yellow-600' },
		{ title: 'DeFi Protocol Deep Dive', topics: 20, duration: '7 Jam', price: 'Rp 89.000', category: 'DeFi', emoji: '🏦', gradient: 'from-emerald-500 to-emerald-700' },
		{ title: 'Blockchain Cybersecurity', topics: 14, duration: '5 Jam', price: 'Rp 79.000', category: 'Security', emoji: '🛡️', gradient: 'from-rose-400 to-rose-600' },
	];

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
	<title>E-learning | CryptoSharia Academy</title>
	<meta name="description" content="Kuasai ratusan skill crypto Syariah. Bangun portfolio & raih sertifikat. Akses materi sekali bayar, lifetime." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden pt-16">
	<div class="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800"></div>
	<div class="absolute inset-0 opacity-10">
		<div class="absolute top-10 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
		<div class="absolute bottom-0 left-10 w-56 h-56 bg-yellow-300 rounded-full blur-3xl"></div>
	</div>
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
		<div class="max-w-2xl">
			<h1 class="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
				<span class="italic">Kuasai Ratusan Skill,</span><br />
				<span class="italic text-yellow-200">Bangun Portfolio & Bersertifikat.</span>
			</h1>
			<p class="mt-5 text-lg text-orange-100 leading-relaxed">
				Akses semua materi sekali bayar. Lebih dari ratusan materi video, studi kasus, bahan bacaan, project praktikal, dan komunitas diskusi lifetime.
			</p>
			<div class="mt-7 flex flex-wrap gap-3">
				<a href="#pricing" class="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-bold text-orange-600 shadow-lg hover:bg-orange-50 active:scale-95 transition-all">Mulai Berlangganan</a>
				<a href="#courses" class="inline-flex items-center rounded-full border-2 border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all">Lihat Semua Materi</a>
			</div>
		</div>
	</div>
	<div class="absolute bottom-0 left-0 right-0">
		<svg viewBox="0 0 1440 50" fill="none" class="w-full"><path d="M0 50L60 43C120 37 240 23 360 20C480 17 600 23 720 27C840 30 960 30 1080 27C1200 23 1320 17 1380 13L1440 10V50H0Z" fill="white"/></svg>
	</div>
</section>

<!-- Features -->
<section class="py-14 bg-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="font-sans text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">Solusi #1 Kuasai Ratusan Skill Crypto Syariah</h2>
		<p class="text-gray-500 text-sm mb-8">Belajar fleksibel, praktikal, dan bersertifikat.</p>
		<div class="space-y-5">
			{#each features as f}
				<div class="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
					<span class="text-2xl flex-shrink-0">{f.icon}</span>
					<div>
						<h3 class="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
						<p class="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Courses with category tabs -->
<section id="courses" class="py-14 bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-sans text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">Ratusan Skill Impian Kini Dalam Genggamanmu</h2>
		<p class="text-center text-gray-500 text-sm mb-8">Lihat contoh beberapa materi terpopuler rancangan experts berikut.</p>

		<!-- Category tabs -->
		<div class="flex flex-wrap gap-2 justify-center mb-8">
			{#each categories as cat}
				<button onclick={() => (activeCategory = cat)} class="px-4 py-2 text-sm font-medium rounded-full transition-all {activeCategory === cat ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'}">
					{cat}
				</button>
			{/each}
		</div>

		<!-- Course cards grid -->
		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
			{#each filteredCourses.slice(0, 10) as course}
				<a href="/payment/e-learning/course-{course.title.toLowerCase().replace(/\s+/g, '-')}" class="group block">
					<div class="rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
						<div class="h-28 bg-gradient-to-br {course.gradient} flex items-center justify-center">
							<span class="text-4xl">{course.emoji}</span>
						</div>
						<div class="p-3">
							<h3 class="font-semibold text-gray-900 text-xs leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{course.title}</h3>
							<div class="flex items-center gap-2 text-[10px] text-gray-400">
								<span>📖 {course.topics} Materi</span>
								<span>⏱ {course.duration}</span>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<div class="text-center mt-8">
			<a href="#pricing" class="inline-flex items-center rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white orange-glow hover:bg-primary-700 active:scale-95 transition-all">Mulai Berlangganan</a>
		</div>
	</div>
</section>

<!-- Learning Paths -->
<section class="py-14 bg-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="font-sans text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">Daftar Learning Path Rancangan Experts</h2>
		<p class="text-gray-500 text-sm mb-8">Cari learning path yang sesuai kebutuhanmu.</p>
		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each learningPaths as path}
				<a href="/payment/e-learning/path-{path.title.toLowerCase().replace(/\s+/g, '-')}" class="group block">
					<div class="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
						<div class="h-32 bg-gradient-to-br {path.gradient} flex items-center justify-center">
							<span class="text-5xl">{path.emoji}</span>
						</div>
						<div class="p-4">
							<h3 class="font-semibold text-gray-900 text-sm mb-2 group-hover:text-primary-600 transition-colors">{path.title}</h3>
							<div class="flex items-center gap-3 text-xs text-gray-400">
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
<section id="pricing" class="py-16 bg-gray-50">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-sans text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">Langganan Sekarang dan Jadi Lebih Hebat</h2>
		<p class="text-center text-gray-500 text-sm mb-10">Langganan bulanan untuk akses semua materi, tanpa batas.</p>
		<div class="grid sm:grid-cols-3 gap-5">
			{#each pricingPlans as plan}
				<div class="rounded-2xl {plan.popular ? 'bg-gradient-to-b from-primary-600 to-primary-700 text-white ring-2 ring-primary-500 ring-offset-2 scale-105' : 'bg-white border border-gray-200'} p-6 shadow-sm relative">
					{#if plan.label}
						<div class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900">{plan.label}</div>
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
<section class="py-14 bg-white">
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
