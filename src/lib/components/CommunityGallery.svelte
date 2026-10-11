<script lang="ts">
	const activities = [
		{
			title: 'Workshop Offline',
			image:
				'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=400&q=80'
		},
		{
			title: 'Diskusi Discord VIP',
			image:
				'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=400&q=80'
		},
		{
			title: 'Webinar Bulanan',
			image:
				'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=400&q=80'
		},
		{
			title: 'Studi Kasus Ekosistem',
			image:
				'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80'
		},
		{
			title: 'Review Portfolio',
			image:
				'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=400&q=80'
		},
		{
			title: 'Hackathon Syariah',
			image:
				'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80'
		}
	];
</script>

<section class="bg-white py-24 dark:bg-gray-950" id="community">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2
				class="font-display mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white"
			>
				Masuk ke Dalam Ekosistem <span class="text-primary-600">Web3 Syariah</span>
			</h2>
			<p class="mx-auto max-w-2xl text-lg text-slate-500 dark:text-gray-400">
				Lebih dari sekedar kelas online. Bergabunglah dengan ribuan builder, investor, dan
				profesional lain yang saling mendukung.
			</p>
		</div>

		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
			{#each activities as activity, i (i)}
				{@const heights = ['h-48', 'h-56', 'h-44', 'h-52', 'h-48', 'h-56']}
				<div
					class="group relative {heights[
						i
					]} hover:shadow-primary-500/20 cursor-pointer overflow-hidden rounded-2xl bg-slate-900 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
				>
					<img
						src={activity.image}
						alt={activity.title}
						class="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-slate-900/40 to-transparent"
					></div>

					<div
						class="absolute inset-x-0 bottom-0 translate-y-2 transform p-4 transition-transform duration-300 group-hover:translate-y-0"
					>
						<span class="block text-sm leading-tight font-bold text-white">{activity.title}</span>
						<span
							class="bg-primary-500 mt-2 block h-1 w-8 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						></span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
