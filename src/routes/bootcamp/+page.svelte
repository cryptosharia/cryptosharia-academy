<script lang="ts">
	let searchQuery = $state('');

	const badges = [
		{ text: '> 5.000 Orang Telah Lulus' },
		{ text: '4.9 rating di Course Report' }
	];

	const testimonials = [
		{ name: 'Ahmad Rizki', quote: 'Switch Career setelah join bootcamp, langsung dapat kerja di Tokocrypto.', color: 'from-orange-400 to-orange-600' },
		{ name: 'Siti Aisyah', quote: 'Jadi Data Analyst di perusahaan crypto setelah bootcamp Data Analysis.', color: 'from-violet-400 to-violet-600' },
		{ name: 'Faisal Rahman', quote: 'Diterima kerja di INDODAX usai bootcamp Blockchain Development.', color: 'from-blue-400 to-blue-600' },
		{ name: 'Dewi Kartika', quote: 'Jadi Sharia Compliance Officer berkat bootcamp Fiqh Muamalah Digital.', color: 'from-emerald-400 to-emerald-600' },
		{ name: 'Budi Santoso', quote: 'Diterima sebagai Smart Contract Auditor usai bootcamp Solidity.', color: 'from-rose-400 to-rose-600' }
	];

	interface Bootcamp {
		title: string;
		date: string;
		price: string;
		isFree: boolean;
		category: string;
		emoji: string;
		gradient: string;
	}

	const bootcamps: Bootcamp[] = [
		// Paid bootcamps
		{ title: 'BLOCKCHAIN FUNDAMENTALS: FULLSTACK INTENSIVE BOOTCAMP', date: '5 Juni 2026', price: 'Rp 650.000', isFree: false, category: 'Blockchain', emoji: '⛓️', gradient: 'from-orange-500 to-orange-700' },
		{ title: 'SMART CONTRACT & SOLIDITY: FULLSTACK INTENSIVE BOOTCAMP', date: '12 Juni 2026', price: 'Rp 650.000', isFree: false, category: 'Development', emoji: '📝', gradient: 'from-violet-500 to-violet-700' },
		{ title: 'DATA ANALYSIS CRYPTO: FULLSTACK INTENSIVE BOOTCAMP', date: '10 Juni 2026', price: 'Rp 450.000', isFree: false, category: 'Data', emoji: '📊', gradient: 'from-blue-500 to-blue-700' },
		{ title: 'FIQH MUAMALAH DIGITAL & CRYPTO SYARIAH: INTENSIVE TRAINING', date: '11 Juni 2026', price: 'Rp 500.000', isFree: false, category: 'Syariah', emoji: '🕌', gradient: 'from-emerald-500 to-emerald-700' },
		{ title: 'DEFI & YIELD FARMING HALAL: INTENSIVE BOOTCAMP', date: '1 Juli 2026', price: 'Rp 450.000', isFree: false, category: 'DeFi', emoji: '🌾', gradient: 'from-teal-500 to-teal-700' },
		{ title: 'TOKEN SCREENING SYARIAH: FULLSTACK INTENSIVE BOOTCAMP', date: '19 Juni 2026', price: 'Rp 350.000', isFree: false, category: 'Syariah', emoji: '🔍', gradient: 'from-amber-500 to-amber-700' },
		{ title: 'WEB3 FRONTEND DEVELOPMENT: INTENSIVE BOOTCAMP', date: '14 Juni 2026', price: 'Rp 450.000', isFree: false, category: 'Development', emoji: '💻', gradient: 'from-cyan-500 to-cyan-700' },
		{ title: 'CRYPTO TRADING & RISK MANAGEMENT BOOTCAMP', date: '26 Juni 2026', price: 'Rp 350.000', isFree: false, category: 'Trading', emoji: '📈', gradient: 'from-pink-500 to-pink-700' },
		{ title: 'NFT & DIGITAL ASSET MANAGEMENT BOOTCAMP', date: '6 Juli 2026', price: 'Rp 350.000', isFree: false, category: 'NFT', emoji: '🎨', gradient: 'from-fuchsia-500 to-fuchsia-700' },
		{ title: 'PRODUCT MANAGEMENT WEB3: INTENSIVE BOOTCAMP', date: '14 Juli 2026', price: 'Rp 350.000', isFree: false, category: 'Product', emoji: '🎯', gradient: 'from-indigo-500 to-indigo-700' },
		{ title: 'CYBERSECURITY & WALLET PROTECTION BOOTCAMP', date: '25 Juni 2026', price: 'Rp 450.000', isFree: false, category: 'Security', emoji: '🔐', gradient: 'from-red-500 to-red-700' },
		{ title: 'AI & AUTOMATION FOR CRYPTO: INTENSIVE BOOTCAMP', date: '7 Juli 2026', price: 'Rp 350.000', isFree: false, category: 'AI', emoji: '🤖', gradient: 'from-sky-500 to-sky-700' },
		// Free bootcamps
		{ title: 'BLOCKCHAIN BASICS: FREE SHORT CLASS', date: '2 Juni 2026', price: 'Gratis', isFree: true, category: 'Blockchain', emoji: '⛓️', gradient: 'from-orange-400 to-orange-600' },
		{ title: 'CRYPTO SYARIAH 101: FREE SHORT CLASS', date: '3 Juni 2026', price: 'Gratis', isFree: true, category: 'Syariah', emoji: '🕌', gradient: 'from-emerald-400 to-emerald-600' },
		{ title: 'SMART CONTRACT BASICS: FREE SHORT CLASS', date: '18 Juni 2026', price: 'Gratis', isFree: true, category: 'Development', emoji: '📝', gradient: 'from-violet-400 to-violet-600' },
		{ title: 'DEFI FUNDAMENTALS: FREE SHORT CLASS', date: '4 Juni 2026', price: 'Gratis', isFree: true, category: 'DeFi', emoji: '🌾', gradient: 'from-teal-400 to-teal-600' },
		{ title: 'DATA ANALYSIS CRYPTO: FREE SHORT CLASS', date: '9 Juni 2026', price: 'Gratis', isFree: true, category: 'Data', emoji: '📊', gradient: 'from-blue-400 to-blue-600' },
		{ title: 'WEB3 DEVELOPMENT: FREE SHORT CLASS', date: '17 Juni 2026', price: 'Gratis', isFree: true, category: 'Development', emoji: '💻', gradient: 'from-cyan-400 to-cyan-600' },
	];

	const filteredBootcamps = $derived(
		searchQuery.trim()
			? bootcamps.filter(b =>
				b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				b.category.toLowerCase().includes(searchQuery.toLowerCase())
			)
			: bootcamps
	);

	let testimonialContainer: HTMLDivElement;
</script>

<svelte:head>
	<title>Bootcamp & Program | CryptoSharia Academy</title>
	<meta name="description" content="Bootcamp crypto Syariah yang memberi hasil. Fokus praktik & portfolio. Full online, dipandu oleh praktisi senior." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden pt-16">
	<div class="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800"></div>
	<div class="absolute inset-0 opacity-10">
		<div class="absolute top-10 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
		<div class="absolute bottom-0 left-10 w-56 h-56 bg-yellow-300 rounded-full blur-3xl"></div>
	</div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
		<div class="grid lg:grid-cols-2 gap-10 items-center">
			<div>
				<h1 class="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
					<span class="italic">Bootcamp yang Memberi Hasil.</span><br />
					<span class="italic text-yellow-200">Fokus Praktik & Portfolio.</span>
				</h1>
				<p class="mt-5 text-lg text-orange-100 leading-relaxed max-w-lg">
					Full Online dan Dipandu oleh Praktisi Senior. Praktikal, lebih dari sekadar Webinar. Fokus Bantu Kembangkan Skill dan Portfolio di Industri Crypto Syariah.
				</p>
				<div class="mt-7 flex flex-wrap items-center gap-3">
					<a href="#program" class="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-bold text-orange-600 shadow-lg transition-all hover:bg-orange-50 active:scale-95">
						Lihat Program Pilihan
					</a>
					<a href="#" class="inline-flex items-center rounded-full border-2 border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50">
						Dapatkan Promo
					</a>
				</div>
				<div class="mt-6 flex flex-wrap items-center gap-4">
					{#each badges as badge}
						<div class="flex items-center gap-2 text-sm text-white/80 font-medium">
							<svg class="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							{badge.text}
						</div>
					{/each}
				</div>
			</div>

			<!-- Right illustration -->
			<div class="hidden lg:flex justify-center">
				<div class="w-72 h-72 rounded-3xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg border border-white/20 flex items-center justify-center">
					<div class="text-center">
						<div class="text-7xl mb-3">🎓</div>
						<div class="text-white font-sans font-bold text-xl">Bootcamp</div>
						<div class="text-orange-200 text-sm mt-1">Intensive Program</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Wave -->
	<div class="absolute bottom-0 left-0 right-0">
		<svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
			<path d="M0 50L60 43.3C120 36.7 240 23.3 360 20C480 16.7 600 23.3 720 26.7C840 30 960 30 1080 26.7C1200 23.3 1320 16.7 1380 13.3L1440 10V50H0Z" fill="white"/>
		</svg>
	</div>
</section>

<!-- Testimonials -->
<section class="py-12 bg-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-sans text-xl sm:text-2xl font-extrabold text-gray-900 mb-8">
			Testimoni Alumni Bootcamp CryptoSharia
		</h2>
		<div
			bind:this={testimonialContainer}
			class="flex gap-4 overflow-x-auto pb-4"
			style="scrollbar-width: none;"
		>
			{#each testimonials as t}
				<div class="flex-shrink-0 w-64">
					<div class="h-full rounded-2xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
						<div class="flex items-center gap-3 mb-3">
							<div class="w-10 h-10 rounded-full bg-gradient-to-br {t.color} flex items-center justify-center text-white font-bold text-sm">
								{t.name[0]}
							</div>
							<span class="font-semibold text-gray-900 text-sm">{t.name}</span>
						</div>
						<p class="text-gray-600 text-sm leading-relaxed">"{t.quote}"</p>
						<button class="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
							Baca Cerita →
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Search + Bootcamp Grid -->
<section id="program" class="py-12 bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Search bar -->
		<div class="relative max-w-xl mx-auto mb-10">
			<svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Apa yang ingin kamu pelajari?"
				class="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
			/>
		</div>

		<!-- Bootcamp cards grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
			{#each filteredBootcamps as bootcamp}
				<a href="#" class="group block">
					<div class="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-200">
						<!-- Card header / thumbnail -->
						<div class="relative h-40 bg-gradient-to-br {bootcamp.gradient} flex items-center justify-center overflow-hidden">
							<div class="absolute inset-0 opacity-10">
								<div class="absolute -top-5 -right-5 w-24 h-24 bg-white rounded-full blur-xl"></div>
							</div>
							{#if bootcamp.isFree}
								<div class="absolute top-3 left-3 inline-flex items-center rounded-full bg-green-500 px-2.5 py-1 text-xs font-bold text-white">
									Kelas Gratis Bersertifikat
								</div>
							{/if}
							<div class="relative text-center">
								<div class="text-5xl mb-1">{bootcamp.emoji}</div>
								<div class="text-white/80 text-xs font-semibold uppercase tracking-wider">{bootcamp.category}</div>
							</div>
							{#if bootcamp.isFree}
								<div class="absolute bottom-3 right-3 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
									<span class="text-white font-bold text-xs">15%</span>
								</div>
							{/if}
						</div>

						<!-- Card body -->
						<div class="p-4">
							<h3 class="font-semibold text-gray-900 text-sm leading-snug mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[2.5rem]">
								{bootcamp.title}
							</h3>
							<div class="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								{bootcamp.date}
							</div>
							<div class="flex items-center gap-2 text-xs {bootcamp.isFree ? 'text-green-600 font-bold' : 'text-gray-500'}">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								{bootcamp.price}
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>

		{#if filteredBootcamps.length === 0}
			<div class="text-center py-16">
				<div class="text-5xl mb-4">🔍</div>
				<p class="text-gray-500 text-sm">Tidak ada bootcamp yang cocok dengan pencarian "{searchQuery}"</p>
			</div>
		{/if}
	</div>
</section>

<!-- Corporate CTA -->
<section class="py-16 bg-white">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12 text-center overflow-hidden relative">
			<div class="absolute inset-0 opacity-5">
				<div class="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div>
			</div>
			<div class="relative">
				<div class="text-4xl mb-4">🏢</div>
				<h2 class="font-sans text-xl sm:text-2xl font-extrabold text-white mb-3">
					E-learning & Training Untuk Perusahaan
				</h2>
				<p class="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto mb-8">
					Miliki akses ratusan konten e-learning CryptoSharia Academy serta dukungan corporate training untuk perusahaan. Miliki juga berbagai fitur khusus untuk mendorong employee performance dan development di bidang crypto Syariah.
				</p>
				<a
					href="#"
					class="inline-flex items-center rounded-full bg-primary-600 px-8 py-3 text-sm font-bold text-white shadow-lg orange-glow transition-all hover:bg-primary-700 active:scale-95"
				>
					Hubungi Kami
				</a>
			</div>
		</div>
	</div>
</section>
