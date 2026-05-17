<script lang="ts">
	const media = [
		{ name: 'TechInAsia', domain: 'techinasia.com' },
		{ name: 'IDN Times', domain: 'idntimes.com' },
		{ name: 'CNBC Indonesia', domain: 'cnbcindonesia.com' },
		{ name: 'TechNode Global', domain: 'technode.global' },
		{ name: 'IDX Channel', domain: 'idxchannel.com' },
		{ name: 'DailySocial', domain: 'dailysocial.id' }
	];
</script>

<section class="py-12 bg-white dark:bg-gray-800 border-t border-slate-100 dark:border-gray-800">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-10">
			Proudly Featured In
		</h2>

		<!-- Marquee -->
		<div class="overflow-hidden">
			<div class="flex items-center gap-14 animate-marquee">
				{#each [...media, ...media] as mediaItem}
					<div class="flex-shrink-0 px-4">
						<img 
							src="https://logo.clearbit.com/{mediaItem.domain}" 
							alt="{mediaItem.name} logo" 
							class="h-8 md:h-10 object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
							onerror={(e) => { const el = e.currentTarget; el.onerror = null; el.src = `https://ui-avatars.com/api/?name=${mediaItem.name}&background=f8fafc&color=64748b&bold=true`; }}
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
