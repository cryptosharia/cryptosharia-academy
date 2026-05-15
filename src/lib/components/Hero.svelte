<script lang="ts">
	const badges = [
		{ icon: '🏆', text: 'Top Startup' },
		{ icon: '⭐', text: '4.9 Rating' },
		{ icon: '🎓', text: 'Bersertifikat' },
		{ icon: '🕌', text: '100% Syariah' }
	];
</script>

<section class="relative overflow-hidden pt-16">
	<!-- Background — CryptoSharia Orange -->
	<div class="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800"></div>
	<div class="absolute inset-0 opacity-10">
		<div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
		<div class="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
	</div>
	<!-- Geometric pattern overlay -->
	<div class="absolute inset-0 opacity-5" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"></div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<!-- Left: Text Content -->
			<div class="text-center lg:text-left">
				<div class="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white/90 mb-6">
					<span class="flex h-2 w-2 rounded-full bg-yellow-300 animate-pulse"></span>
					Platform Edukasi Crypto Syariah #1
				</div>

				<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
					<span class="italic">Kuasai Crypto</span><br />
					<span class="italic text-yellow-200">Syariah.</span>
				</h1>

				<p class="mt-6 text-lg sm:text-xl text-orange-100 max-w-xl mx-auto lg:mx-0 leading-relaxed">
					Kembangkan Skill dan Raih Karir di Ekosistem Kripto Syariah Terbesar. Belajar dari para ahli, raih sertifikat.
				</p>

				<div class="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
					<a
						href="#programs"
						class="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-bold text-orange-600 shadow-lg shadow-black/10 transition-all hover:bg-orange-50 hover:shadow-xl active:scale-95"
					>
						Lihat Program
						<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</a>
					<a
						href="#testimonials"
						class="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50"
					>
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

			<!-- Right: Illustration -->
			<div class="hidden lg:flex justify-center">
				<div class="relative">
					<!-- Decorative cards -->
					<div class="absolute -top-4 -left-4 w-64 h-40 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 transform -rotate-6">
						<div class="flex items-center gap-3 mb-3">
							<div class="w-10 h-10 rounded-full bg-yellow-400/30 flex items-center justify-center text-xl">📊</div>
							<div>
								<div class="text-white font-semibold text-sm">Analisis Token</div>
								<div class="text-white/60 text-xs">Screening Syariah</div>
							</div>
						</div>
						<div class="flex gap-1.5">
							<div class="h-2 rounded-full bg-orange-300/40 flex-1"></div>
							<div class="h-2 rounded-full bg-yellow-400/50 w-1/3"></div>
						</div>
					</div>

					<div class="w-80 h-80 rounded-3xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg border border-white/20 flex items-center justify-center">
						<div class="text-center">
							<div class="text-7xl mb-4">🕌</div>
							<div class="text-white font-display font-bold text-xl">Halal Crypto</div>
							<div class="text-orange-200 text-sm mt-1">Education Platform</div>
						</div>
					</div>

					<div class="absolute -bottom-4 -right-4 w-56 h-32 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 transform rotate-3">
						<div class="flex items-center gap-2 mb-2">
							<span class="text-yellow-300 text-lg">✅</span>
							<span class="text-white text-sm font-semibold">Sertifikat Tersedia</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-yellow-300 text-lg">✅</span>
							<span class="text-white text-sm font-semibold">Materi Praktikal</span>
						</div>
						<div class="flex items-center gap-2 mt-1">
							<span class="text-yellow-300 text-lg">✅</span>
							<span class="text-white text-sm font-semibold">Komunitas Aktif</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Wave bottom -->
	<div class="absolute bottom-0 left-0 right-0">
		<svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
			<path d="M0 60L48 53.3C96 46.7 192 33.3 288 26.7C384 20 480 20 576 23.3C672 26.7 768 33.3 864 36.7C960 40 1056 40 1152 36.7C1248 33.3 1344 26.7 1392 23.3L1440 20V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white"/>
		</svg>
	</div>
</section>
