<script lang="ts">
	const investors = [
		'East Ventures', 'DSN-MUI', 'OJK', 'Bappebti', 'Startup Studio ID'
	];
</script>

<section class="py-12 bg-slate-50">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-xl sm:text-2xl font-extrabold text-slate-900 mb-10">
			Investor & Affiliations
		</h2>

		<div class="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
			{#each investors as investor}
				<div class="group flex items-center justify-center px-5 py-3 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-sm">
					<span class="text-lg sm:text-xl font-bold text-slate-300 group-hover:text-slate-700 transition-colors duration-300 font-display">
						{investor}
					</span>
				</div>
			{/each}
		</div>
	</div>
</section>
