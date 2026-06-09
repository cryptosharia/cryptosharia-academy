<script lang="ts">
	type Highlight = { symbol: string; performance: string };

	let { highlights = [] }: { highlights: Highlight[] } = $props();

	function coinLogoPath(symbol: string): string {
		return `/coins/${symbol.toLowerCase()}.png`;
	}

	let imgErrors = $state<Record<string, boolean>>({});

	function handleImgError(symbol: string) {
		imgErrors[symbol] = true;
	}
</script>

<!-- Reduced motion: static grid -->
<div class="mt-5">
	<div class="hidden motion-reduce:grid motion-reduce:grid-cols-2 motion-reduce:gap-3 motion-reduce:sm:grid-cols-4">
		{#each highlights as item (item.symbol)}
			<div class="rounded-lg border border-white/10 bg-white/[0.07] px-5 py-3 backdrop-blur">
				<div class="flex items-center gap-2">
					{#if !imgErrors[item.symbol]}
						<img
							src={coinLogoPath(item.symbol)}
							alt={item.symbol}
							class="h-7 w-7 rounded-full object-cover"
							onerror={() => handleImgError(item.symbol)}
						/>
					{:else}
						<div class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-xs font-black text-white">
							{item.symbol.charAt(0)}
						</div>
					{/if}
					<div>
						<div class="text-[11px] font-black tracking-[0.14em] text-slate-400 uppercase">{item.symbol}</div>
						<div class="text-xl font-black text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]">{item.performance}</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Normal motion: scrolling marquee -->
	<div class="overflow-hidden rounded-xl motion-reduce:hidden">
		<div class="coin-ticker-track flex w-max gap-4 hover:[animation-play-state:paused]">
			{#each [...highlights, ...highlights] as item, i (item.symbol + '-' + i)}
				<div class="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.07] px-5 py-3 backdrop-blur">
					{#if !imgErrors[item.symbol]}
						<img
							src={coinLogoPath(item.symbol)}
							alt={item.symbol}
							class="h-8 w-8 rounded-full object-cover"
							onerror={() => handleImgError(item.symbol)}
						/>
					{:else}
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-xs font-black text-white">
							{item.symbol.charAt(0)}
						</div>
					{/if}
					<div>
						<div class="text-[11px] font-black tracking-[0.14em] text-slate-400 uppercase">{item.symbol}</div>
						<div class="text-xl font-black text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]">{item.performance}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.coin-ticker-track {
		animation: coin-ticker 30s linear infinite;
	}

	@keyframes coin-ticker {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
</style>
