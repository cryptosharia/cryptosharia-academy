<script lang="ts">
	import { resolve } from '$app/paths';
	const roadmapSteps = [
		{
			title: 'Basic Blockchain & Web3',
			description:
				'Pemahaman mendasar teknologi desentralisasi, dompet kripto (wallet), dan keamanan digital.',
			icon: '⛓️'
		},
		{
			title: 'Crypto Fundamentals',
			description:
				'Analisis utilitas token, tokenomics, dan cara kerja ekosistem di berbagai jaringan layer-1/layer-2.',
			icon: '📊'
		},
		{
			title: 'Syariah Compliance',
			description:
				'Standar halal-haram investasi crypto, metodologi screening DSN-MUI & standar global (AAOIFI).',
			icon: '🕌'
		},
		{
			title: 'Risk & Portfolio Management',
			description:
				'Teknik alokasi aset, psikologi investasi, dan mitigasi risiko dari market crash.',
			icon: '🛡️'
		},
		{
			title: 'DeFi & Halal Yield',
			description:
				'Cara mendapatkan imbal hasil pasif melalui staking dan liquidity pool yang sesuai prinsip Syariah.',
			icon: '💸'
		},
		{
			title: 'Career & Networking',
			description:
				'Review CV, persiapan interview Web3, dan akses eksklusif ke portal lowongan kerja CryptoSharia.',
			icon: '🚀'
		}
	];
</script>

<section
	class="border-t border-slate-200 bg-slate-50 py-24 dark:border-slate-800 dark:bg-slate-900"
	id="program"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto mb-16 max-w-3xl text-center">
			<h2
				class="font-display mb-6 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white"
			>
				Roadmap Belajar <span
					class="from-primary-500 bg-gradient-to-r to-orange-400 bg-clip-text text-transparent"
					>Terstruktur</span
				>
			</h2>
			<p class="text-lg text-slate-500 dark:text-slate-400">
				Bukan sekadar kumpulan video acak. Kami mendesain kurikulum komprehensif dari nol hingga
				Anda siap berkarir di industri Web3.
			</p>
		</div>

		<!-- Roadmap Grid -->
		<div class="relative z-10 mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each roadmapSteps as step, i (i)}
				<div
					class="hover:border-primary-300 dark:hover:border-primary-700 group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
				>
					<!-- Step Number Watermark -->
					<div
						class="pointer-events-none absolute top-4 right-6 text-6xl font-black text-slate-100 transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110 dark:text-slate-800/50"
					>
						0{i + 1}
					</div>

					<div
						class="bg-primary-50 dark:bg-primary-900/30 border-primary-100 dark:border-primary-800/50 relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl"
					>
						{step.icon}
					</div>
					<h3 class="relative z-10 mb-3 text-xl font-bold text-slate-900 dark:text-white">
						{step.title}
					</h3>
					<p class="relative z-10 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
						{step.description}
					</p>
				</div>
			{/each}
		</div>

		<!-- Offer Card / CTA -->
		<div class="mx-auto max-w-4xl">
			<div
				class="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
			>
				<!-- Glow backdrop -->
				<div
					class="bg-primary-600/30 pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full blur-[100px]"
				></div>

				<div
					class="relative flex flex-col items-center justify-between gap-10 p-8 md:flex-row md:p-12"
				>
					<div class="flex-1">
						<div
							class="bg-primary-500/20 border-primary-500/30 text-primary-400 mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-bold tracking-wide uppercase"
						>
							Akses Seumur Hidup
						</div>
						<h3 class="mb-4 text-3xl font-extrabold text-white">CryptoSharia Academy E-Learning</h3>
						<p class="mb-6 text-slate-400">
							Akses ke seluruh modul di atas, update materi selamanya, komunitas eksklusif, dan
							sertifikat kelulusan.
						</p>
						<ul class="space-y-3">
							<li class="flex items-center gap-3 text-sm text-slate-300">
								<svg
									class="text-primary-500 h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="3"
										d="M5 13l4 4L19 7"
									/></svg
								>
								100+ Video Materi
							</li>
							<li class="flex items-center gap-3 text-sm text-slate-300">
								<svg
									class="text-primary-500 h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="3"
										d="M5 13l4 4L19 7"
									/></svg
								>
								Akses Grup Telegram & Discord VIP
							</li>
							<li class="flex items-center gap-3 text-sm text-slate-300">
								<svg
									class="text-primary-500 h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="3"
										d="M5 13l4 4L19 7"
									/></svg
								>
								Gratis Update Materi Masa Depan
							</li>
						</ul>
					</div>
					<div class="flex w-full flex-col items-center md:w-auto">
						<a
							href={resolve('/e-learning')}
							class="bg-primary-600 hover:bg-primary-500 inline-flex w-full items-center justify-center rounded-full px-10 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 md:w-auto"
						>
							Daftar Sekarang
						</a>
						<p class="mt-4 text-center text-xs text-slate-500">
							Bergabung dengan 10.000+ alumni lainnya
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
