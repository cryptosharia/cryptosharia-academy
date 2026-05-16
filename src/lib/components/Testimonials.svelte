<script lang="ts">
	const testimonials = [
		{
			name: 'Ahmad Rizki',
			role: 'Crypto Analyst',
			company: 'Pintu',
			quote: 'Berhasil menjadi Crypto Analyst setelah belajar e-learning di CryptoSharia Academy.',
			color: 'from-primary-400 to-primary-600'
		},
		{
			name: 'Siti Nurhaliza',
			role: 'Blockchain Developer',
			company: 'Tokocrypto',
			quote: 'Ikut Bootcamp Blockchain, langsung diterima kerja di Tokocrypto. Alhamdulillah!',
			color: 'from-violet-400 to-violet-600'
		},
		{
			name: 'Muhammad Faisal',
			role: 'DeFi Researcher',
			company: 'INDODAX',
			quote: 'Review CV AI membantu saya menyusun portfolio. Diterima di INDODAX dalam 2 minggu.',
			color: 'from-accent-400 to-accent-600'
		},
		{
			name: 'Dewi Kartika',
			role: 'Sharia Compliance',
			company: 'Bank Syariah Indonesia',
			quote: 'Materi screening Syariah di CryptoSharia sangat komprehensif dan praktikal.',
			color: 'from-emerald-400 to-emerald-600'
		},
		{
			name: 'Budi Santoso',
			role: 'Smart Contract Auditor',
			company: 'Freelancer',
			quote: 'Dari nol hingga bisa audit smart contract sendiri. Materi benar-benar step by step.',
			color: 'from-blue-400 to-blue-600'
		},
		{
			name: 'Rina Amelia',
			role: 'Community Manager',
			company: 'CryptoSharia',
			quote: 'Belajar Community Management di sini lalu langsung berkarir di ekosistem crypto Syariah.',
			color: 'from-rose-400 to-rose-600'
		}
	];

	let scrollContainer: HTMLDivElement;

	function scrollLeft() {
		scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
	}

	function scrollRight() {
		scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
	}
</script>

<section id="testimonials" class="py-16 bg-slate-50 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
			Terbukti Berdampak dan Membuka Batasan
		</h2>
		<p class="text-center text-slate-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
			Cerita nyata dari alumni CryptoSharia Academy yang berhasil membangun karir di industri crypto Syariah.
		</p>

		<div class="relative">
			<!-- Scroll buttons -->
			<button
				onclick={scrollLeft}
				class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:text-primary-600 hover:border-primary-300 transition-colors"
				aria-label="Scroll left"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<button
				onclick={scrollRight}
				class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:text-primary-600 hover:border-primary-300 transition-colors"
				aria-label="Scroll right"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>

			<!-- Cards container -->
			<div
				bind:this={scrollContainer}
				class="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
				style="scrollbar-width: none; -ms-overflow-style: none;"
			>
				{#each testimonials as t}
					<div class="flex-shrink-0 w-72 sm:w-80 snap-start">
						<div class="relative h-full rounded-2xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-200">
							<!-- Gradient accent bar -->
							<div class="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r {t.color}"></div>

							<!-- Avatar -->
							<div class="flex items-center gap-3 mb-4 mt-2">
								<div class="w-12 h-12 rounded-full bg-gradient-to-br {t.color} flex items-center justify-center text-white font-bold text-lg">
									{t.name[0]}
								</div>
								<div>
									<div class="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</div>
									<div class="text-xs text-slate-500 dark:text-gray-400">{t.role}, {t.company}</div>
								</div>
							</div>

							<!-- Quote -->
							<p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4">"{t.quote}"</p>

							<!-- CTA -->
							<a href="#" class="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
								Baca Cerita
								<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
