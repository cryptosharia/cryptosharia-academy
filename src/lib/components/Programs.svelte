<script lang="ts">
	const roadmapSteps = [
		{
			title: 'Basic Blockchain & Web3',
			description: 'Pemahaman mendasar teknologi desentralisasi, dompet kripto (wallet), dan keamanan digital.',
			icon: '⛓️'
		},
		{
			title: 'Crypto Fundamentals',
			description: 'Analisis utilitas token, tokenomics, dan cara kerja ekosistem di berbagai jaringan layer-1/layer-2.',
			icon: '📊'
		},
		{
			title: 'Syariah Compliance',
			description: 'Standar halal-haram investasi crypto, metodologi screening DSN-MUI & standar global (AAOIFI).',
			icon: '🕌'
		},
		{
			title: 'Risk & Portfolio Management',
			description: 'Teknik alokasi aset, psikologi investasi, dan mitigasi risiko dari market crash.',
			icon: '🛡️'
		},
		{
			title: 'DeFi & Halal Yield',
			description: 'Cara mendapatkan imbal hasil pasif melalui staking dan liquidity pool yang sesuai prinsip Syariah.',
			icon: '💸'
		},
		{
			title: 'Career & Networking',
			description: 'Review CV, persiapan interview Web3, dan akses eksklusif ke portal lowongan kerja CryptoSharia.',
			icon: '🚀'
		}
	];
</script>

<section class="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800" id="program">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center max-w-3xl mx-auto mb-16">
			<h2 class="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
				Roadmap Belajar <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">Terstruktur</span>
			</h2>
			<p class="text-lg text-slate-500 dark:text-slate-400">
				Bukan sekadar kumpulan video acak. Kami mendesain kurikulum komprehensif dari nol hingga Anda siap berkarir di industri Web3.
			</p>
		</div>

		<!-- Roadmap Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 relative z-10">
			{#each roadmapSteps as step, i}
				<div class="relative bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 group">
					<!-- Step Number Watermark -->
					<div class="absolute top-4 right-6 text-6xl font-black text-slate-100 dark:text-slate-800/50 pointer-events-none transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
						0{i + 1}
					</div>
					
					<div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-2xl mb-6 border border-primary-100 dark:border-primary-800/50 relative z-10">
						{step.icon}
					</div>
					<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">{step.title}</h3>
					<p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed relative z-10">
						{step.description}
					</p>
				</div>
			{/each}
		</div>

		<!-- Offer Card / CTA -->
		<div class="max-w-4xl mx-auto">
			<div class="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
				<!-- Glow backdrop -->
				<div class="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/30 rounded-full blur-[100px] pointer-events-none"></div>
				
				<div class="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
					<div class="flex-1">
						<div class="inline-block px-4 py-1.5 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-400 text-xs font-bold tracking-wide uppercase mb-4">
							Akses Seumur Hidup
						</div>
						<h3 class="text-3xl font-extrabold text-white mb-4">CryptoSharia Academy E-Learning</h3>
						<p class="text-slate-400 mb-6">Akses ke seluruh modul di atas, update materi selamanya, komunitas eksklusif, dan sertifikat kelulusan.</p>
						<ul class="space-y-3">
							<li class="flex items-center gap-3 text-sm text-slate-300">
								<svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
								100+ Video Materi
							</li>
							<li class="flex items-center gap-3 text-sm text-slate-300">
								<svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
								Akses Grup Telegram & Discord VIP
							</li>
							<li class="flex items-center gap-3 text-sm text-slate-300">
								<svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
								Gratis Update Materi Masa Depan
							</li>
						</ul>
					</div>
					<div class="w-full md:w-auto flex flex-col items-center">
						<a href="/e-learning" class="w-full md:w-auto inline-flex items-center justify-center rounded-full bg-primary-600 px-10 py-4 text-base font-bold text-white shadow-lg hover:bg-primary-500 transition-all hover:-translate-y-1">
							Daftar Sekarang
						</a>
						<p class="text-xs text-slate-500 mt-4 text-center">Bergabung dengan 10.000+ alumni lainnya</p>
					</div>
				</div>
			</div>
		</div>

	</div>
</section>
