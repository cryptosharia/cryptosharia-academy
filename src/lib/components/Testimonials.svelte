<script lang="ts">
	const testimonials = [
		{
			name: 'Ahmad Rizki',
			role: 'Crypto Analyst',
			company: 'Pintu',
			quote: 'Berhasil menjadi Crypto Analyst setelah belajar e-learning di CryptoSharia Academy. Kurikulumnya sangat daging dan sesuai syariat.',
			photo: 'https://randomuser.me/api/portraits/men/32.jpg'
		},
		{
			name: 'Siti Nurhaliza',
			role: 'Blockchain Developer',
			company: 'Tokocrypto',
			quote: 'Materi tech dan fundamental syariah yang diajarkan sangat applicable. Langsung diterima kerja setelah menyelesaikan program.',
			photo: 'https://randomuser.me/api/portraits/women/44.jpg'
		},
		{
			name: 'Muhammad Faisal',
			role: 'DeFi Researcher',
			company: 'INDODAX',
			quote: 'Dari nol pemahaman crypto sampai bisa menganalisis project DeFi mana yang halal dan haram. Sangat direkomendasikan!',
			photo: 'https://randomuser.me/api/portraits/men/67.jpg'
		}
	];
</script>

<section id="testimonials" class="py-16 bg-slate-50 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
			Apa Kata Mereka?
		</h2>
		<p class="text-center text-lg text-slate-500 dark:text-gray-400 mb-14 max-w-2xl mx-auto">
			Cerita nyata dari alumni CryptoSharia Academy yang berhasil membangun karir di industri crypto Syariah.
		</p>

		<div class="grid md:grid-cols-3 gap-8">
			{#each testimonials as t}
				<div class="relative bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
					<!-- Quote mark icon -->
					<div class="absolute top-6 right-8 text-primary-100 dark:text-gray-700 opacity-50 group-hover:text-primary-200 dark:group-hover:text-gray-600 transition-colors">
						<svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
							<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
						</svg>
					</div>

					<!-- Large Photo -->
					<div class="mb-6 relative z-10">
						<img src={t.photo} alt={t.name} class="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md" />
					</div>

					<!-- Quote text -->
					<p class="text-slate-700 dark:text-gray-300 text-base leading-relaxed mb-6 relative z-10 italic">
						"{t.quote}"
					</p>

					<!-- Author info -->
					<div class="border-t border-slate-100 dark:border-gray-700 pt-5 mt-auto relative z-10">
						<div class="font-bold text-slate-900 dark:text-white">{t.name}</div>
						<div class="text-sm font-medium text-primary-600 dark:text-primary-400 mt-1">{t.role}</div>
						<div class="text-xs text-slate-500 dark:text-gray-400">@ {t.company}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
