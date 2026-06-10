<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { ProofItem } from '$lib/landingContent';

	let { items = [] }: { items: ProofItem[] } = $props();

	// Safe image-based mapping replacing text items
	const imageTestimonials = [
		{ name: 'Suarabangjan', image: '/images/testimonials/Suarabangjan.png' },
		{ name: 'Syaukah (TNSR)', image: '/images/testimonials/Syaukah TNSR.png' },
		{ name: 'Thoriq', image: '/images/testimonials/Thoriq.png' },
		{ name: 'Kang Ayip', image: '/images/testimonials/Kang Ayip.png' },
		{ name: 'Syaukah (NAORIS)', image: '/images/testimonials/Syaukah NAORIS.png' }
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
	class="relative mx-auto max-w-[960px]"
	onmouseenter={() => isPaused = true}
	onmouseleave={() => isPaused = false}
	ontouchstart={() => isPaused = true}
	ontouchend={() => {
		setTimeout(() => isPaused = false, 1000);
	}}
>
	<div
		bind:this={containerRef}
		onscroll={updateActiveIndex}
		class="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
	>
		{#each imageTestimonials as item, index (item.name)}
			<div class="w-[85vw] min-w-[85vw] shrink-0 snap-start md:w-[calc(50%-10px)] md:min-w-[calc(50%-10px)]">
				<div class="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950 shadow-lg shadow-black/20 transition hover:border-orange-500/40 hover:shadow-orange-950/20">
					<!-- Screenshot -->
					<img
						src={item.image}
						alt="Testimonial dari {item.name}"
						class="block w-full h-auto object-contain"
					/>
					<!-- Compact overlay name badge -->
					<div class="absolute bottom-0 inset-x-0 flex items-center gap-2 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent px-4 pt-8 pb-3">
						<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-black text-orange-400 backdrop-blur-sm">
							{item.name.charAt(0)}
						</div>
						<span class="text-xs font-bold text-slate-300">{item.name}</span>
						<span class="text-[9px] font-semibold tracking-wider text-slate-500 uppercase">· Member</span>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Dots -->
	{#if imageTestimonials.length > 1}
		<div class="mt-4 flex justify-center gap-2">
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

