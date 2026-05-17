<script lang="ts">
	const principles = [
		{
			title: 'Bebas Riba & Gharar',
			description: 'Fokus pada spot market dan ekosistem terdesentralisasi. Kami tidak mengajarkan margin trading, futures, atau skema perjudian.',
			icon: '⚖️'
		},
		{
			title: 'Aset Fundamental',
			description: 'Menganalisis token berdasarkan utilitas nyata, teknologi, dan adopsi, bukan sekadar hype atau pompom koin micin.',
			icon: '💎'
		},
		{
			title: 'Transparansi Penuh',
			description: 'Mempelajari cara membaca smart contract dan on-chain data untuk memastikan tidak ada penipuan (scam) tersembunyi.',
			icon: '🔍'
		},
		{
			title: 'Manajemen Risiko',
			description: 'Edukasi investasi yang mengutamakan proteksi modal dan alokasi aset yang rasional sesuai profil risiko Anda.',
			icon: '🛡️'
		}
	];
</script>

<section class="py-20 lg:py-28 bg-white dark:bg-gray-950 border-t border-slate-100 dark:border-gray-800">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center max-w-3xl mx-auto mb-16">
			<h2 class="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
				Prinsip Fundamental <span class="text-primary-600">Crypto Syariah</span> Kami
			</h2>
			<p class="text-lg text-slate-500 dark:text-gray-400">
				Bukan tentang mencari untung instan. Kami membangun ekosistem edukasi web3 yang etis, aman, dan sesuai dengan prinsip keuangan Islam.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each principles as p}
				<div class="group bg-slate-50 dark:bg-gray-900 rounded-3xl p-8 border border-slate-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
					<div class="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
						{p.icon}
					</div>
					<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">{p.title}</h3>
					<p class="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
						{p.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
