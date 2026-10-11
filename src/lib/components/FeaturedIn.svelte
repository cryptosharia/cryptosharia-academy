<script lang="ts">
	const media = [
		'TechInAsia',
		'IDN Times',
		'CNBC Indonesia',
		'TechNode Global',
		'IDX Channel',
		'DailySocial'
	];
</script>

<section class="border-t border-slate-100 bg-white py-12 dark:border-gray-800 dark:bg-gray-800">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2
			class="font-display mb-10 text-center text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white"
		>
			Telah Diliput Oleh
		</h2>

		<!-- Marquee -->
		<div class="overflow-hidden">
			<div class="animate-marquee flex items-center gap-14">
				{#each [...media, ...media] as name, index (index)}
					<div class="flex-shrink-0 px-4">
						<span
							class="hover:text-primary-500 dark:hover:text-primary-400 font-display cursor-default text-lg font-extrabold tracking-tight whitespace-nowrap text-slate-200 transition-colors duration-300 select-none sm:text-xl dark:text-slate-600"
						>
							{name}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
