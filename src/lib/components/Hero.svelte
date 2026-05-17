<script lang="ts">
	// Badges that act as trust markers inline
	const trustMarkers = [
		'Top Startup ID',
		'100% Syariah',
		'Sertifikat Resmi'
	];
</script>

<section class="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-28 bg-[#0B0F19]">
	<!-- Subtle background glow -->
	<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
			
			<!-- Left Side: Copywriting -->
			<div class="max-w-2xl text-center lg:text-left z-10 mx-auto lg:mx-0">
				
				<!-- Inline Badge -->
				<div class="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-primary-400 mb-8">
					<span class="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
					Platform Edukasi & Komunitas Crypto Syariah #1
				</div>

				<!-- Headline -->
				<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-6">
					Bangun Karir di Industri <br class="hidden sm:block" />
					<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-300">Crypto Syariah</span> Indonesia
				</h1>

				<!-- Subheadline -->
				<p class="text-lg sm:text-xl text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal mb-10">
					Belajar langsung dari praktisi Web3, bangun jaringan, dan akses peluang di ekosistem crypto syariah terbesar di Indonesia.
				</p>

				<!-- CTA & Secondary Action -->
				<div class="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start mb-12">
					<a
						href="/e-learning"
						class="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(234,88,12,0.6)] transition-all hover:bg-primary-500 hover:shadow-[0_0_60px_-15px_rgba(234,88,12,0.8)] hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto"
					>
						Mulai Belajar Sekarang
						<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</a>
					<a
						href="#testimonials"
						class="inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-slate-300 transition-all hover:text-white w-full sm:w-auto"
					>
						<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
						Lihat Cerita Alumni
					</a>
				</div>

				<!-- Trust Markers (Clean & Minimal) -->
				<div class="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
					{#each trustMarkers as marker}
						<div class="flex items-center gap-2 text-sm font-medium text-slate-400">
							<svg class="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
							</svg>
							{marker}
						</div>
					{/each}
				</div>
			</div>

			<!-- Right Side: Visual Image -->
			<div class="relative w-full max-w-lg mx-auto lg:max-w-none z-10 lg:pl-10">
				<!-- Decorative elements -->
				<div class="absolute -inset-4 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-3xl blur-2xl opacity-50"></div>
				
				<!-- The actual image -->
				<div class="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-[4/3] lg:aspect-auto">
					<img 
						src="/hero-human.png" 
						alt="Profesional Crypto Syariah" 
						class="w-full h-full object-cover object-center"
					/>
					
					<!-- Overlay gradient for depth -->
					<div class="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60"></div>
				</div>
			</div>

		</div>
	</div>

	<!-- Wave bottom to transition to next section -->
	<div class="absolute -bottom-px left-0 right-0">
		<svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="block w-full">
			<path d="M0 60L48 53.3C96 46.7 192 33.3 288 26.7C384 20 480 20 576 23.3C672 26.7 768 33.3 864 36.7C960 40 1056 40 1152 36.7C1248 33.3 1344 26.7 1392 23.3L1440 20V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" class="fill-white dark:fill-gray-950"/>
		</svg>
	</div>
</section>
