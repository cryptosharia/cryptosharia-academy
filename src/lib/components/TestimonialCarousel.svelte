<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { ProofItem } from '$lib/landingContent';

	let { items = [] }: { items: ProofItem[] } = $props();

	const imageTestimonials = [
		{ name: 'Suarabangjan', image: '/images/testimonials/Suarabangjan.png' },
		{ name: 'Syaukah (TNSR)', image: '/images/testimonials/Syaukah TNSR.png' },
		{ name: 'Thoriq', image: '/images/testimonials/Thoriq.png' },
		{ name: 'Kang Ayip', image: '/images/testimonials/Kang Ayip.png' },
		{ name: 'Syaukah (NAORIS)', image: '/images/testimonials/Syaukah NAORIS.png' },
		{ name: 'Affan Zaky', image: '/images/testimonials/image.png' },
		{ name: 'Excel', image: '/images/testimonials/excellentmous.png' },
		{ name: 'Sir', image: '/images/testimonials/sir.png' },
		{ name: 'Arief Adjie Wicaksono', image: '/images/testimonials/Arief Adjie Wicaksono.png' },
		{ name: 'Faqih', image: '/images/testimonials/Faqih.png' }
	];

	let containerRef: HTMLDivElement;
	let activeIndex = $state(0);
	let intervalId: ReturnType<typeof setInterval>;
	let isPaused = $state(false);
	let lightboxIndex = $state<number | null>(null);

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
		const child = containerRef.children[index] as HTMLElement;
		if (child) {
			containerRef.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
		}
	}

	function navigate(direction: -1 | 1) {
		const len = imageTestimonials.length;
		if (!containerRef || len === 0) return;

		// If lightbox is open, navigate within lightbox
		if (lightboxIndex !== null) {
			lightboxIndex = (lightboxIndex + direction + len) % len;
			return;
		}

		// Otherwise scroll the carousel
		const next = (activeIndex + direction + len) % len;
		scrollToSlide(next);
	}

	function openLightbox(index: number) {
		lightboxIndex = index;
		isPaused = true;
	}

	function closeLightbox() {
		lightboxIndex = null;
		isPaused = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (lightboxIndex !== null) {
			if (e.key === 'Escape') closeLightbox();
			if (e.key === 'ArrowLeft') navigate(-1);
			if (e.key === 'ArrowRight') navigate(1);
		}
	}

	function startAutoSlide() {
		if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}
		stopAutoSlide();
		intervalId = setInterval(() => {
			if (isPaused || imageTestimonials.length === 0 || !containerRef) return;
			const width = containerRef.offsetWidth;
			const scrollWidth = containerRef.scrollWidth;
			const maxScrollLeft = scrollWidth - width;
			if (containerRef.scrollLeft >= maxScrollLeft - 10) {
				containerRef.scrollTo({ left: 0, behavior: 'smooth' });
			} else {
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
		if (intervalId) clearInterval(intervalId);
	}

	onMount(() => {
		startAutoSlide();
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		stopAutoSlide();
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown);
		}
	});
</script>

<!-- Carousel wrapper -->
<div
	class="group relative mx-auto max-w-[960px]"
	onmouseenter={() => isPaused = true}
	onmouseleave={() => { if (lightboxIndex === null) isPaused = false; }}
	ontouchstart={() => isPaused = true}
	ontouchend={() => { if (lightboxIndex === null) setTimeout(() => isPaused = false, 1000); }}
>
	<!-- Left arrow -->
	<button
		type="button"
		aria-label="Previous testimonial"
		onclick={() => navigate(-1)}
		class="absolute left-0 top-1/2 z-10 -translate-x-3 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-slate-400 shadow-lg shadow-black/30 backdrop-blur-md transition hover:border-orange-500/50 hover:text-orange-400 hover:shadow-orange-950/30 md:-translate-x-5 md:h-11 md:w-11"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
		</svg>
	</button>

	<!-- Right arrow -->
	<button
		type="button"
		aria-label="Next testimonial"
		onclick={() => navigate(1)}
		class="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-slate-400 shadow-lg shadow-black/30 backdrop-blur-md transition hover:border-orange-500/50 hover:text-orange-400 hover:shadow-orange-950/30 md:translate-x-5 md:h-11 md:w-11"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
		</svg>
	</button>

	<!-- Scrollable track -->
	<div
		bind:this={containerRef}
		onscroll={updateActiveIndex}
		class="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
	>
		{#each imageTestimonials as item, index (item.name)}
			<div class="w-[85vw] min-w-[85vw] shrink-0 snap-start md:w-[calc(50%-10px)] md:min-w-[calc(50%-10px)]">
				<button
					type="button"
					class="w-full cursor-zoom-in text-left"
					onclick={() => openLightbox(index)}
				>
					<div class="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950 shadow-lg shadow-black/20 transition hover:border-orange-500/40 hover:shadow-orange-950/20">
						<img
							src={item.image}
							alt="Testimonial dari {item.name}"
							class="block w-full h-auto object-contain"
						/>
						<div class="absolute bottom-0 inset-x-0 flex items-center gap-2 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent px-4 pt-8 pb-3">
							<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-black text-orange-400 backdrop-blur-sm">
								{item.name.charAt(0)}
							</div>
							<span class="text-xs font-bold text-slate-300">{item.name}</span>
							<span class="text-[9px] font-semibold tracking-wider text-slate-500 uppercase">· Member</span>
						</div>
					</div>
				</button>
			</div>
		{/each}
	</div>
</div>

<!-- Lightbox modal -->
{#if lightboxIndex !== null}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
		onclick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
		onkeydown={(e) => { if (e.key === 'Escape') closeLightbox(); }}
	>
		<!-- Close button -->
		<button
			type="button"
			aria-label="Close lightbox"
			onclick={closeLightbox}
			class="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-400 backdrop-blur-md transition hover:border-orange-500/50 hover:text-orange-400"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
			</svg>
		</button>

		<!-- Nav left -->
		<button
			type="button"
			aria-label="Previous testimonial"
			onclick={() => navigate(-1)}
			class="absolute left-3 top-1/2 z-50 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-slate-400 backdrop-blur-md transition hover:border-orange-500/50 hover:text-orange-400 md:left-6"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
			</svg>
		</button>

		<!-- Image -->
		<div class="mx-14 max-h-[90vh] max-w-[90vw] md:mx-20">
			<img
				src={imageTestimonials[lightboxIndex].image}
				alt="Testimonial dari {imageTestimonials[lightboxIndex].name}"
				class="max-h-[85vh] w-auto rounded-xl border border-white/10 object-contain shadow-2xl shadow-black/50"
			/>
			<div class="mt-3 flex items-center gap-2">
				<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-xs font-black text-orange-400">
					{imageTestimonials[lightboxIndex].name.charAt(0)}
				</div>
				<span class="text-sm font-bold text-slate-200">{imageTestimonials[lightboxIndex].name}</span>
				<span class="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">· Member</span>
			</div>
		</div>

		<!-- Nav right -->
		<button
			type="button"
			aria-label="Next testimonial"
			onclick={() => navigate(1)}
			class="absolute right-3 top-1/2 z-50 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-slate-400 backdrop-blur-md transition hover:border-orange-500/50 hover:text-orange-400 md:right-6"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
			</svg>
		</button>
	</div>
{/if}
