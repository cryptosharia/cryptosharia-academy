<script lang="ts">
	// Badges that act as trust markers inline
	const trustMarkers = ['Top Startup ID', '100% Syariah', 'Sertifikat Resmi'];
</script>

<section class="relative overflow-hidden bg-[#0B0F19] pt-20 pb-16 lg:pt-32 lg:pb-28">
	<!-- Subtle background glow -->
	<div
		class="bg-primary-600/10 pointer-events-none absolute top-0 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 rounded-full opacity-50 blur-[120px]"
	></div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
			<!-- Left Side: Copywriting -->
			<div class="z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
				<!-- Inline Badge -->
				<div
					class="border-primary-500/30 bg-primary-500/10 text-primary-400 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold backdrop-blur-sm"
				>
					<span class="bg-primary-500 flex h-2 w-2 animate-pulse rounded-full"></span>
					Platform Edukasi & Komunitas Crypto Syariah #1
				</div>

				<!-- Headline -->
				<h1
					class="font-display mb-6 text-4xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
				>
					Bangun Karir di Industri <br class="hidden sm:block" />
					<span
						class="from-primary-400 bg-gradient-to-r to-orange-300 bg-clip-text text-transparent"
						>Crypto Syariah</span
					> Indonesia
				</h1>

				<!-- Subheadline -->
				<p
					class="mx-auto mb-10 max-w-lg text-lg leading-relaxed font-normal text-slate-300 sm:text-xl lg:mx-0"
				>
					Belajar langsung dari praktisi Web3, bangun jaringan, dan akses peluang di ekosistem
					crypto syariah terbesar di Indonesia.
				</p>

				<!-- CTA & Secondary Action -->
				<div
					class="mb-12 flex flex-col items-center justify-center gap-5 sm:flex-row lg:justify-start"
				>
					<a
						href="/e-learning"
						class="bg-primary-600 hover:bg-primary-500 inline-flex w-full items-center justify-center rounded-full px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(234,88,12,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_60px_-15px_rgba(234,88,12,0.8)] active:scale-95 sm:w-auto"
					>
						Mulai Belajar Sekarang
						<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</a>
					<a
						href="#testimonials"
						class="inline-flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-slate-300 transition-all hover:text-white sm:w-auto"
					>
						<svg
							class="h-5 w-5 text-slate-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
							/><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						Lihat Cerita Alumni
					</a>
				</div>

				<!-- Trust Markers (Clean & Minimal) -->
				<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
					{#each trustMarkers as marker}
						<div class="flex items-center gap-2 text-sm font-medium text-slate-400">
							<svg
								class="text-primary-500 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="3"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							{marker}
						</div>
					{/each}
				</div>
			</div>

			<!-- Right Side: Visual Image -->
			<div class="relative z-10 mx-auto w-full max-w-lg lg:max-w-none lg:pl-10">
				<!-- Decorative elements -->
				<div
					class="from-primary-500/20 absolute -inset-4 rounded-3xl bg-gradient-to-tr to-transparent opacity-50 blur-2xl"
				></div>

				<!-- The actual image -->
				<div
					class="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl lg:aspect-auto"
				>
					<img
						src="/hero-human.png"
						alt="Profesional Crypto Syariah"
						class="h-full w-full object-cover object-center"
					/>

					<!-- Overlay gradient for depth -->
					<div
						class="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60"
					></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Wave bottom to transition to next section -->
	<div class="absolute right-0 -bottom-px left-0">
		<svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="block w-full">
			<path
				d="M0 60L48 53.3C96 46.7 192 33.3 288 26.7C384 20 480 20 576 23.3C672 26.7 768 33.3 864 36.7C960 40 1056 40 1152 36.7C1248 33.3 1344 26.7 1392 23.3L1440 20V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
				class="fill-white dark:fill-gray-950"
			/>
		</svg>
	</div>
</section>
