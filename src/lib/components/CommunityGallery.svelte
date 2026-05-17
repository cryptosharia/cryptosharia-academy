<script lang="ts">
	const activities = [
		{
			title: 'Workshop Blockchain Syariah di Jakarta',
			emoji: '🕌'
		},
		{
			title: 'Meetup Komunitas dengan Para Expert',
			emoji: '🤝'
		},
		{
			title: 'FREE Webinar untuk Member Setiap Bulan',
			emoji: '💻'
		},
		{
			title: 'Diskusi DeFi Halal dan Studi Kasus',
			emoji: '📊'
		},
		{
			title: 'Sesi Mentoring Portfolio Bersama',
			emoji: '🎯'
		},
		{
			title: 'Hackathon Web3 Syariah',
			emoji: '🏆'
		}
	];
</script>

<section class="py-16 bg-white dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
			Rasanya Gabung Komunitas CryptoSharia <span class="text-primary-600">#CryptoHalal</span>
		</h2>
		<p class="text-center text-lg text-slate-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
			Lebih dari sekedar belajar — gabung komunitas yang aktif, suportif, dan terus berkembang.
		</p>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
			{#each activities as activity, i}
				{@const heights = ['h-48', 'h-56', 'h-44', 'h-52', 'h-48', 'h-56']}
				{@const isPrimary = i % 2 === 0}
				<div
					class="group relative {heights[i]} rounded-2xl overflow-hidden bg-gradient-to-br {isPrimary ? 'from-primary-500 to-primary-700' : 'from-slate-800 to-slate-950'} cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
				>
					<div class="absolute inset-0 opacity-10">
						<div class="absolute top-0 right-0 w-20 h-20 bg-white rounded-full blur-xl"></div>
					</div>
					<div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
						<span class="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">{activity.emoji}</span>
						<span class="text-white text-xs sm:text-sm font-semibold leading-tight">{activity.title}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
