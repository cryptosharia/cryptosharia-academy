<script lang="ts">
	const media = ['TechInAsia', 'IDN Times', 'CNBC Indonesia', 'TechNode Global', 'IDX Channel', 'DailySocial'];
</script>

<section class="py-12 bg-white dark:bg-gray-800 border-t border-slate-100 dark:border-gray-800">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-10">
			Telah Diliput Oleh
		</h2>

		<!-- Marquee -->
		<div class="overflow-hidden">
			<div class="flex items-center gap-14 animate-marquee">
				{#each [...media, ...media] as name}
					<div class="flex-shrink-0 px-4">
						<span class="text-lg sm:text-xl font-extrabold tracking-tight text-slate-200 dark:text-slate-600 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 font-display whitespace-nowrap cursor-default select-none">
							{name}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
