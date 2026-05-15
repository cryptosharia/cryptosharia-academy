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
		},
		{
			title: 'Bootcamp',
			description: 'Intensive live class bersama experts. Praktikal & mendalam.',
			features: [
				'Kombinasi case study, diskusi dan praktik di tiap sesi. Basic to advanced',
				'Group mentoring semi-privat untuk bangun portfolio',
				'Tutor terkurasi. Memiliki lebih dari 5.000 alumni'
			],
			cta: 'Lihat Ragam Bootcamp',
			ctaHref: '/bootcamp',
			icon: '🎓',
			gradient: 'from-violet-500 to-violet-700',
			bgLight: 'bg-violet-50',
			borderColor: 'border-violet-200',
			ctaColor: 'bg-violet-600 hover:bg-violet-700'
		}
	];
</script>

<section id="programs" class="py-20 bg-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
			Berbagai Program CryptoSharia
		</h2>
		<p class="text-center text-slate-500 mb-14 max-w-2xl mx-auto">
			Pilih jalur belajar yang sesuai dengan kebutuhanmu. Dari pemula hingga profesional.
		</p>

		<div class="space-y-16">
			{#each programs as program, i}
				<div class="grid lg:grid-cols-2 gap-10 items-center {i % 2 !== 0 ? 'lg:grid-flow-col-dense' : ''}">
					<!-- Text -->
					<div class="{i % 2 !== 0 ? 'lg:col-start-2' : ''}">
						<div class="inline-flex items-center gap-2 rounded-full {program.bgLight} px-4 py-1.5 text-sm font-semibold text-slate-700 mb-4">
							<span class="text-lg">{program.icon}</span>
							{program.title}
						</div>
						<h3 class="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3">
							{program.title}
						</h3>
						<p class="text-slate-600 mb-5 leading-relaxed">{program.description}</p>
						<ul class="space-y-3 mb-6">
							{#each program.features as feature}
								<li class="flex items-start gap-3 text-sm text-slate-600">
									<span class="flex-shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-primary-100 text-primary-600">
										<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
										</svg>
									</span>
									<span>{feature}</span>
								</li>
							{/each}
						</ul>
						<div class="flex flex-wrap gap-3">
							<a
								href={program.ctaHref}
								class="inline-flex items-center rounded-full {program.ctaColor} px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-95"
							>
								{program.cta}
							</a>
							{#if program.ctaSecondary}
								<a
									href={program.ctaSecondaryHref}
									class="inline-flex items-center rounded-full border-2 border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
								>
									{program.ctaSecondary}
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
