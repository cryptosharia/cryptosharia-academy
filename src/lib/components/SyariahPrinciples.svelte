<script lang="ts">
	const principles = [
		{
			title: 'Bebas Riba & Gharar',
			description:
				'Fokus pada spot market dan ekosistem terdesentralisasi. Kami tidak mengajarkan margin trading, futures, atau skema perjudian.',
			icon: '⚖️'
		},
		{
			title: 'Aset Fundamental',
			description:
				'Menganalisis token berdasarkan utilitas nyata, teknologi, dan adopsi, bukan sekadar hype atau pompom koin micin.',
			icon: '💎'
		},
		{
			title: 'Transparansi Penuh',
			description:
				'Mempelajari cara membaca smart contract dan on-chain data untuk memastikan tidak ada penipuan (scam) tersembunyi.',
			icon: '🔍'
		},
		{
			title: 'Manajemen Risiko',
			description:
				'Edukasi investasi yang mengutamakan proteksi modal dan alokasi aset yang rasional sesuai profil risiko Anda.',
			icon: '🛡️'
		}
	];
</script>

<section
	class="border-t border-slate-100 bg-white py-20 lg:py-28 dark:border-gray-800 dark:bg-gray-950"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto mb-16 max-w-3xl text-center">
			<h2
				class="font-display mb-6 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white"
			>
				Prinsip Fundamental <span class="text-primary-600">Crypto Syariah</span> Kami
			</h2>
			<p class="text-lg text-slate-500 dark:text-gray-400">
				Bukan tentang mencari untung instan. Kami membangun ekosistem edukasi web3 yang etis, aman,
				dan sesuai dengan prinsip keuangan Islam.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each principles as p}
				<div
					class="group hover:border-primary-200 dark:hover:border-primary-800 rounded-3xl border border-slate-100 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
				>
					<div
						class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-white text-3xl shadow-sm transition-transform duration-300 group-hover:scale-110 dark:border-gray-700 dark:bg-gray-800"
					>
						{p.icon}
					</div>
					<h3 class="mb-3 text-xl font-bold text-slate-900 dark:text-white">{p.title}</h3>
					<p class="text-sm leading-relaxed text-slate-600 dark:text-gray-400">
						{p.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
