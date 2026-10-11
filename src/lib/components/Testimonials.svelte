<script lang="ts">
	const testimonials = [
		{
			quote:
				'Dalam 2 bulan lulus dari akademi, saya berhasil masuk project Web3 pertama sebagai Community Manager. Pemahaman syariah compliance bikin saya stand out saat interview.',
			name: 'Budi Santoso',
			role: 'Web3 Community Manager',
			company: 'PixelDAO',
			photo: 'https://randomuser.me/api/portraits/men/32.jpg'
		},
		{
			quote:
				'Sekarang saya bekerja sebagai Research Analyst di perusahaan blockchain tier-1. Modul risk management dan tokenomics dari CryptoSharia benar-benar dipakai di dunia nyata.',
			name: 'Aisyah Putri',
			role: 'Research Analyst',
			company: 'Coinvestasi',
			photo: 'https://randomuser.me/api/portraits/women/44.jpg'
		},
		{
			quote:
				'Dulu takut trading karena nggak paham mana yang halal. Berkat CryptoSharia, portofolio DeFi saya tumbuh 40% tahun ini murni dari ekosistem yang dijamin syariah compliance-nya.',
			name: 'Rizky Pratama',
			role: 'Private Investor',
			company: 'Alumni Batch 3',
			photo: 'https://randomuser.me/api/portraits/men/86.jpg'
		}
	];
</script>

<section class="bg-white py-24 dark:bg-gray-950" id="testimonials">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2
			class="font-display mb-4 text-center text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white"
		>
			Apa Kata Mereka?
		</h2>
		<p class="mx-auto mb-16 max-w-2xl text-center text-lg text-slate-500 dark:text-gray-400">
			Cerita nyata dari alumni CryptoSharia Academy yang berhasil menembus industri Web3 dan
			membangun portofolio investasi yang aman dan etis.
		</p>

		<!-- Static Grid Display -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each testimonials as t}
				<div
					class="relative flex flex-col rounded-3xl border border-slate-100 bg-slate-50 p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
				>
					<!-- Quote mark decoration -->
					<div
						class="text-primary-200 dark:text-primary-900/40 absolute top-6 right-8 font-serif text-6xl leading-none opacity-50"
					>
						"
					</div>

					<!-- Quote text -->
					<p
						class="relative z-10 mb-8 flex-1 text-base leading-relaxed font-medium text-slate-700 italic dark:text-gray-300"
					>
						"{t.quote}"
					</p>

					<!-- Author info -->
					<div
						class="mt-auto flex items-center gap-4 border-t border-slate-200 pt-6 dark:border-gray-800"
					>
						<img
							src={t.photo}
							alt={t.name}
							class="h-12 w-12 rounded-full border border-slate-200 object-cover shadow-sm dark:border-gray-700"
						/>
						<div>
							<h4 class="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
							<p class="text-primary-600 dark:text-primary-400 text-xs font-semibold">{t.role}</p>
							<p class="text-xs text-slate-500">@ {t.company}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
