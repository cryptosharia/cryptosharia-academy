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
		{#each imageTestimonials as item, index (item.name)}
			<div class="w-full min-w-full shrink-0 snap-start sm:min-w-[calc(50%-0.625rem)] lg:min-w-[calc(33.333333%-1.25rem*2/3)]">
				<div
					class="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-orange-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-900/60"
				>
					<div class="flex-1 bg-slate-50 dark:bg-slate-950/50 p-2 sm:p-4 flex items-center justify-center">
						<img src={item.image} alt="Testimonial dari {item.name}" class="w-full h-auto object-contain drop-shadow-sm rounded-md" />
					</div>
					<div class="border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
								{item.name.charAt(0)}
							</div>
							<p class="truncate text-sm font-bold text-slate-900 dark:text-white">
								{item.name}
							</p>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Dots Indicator -->
	{#if imageTestimonials.length > 1}
		<div class="mt-4 flex justify-center gap-2">
			{#each imageTestimonials as _, index}
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
