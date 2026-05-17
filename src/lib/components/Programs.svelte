<script lang="ts">
	const programs = [
		{
			title: 'E-learning',
			description: 'Pelajari ratusan skill sekali bayar. Praktik dan bersertifikat.',
			features: [
				'Belajar fleksibel via video materi, bahan bacaan, project dan studi kasus',
				'Praktikal & actionable. Bertahap dari level dasar hingga lanjut',
				'Grup komunitas diskusi lifetime. Kelas gratis tiap bulannya'
			],
			cta: 'Lihat Ribuan Materi',
			ctaHref: '/e-learning',
			icon: '📚',
			gradient: 'from-primary-500 to-primary-700',
			bgLight: 'bg-primary-50',
			borderColor: 'border-primary-200',
			ctaColor: 'bg-primary-600 hover:bg-primary-700'
		}
	];
</script>

<section id="programs" class="py-20 bg-white dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
			Program E-Learning CryptoSharia
		</h2>
		<p class="text-center text-lg text-slate-500 dark:text-gray-400 mb-14 max-w-2xl mx-auto">
			Mulai perjalanan belajarmu di dunia crypto Syariah dengan kurikulum terbaik. Dari pemula hingga profesional.
		</p>

		<div class="max-w-2xl mx-auto">
			{#each programs as program}
				<div class="relative rounded-3xl border-2 border-primary-500/20 dark:border-primary-500/30 bg-white dark:bg-slate-900 p-8 md:p-10 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300">
					<!-- Badge -->
					<div class="absolute -top-4 right-8 bg-gradient-to-r from-primary-500 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg transform rotate-3">
						Best Value
					</div>

					<div class="inline-flex items-center gap-2 rounded-full {program.bgLight} dark:bg-primary-900/30 px-4 py-1.5 text-sm font-semibold text-primary-700 dark:text-primary-300 mb-6 border border-primary-100 dark:border-primary-800">
						<span class="text-lg">{program.icon}</span>
						{program.title}
					</div>
					<h3 class="font-sans text-xl font-bold text-gray-900 dark:text-white mb-3">{program.title}</h3>
					<p class="text-gray-600 dark:text-gray-300 text-sm mb-5 leading-relaxed">{program.description}</p>
					<ul class="space-y-3 mb-6">
						{#each program.features as feature}
							<li class="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
								<span class="flex-shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-primary-100 text-primary-600">
									<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
									</svg>
								</span>
								<span>{feature}</span>
							</li>
						{/each}
					</ul>
					<a
						href={program.ctaHref}
						class="inline-flex items-center rounded-full {program.ctaColor} px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-95"
					>
						{program.cta}
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>
