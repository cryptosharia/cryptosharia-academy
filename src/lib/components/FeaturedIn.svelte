<script lang="ts">
	const media = [
		'TechInAsia', 'IDN Times', 'CNBC Indonesia', 'TechNode Global', 'IDX Channel', 'DailySocial'
	];
</script>

<section class="py-12 bg-white border-t border-slate-100">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-xl sm:text-2xl font-extrabold text-slate-900 mb-10">
			Proudly Featured In
		</h2>

		<!-- Marquee -->
		<div class="overflow-hidden">
			<div class="flex items-center gap-14 animate-marquee">
				{#each [...media, ...media] as name}
					<div class="flex-shrink-0 px-4">
						<span class="text-lg sm:text-xl font-bold text-slate-200 hover:text-primary-500 transition-colors duration-300 font-display whitespace-nowrap cursor-default">
							{name}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
