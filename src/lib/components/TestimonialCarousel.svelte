<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { ProofItem } from '$lib/landingContent';

	let { items = [] }: { items: ProofItem[] } = $props();

	let containerRef: HTMLDivElement;
	let activeIndex = $state(0);
	let intervalId: ReturnType<typeof setInterval>;
	let isPaused = $state(false);

	function updateActiveIndex() {
		if (!containerRef) return;
		const scrollLeft = containerRef.scrollLeft;
		const width = containerRef.offsetWidth;
		activeIndex = Math.round(scrollLeft / width);
	}

	function scrollToSlide(index: number) {
		if (!containerRef) return;
		// Determine item width. We can approximate it based on viewport, but scrolling to child offset is safer
		const child = containerRef.children[index] as HTMLElement;
		if (child) {
			containerRef.scrollTo({
				left: child.offsetLeft,
				behavior: 'smooth'
			});
		}
	}

	function startAutoSlide() {
		// Respect prefers-reduced-motion
		if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		stopAutoSlide();
		intervalId = setInterval(() => {
			if (isPaused || items.length === 0 || !containerRef) return;
			
			// Figure out how many items are currently visible to avoid scrolling past the end
			const width = containerRef.offsetWidth;
			const scrollWidth = containerRef.scrollWidth;
			const maxScrollLeft = scrollWidth - width;
			
			// If we reached the end, go back to start
			if (containerRef.scrollLeft >= maxScrollLeft - 10) {
				containerRef.scrollTo({ left: 0, behavior: 'smooth' });
			} else {
				// Find the next child to scroll to
				const currentLeft = containerRef.scrollLeft;
				let targetChild: HTMLElement | null = null;
				
				for (let i = 0; i < containerRef.children.length; i++) {
					const child = containerRef.children[i] as HTMLElement;
					if (child.offsetLeft > currentLeft + 10) {
						targetChild = child;
						break;
					}
				}
				
				if (targetChild) {
					containerRef.scrollTo({ left: targetChild.offsetLeft, behavior: 'smooth' });
				}
			}
		}, 5000);
	}

	function stopAutoSlide() {
		if (intervalId) {
			clearInterval(intervalId);
		}
	}

	onMount(() => {
		startAutoSlide();
	});

	onDestroy(() => {
		stopAutoSlide();
	});
</script>

<div 
	class="relative"
	onmouseenter={() => isPaused = true}
	onmouseleave={() => isPaused = false}
	ontouchstart={() => isPaused = true}
	ontouchend={() => {
		// Resume after a slight delay to allow scroll to settle
		setTimeout(() => isPaused = false, 1000);
	}}
>
	<div
		bind:this={containerRef}
		onscroll={updateActiveIndex}
		class="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
	>
		{#each items as item, index (item.title)}
			<div class="w-full min-w-full shrink-0 snap-start sm:min-w-[calc(50%-0.625rem)] lg:min-w-[calc(33.333333%-1.25rem*2/3)]">
				{#if item.image}
					<div
						class="h-full overflow-hidden rounded-xl border border-slate-200 shadow-sm transition hover:border-orange-200 hover:shadow-md dark:border-slate-800 dark:hover:border-orange-900/60"
					>
						<img src={item.image} alt={item.title || item.meta} class="w-full h-full object-cover" />
					</div>
				{:else}
					<div
						class="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-900/60"
					>
						<!-- Stars -->
						<div class="mb-4 flex gap-0.5">
							{#each Array(5) as _}
								<svg
									class="h-4 w-4 text-orange-400"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
							{/each}
						</div>

						<!-- Quote -->
						<blockquote class="flex-1 text-sm leading-7 text-slate-700 dark:text-slate-300">
							<span class="text-2xl font-black leading-none text-orange-300">"</span>
							{item.description}
							<span class="text-2xl font-black leading-none text-orange-300">"</span>
						</blockquote>

						<!-- Divider -->
						<div class="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
							<div class="flex items-center gap-3">
								<!-- Avatar initials -->
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-black text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"
								>
									{item.meta?.split(',')[0]?.trim().charAt(0) ?? '?'}
								</div>
								<div class="min-w-0">
									<p class="truncate text-sm font-bold text-slate-900 dark:text-white">
										{item.meta?.split(',')[0]?.trim() ?? ''}
									</p>
									{#if item.meta?.includes(',')}
										<p class="truncate text-xs text-slate-500 dark:text-slate-400">
											{item.meta.split(',').slice(1).join(',').trim()}
										</p>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Dots Indicator -->
	{#if items.length > 1}
		<div class="mt-4 flex justify-center gap-2">
			{#each items as _, index}
				<button
					type="button"
					aria-label="Go to slide {index + 1}"
					class="h-2 rounded-full transition-all duration-300 {activeIndex === index ? 'w-6 bg-orange-500' : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-orange-300 dark:hover:bg-orange-900/60'}"
					onclick={() => scrollToSlide(index)}
				></button>
			{/each}
		</div>
	{/if}
</div>
