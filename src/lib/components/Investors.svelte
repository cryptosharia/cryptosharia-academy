<script lang="ts">
	const investors = ['East Ventures', 'DSN-MUI', 'OJK', 'Bappebti', 'Startup Studio ID'];
</script>

<section class="bg-slate-50 py-12 dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2
			class="font-display mb-10 text-center text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white"
		>
			Investor & Affiliations
		</h2>

		<div class="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
			{#each investors as investor (investor)}
				<div
					class="group flex items-center justify-center rounded-xl px-5 py-3 transition-all duration-300 hover:bg-white hover:shadow-sm dark:hover:bg-gray-800"
				>
					<span
						class="font-display text-lg font-bold text-slate-300 transition-colors duration-300 group-hover:text-slate-700 sm:text-xl dark:text-gray-200 dark:text-gray-500"
					>
						{investor}
					</span>
				</div>
			{/each}
		</div>
	</div>
</section>
