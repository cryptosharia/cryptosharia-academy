<script lang="ts">
	const badges = [
		{ icon: '🏆', text: 'Top Startup' },
		{ icon: '🎓', text: 'Bersertifikat' },
		{ icon: '🕌', text: '100% Syariah' }
	];
</script>

<section class="relative overflow-hidden pt-16 bg-orange-600">
	<!-- Background Image -->
	<div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/background-beranda.png');"></div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
		<div class="max-w-3xl text-center lg:text-left">
			<div class="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white/90 mb-6">
				<span class="flex h-2 w-2 rounded-full bg-yellow-300 animate-pulse"></span>
				Platform Edukasi Crypto Syariah #1
			</div>

			<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
				<span class="italic">Kuasai Crypto</span><br />
				<span class="italic text-yellow-200">Syariah.</span>
			</h1>

			<p class="mt-6 text-lg sm:text-xl text-white/90 drop-shadow-md max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
				Tingkatkan skill dan bangun karir di ekosistem crypto Syariah terbesar di Indonesia.
			</p>

			<div class="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
				<a
					href="/e-learning"
					class="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-extrabold text-orange-600 shadow-lg shadow-orange-900/30 transition-all hover:bg-orange-50 hover:shadow-xl hover:scale-105 active:scale-95"
				>
					Mulai Belajar Sekarang
					<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
				</a>
				<a
					href="#testimonials"
					class="inline-flex items-center justify-center gap-1.5 px-6 py-3 text-sm font-medium text-white/70 transition-all hover:text-white"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
					Cerita Alumni
				</a>
			</div>

			<!-- Trust badges -->
			<div class="mt-10 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
				{#each badges as badge}
					<div class="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90">
						<span class="text-lg">{badge.icon}</span>
						<span class="font-medium">{badge.text}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Wave bottom -->
	<div class="absolute -bottom-px left-0 right-0">
		<svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="block w-full">
			<path d="M0 60L48 53.3C96 46.7 192 33.3 288 26.7C384 20 480 20 576 23.3C672 26.7 768 33.3 864 36.7C960 40 1056 40 1152 36.7C1248 33.3 1344 26.7 1392 23.3L1440 20V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" class="fill-white dark:fill-gray-950"/>
		</svg>
	</div>
</section>
