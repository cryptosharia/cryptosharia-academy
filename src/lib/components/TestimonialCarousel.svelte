<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { ProofItem } from '$lib/landingContent';

	let { items = [] }: { items: ProofItem[] } = $props();

	// Safe image-based mapping replacing text items
	const imageTestimonials = [
		{ name: 'Aizul', image: '/images/testimonials/Aizul.png' },
		{ name: 'Antii', image: '/images/testimonials/Antii.png' },
		{ name: 'Firman', image: '/images/testimonials/Firman.png' },
		{ name: 'Ibrahim', image: '/images/testimonials/Ibrahim.png' },
		{ name: 'Muhamad Cholid', image: '/images/testimonials/Muhamad Cholid.png' },
		{ name: 'Rainsha Sinna', image: '/images/testimonials/Rainsha Sinna.png' }
	];

	let containerRef: HTMLDivElement;
	let activeIndex = $state(0);
	let intervalId: ReturnType<typeof setInterval>;
	let isPaused = $state(false);

	function updateActiveIndex() {
		if (!containerRef) return;
		const scrollLeft = containerRef.scrollLeft;
		let closest = 0;
		let closestDist = Infinity;
		for (let i = 0; i < containerRef.children.length; i++) {
			const child = containerRef.children[i] as HTMLElement;
			const dist = Math.abs(child.offsetLeft - scrollLeft);
			if (dist < closestDist) {
				closestDist = dist;
				closest = i;
			}
		}
		activeIndex = closest;
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
			if (isPaused || imageTestimonials.length === 0 || !containerRef) return;
			
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
	class="relative mx-auto max-w-[1120px]"
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
		class="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
	>
		{#each imageTestimonials as item, index (item.name)}
			<div class="w-[85vw] min-w-[85vw] shrink-0 snap-start sm:w-[340px] sm:min-w-[340px]">
				<div
					class="flex h-full flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900 shadow-lg shadow-orange-950/10 transition hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-950/15 dark:border-slate-700/60 dark:bg-slate-900"
				>
					<!-- Screenshot area with constrained height -->
					<div class="flex max-h-[480px] items-center justify-center overflow-hidden bg-slate-950/60 p-3">
						<img
							src={item.image}
							alt="Testimonial dari {item.name}"
							class="h-auto max-h-[456px] w-full rounded-lg object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
						/>
					</div>
					<!-- Name label -->
					<div class="border-t border-slate-800 bg-slate-900 px-4 py-3">
						<div class="flex items-center gap-3">
							<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-xs font-black text-orange-400">
								{item.name.charAt(0)}
							</div>
							<p class="truncate text-sm font-bold text-slate-200">
								{item.name}
							</p>
							<span class="ml-auto text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Member</span>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Dots Indicator -->
	{#if imageTestimonials.length > 1}
		<div class="mt-5 flex justify-center gap-2">
			{#each imageTestimonials as _, index}
				<button
					type="button"
					aria-label="Go to slide {index + 1}"
					class="h-2 rounded-full transition-all duration-300 {activeIndex === index ? 'w-6 bg-orange-500' : 'w-2 bg-slate-600 hover:bg-orange-400'}"
					onclick={() => scrollToSlide(index)}
				></button>
			{/each}
		</div>
	{/if}
</div>
