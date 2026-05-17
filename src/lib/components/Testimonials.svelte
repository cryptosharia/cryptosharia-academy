<script lang="ts">
	const testimonials = [
		{
			quote: "Dalam 2 bulan lulus dari akademi, saya berhasil masuk project Web3 pertama sebagai Community Manager. Pemahaman syariah compliance bikin saya stand out saat interview.",
			name: 'Budi Santoso',
			role: 'Web3 Community Manager',
			company: 'PixelDAO',
			photo: 'https://randomuser.me/api/portraits/men/32.jpg'
		},
		{
			quote: "Sekarang saya bekerja sebagai Research Analyst di perusahaan blockchain tier-1. Modul risk management dan tokenomics dari CryptoSharia benar-benar dipakai di dunia nyata.",
			name: 'Aisyah Putri',
			role: 'Research Analyst',
			company: 'Coinvestasi',
			photo: 'https://randomuser.me/api/portraits/women/44.jpg'
		},
		{
			quote: "Dulu takut trading karena nggak paham mana yang halal. Berkat CryptoSharia, portofolio DeFi saya tumbuh 40% tahun ini murni dari ekosistem yang dijamin syariah compliance-nya.",
			name: 'Rizky Pratama',
			role: 'Private Investor',
			company: 'Alumni Batch 3',
			photo: 'https://randomuser.me/api/portraits/men/86.jpg'
		}
	];
</script>

<section class="py-24 bg-white dark:bg-gray-950" id="testimonials">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
			Apa Kata Mereka?
		</h2>
		<p class="text-center text-lg text-slate-500 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
			Cerita nyata dari alumni CryptoSharia Academy yang berhasil menembus industri Web3 dan membangun portofolio investasi yang aman dan etis.
		</p>

		<!-- Static Grid Display -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each testimonials as t}
				<div class="relative flex flex-col bg-slate-50 dark:bg-gray-900 p-8 rounded-3xl border border-slate-100 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1">
					<!-- Quote mark decoration -->
					<div class="absolute top-6 right-8 text-6xl text-primary-200 dark:text-primary-900/40 font-serif leading-none opacity-50">
						"
					</div>

					<!-- Quote text -->
					<p class="text-slate-700 dark:text-gray-300 text-base leading-relaxed mb-8 relative z-10 italic font-medium flex-1">
						"{t.quote}"
					</p>

					<!-- Author info -->
					<div class="flex items-center gap-4 mt-auto pt-6 border-t border-slate-200 dark:border-gray-800">
						<img src={t.photo} alt={t.name} class="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200 dark:border-gray-700" />
						<div>
							<h4 class="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
							<p class="text-xs text-primary-600 dark:text-primary-400 font-semibold">{t.role}</p>
							<p class="text-xs text-slate-500">@ {t.company}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
