<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { LandingContent } from '$lib/landingContent';

	type UrgencyContent = LandingContent['urgency'];
	type GsapApi = typeof import('gsap').gsap;
	type ScrollTriggerApi = typeof import('gsap/ScrollTrigger').ScrollTrigger;
	type LenisCtor = typeof import('lenis').default;
	type LenisInstance = InstanceType<LenisCtor>;

	let { urgency, ctaHref }: { urgency: UrgencyContent; ctaHref: string } = $props();

	const titleLines = $derived(splitOfferTitle(urgency.title));
	const eyebrow = $derived(normalizeEyebrow(urgency.eyebrow));
	const slot = $derived(extractSlotCopy(urgency.title));
	const ctaExternal = $derived(isExternalHref(ctaHref));
	const urgencyNote = 'Harga kembali normal setelah kuota promo terpenuhi.';

	let rootElement = $state<HTMLElement | null>(null);
	let surfaceElement = $state<HTMLDivElement | null>(null);
	let patternElement = $state<HTMLDivElement | null>(null);
	let glowElement = $state<HTMLDivElement | null>(null);
	let badgeElement = $state<HTMLDivElement | null>(null);
	let headlineElement = $state<HTMLHeadingElement | null>(null);
	let descriptionElement = $state<HTMLParagraphElement | null>(null);
	let desktopOfferElement = $state<HTMLDivElement | null>(null);
	let desktopPromoLabelElement = $state<HTMLParagraphElement | null>(null);
	let desktopNumberElement = $state<HTMLSpanElement | null>(null);
	let desktopSeatLabelElement = $state<HTMLSpanElement | null>(null);
	let desktopCtaElement = $state<HTMLAnchorElement | null>(null);
	let desktopUrgencyElement = $state<HTMLParagraphElement | null>(null);
	let mobileCtaElement = $state<HTMLAnchorElement | null>(null);
	let mobileUrgencyElement = $state<HTMLParagraphElement | null>(null);
	let mobileNumberElement = $state<HTMLDivElement | null>(null);
	let displayedSlotNumber = $derived(slot.number);

	function splitOfferTitle(value: string) {
		const trimmed = value.trim();
		const slotMatch = trimmed.match(/^(.*?)(\b\d+\s+(?:Peserta|Pendaftar)\s+Pertama\b.*)$/i);
		if (slotMatch?.[1]?.trim() && slotMatch[2]?.trim()) {
			return [slotMatch[1].trim(), slotMatch[2].trim()];
		}

		const words = trimmed.split(/\s+/).filter(Boolean);
		if (words.length <= 4) return [trimmed || 'Harga Spesial Khusus', '10 Peserta Pertama'];

		const midpoint = Math.ceil(words.length / 2);
		return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')];
	}

	function normalizeEyebrow(value: string) {
		const trimmed = value.trim();
		const normalized = trimmed.toUpperCase();
		if (!normalized || normalized === 'URGENCY / SCARCITY' || normalized === 'LIMITED SLOT') {
			return 'KUOTA TERBATAS';
		}

		return trimmed;
	}

	function extractSlotCopy(value: string) {
		const match = value.match(/\b(\d+)\s+((?:Peserta|Pendaftar)\s+Pertama)\b/i);
		return {
			number: match?.[1] ?? '10',
			label: (match?.[2] ?? 'Peserta Pertama').toUpperCase()
		};
	}

	function isExternalHref(value: string) {
		return /^https?:\/\//i.test(value);
	}

	onMount(() => {
		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const desktopQuery = window.matchMedia('(min-width: 1024px)');
		let disposed = false;
		let initialized = false;
		let gsapApi: GsapApi | null = null;
		let scrollTriggerApi: ScrollTriggerApi | null = null;
		let lenis: LenisInstance | null = null;
		let unsubscribeLenisScroll: (() => void) | null = null;
		let tickerCallback: ((time: number) => void) | null = null;
		let context: gsap.Context | null = null;
		let setupPromise: Promise<void> | null = null;

		const clearInlineAnimationStyles = () => {
			const elements = [
				surfaceElement,
				patternElement,
				glowElement,
				badgeElement,
				headlineElement,
				descriptionElement,
				desktopOfferElement,
				desktopPromoLabelElement,
				desktopNumberElement,
				desktopSeatLabelElement,
				desktopCtaElement,
				desktopUrgencyElement,
				mobileCtaElement,
				mobileUrgencyElement,
				mobileNumberElement
			].filter((element): element is HTMLElement => Boolean(element));

			for (const element of elements) {
				element.removeAttribute('style');
			}

			for (const line of rootElement?.querySelectorAll<HTMLElement>('[data-offer-headline-line]') ??
				[]) {
				line.removeAttribute('style');
			}
		};

		const destroyAnimationRuntime = () => {
			context?.revert();
			context = null;

			if (gsapApi && tickerCallback) {
				gsapApi.ticker.remove(tickerCallback);
				tickerCallback = null;
			}

			unsubscribeLenisScroll?.();
			unsubscribeLenisScroll = null;
			lenis?.destroy();
			lenis = null;
			initialized = false;
		};

		const showStaticState = () => {
			destroyAnimationRuntime();
			clearInlineAnimationStyles();
			displayedSlotNumber = slot.number;
		};

		const setupAnimations = () => {
			if (initialized || reducedMotionQuery.matches || !rootElement || !surfaceElement) {
				if (reducedMotionQuery.matches) showStaticState();
				return Promise.resolve();
			}

			if (setupPromise) return setupPromise;

			setupPromise = (async () => {
				const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
					import('gsap'),
					import('gsap/ScrollTrigger'),
					import('lenis')
				]);

				if (disposed || reducedMotionQuery.matches || !rootElement || !surfaceElement) {
					return;
				}

				gsapApi = gsap;
				scrollTriggerApi = ScrollTrigger;
				gsap.registerPlugin(ScrollTrigger);

				lenis = new Lenis({
					autoRaf: false,
					lerp: 0.09,
					smoothWheel: true,
					syncTouch: false
				});
				unsubscribeLenisScroll = lenis.on('scroll', ScrollTrigger.update);
				tickerCallback = (time: number) => lenis?.raf(time * 1000);
				gsap.ticker.add(tickerCallback);

				context = gsap.context(() => {
					const isDesktop = desktopQuery.matches;
					const headlineLines = Array.from(
						rootElement?.querySelectorAll<HTMLElement>('[data-offer-headline-line]') ?? []
					);
					const labelElements = [desktopPromoLabelElement, desktopSeatLabelElement].filter(
						(element): element is HTMLElement => Boolean(element)
					);
					const activeCtaElement = isDesktop ? desktopCtaElement : mobileCtaElement;
					const activeUrgencyElement = isDesktop ? desktopUrgencyElement : mobileUrgencyElement;
					const countElement = isDesktop ? desktopNumberElement : null;
					const targetCount = Number.parseInt(slot.number, 10);
					const canCount = Boolean(countElement && Number.isFinite(targetCount));
					const countState = { value: 0 };

					const timeline = gsap.timeline({
						defaults: { ease: 'power3.out' },
						scrollTrigger: {
							trigger: rootElement,
							start: 'top 76%',
							once: true
						}
					});

					gsap.set(surfaceElement, {
						opacity: 0,
						scale: 0.98,
						transformOrigin: 'center center'
					});
					gsap.set([descriptionElement, activeCtaElement], {
						opacity: 0,
						y: 20
					});
					gsap.set(activeUrgencyElement, { opacity: 0, y: 10 });
					gsap.set(badgeElement, { opacity: 0, y: -12 });
					gsap.set(headlineLines, { opacity: 0, yPercent: 110 });
					gsap.set(glowElement, { opacity: 0.45 });

					if (isDesktop) {
						gsap.set(desktopOfferElement, { opacity: 0, y: 28, scale: 0.97 });
						gsap.set(desktopNumberElement, { opacity: 0, x: 54, scale: 1.06 });
						gsap.set(labelElements, { opacity: 0, y: 12 });
						if (canCount) displayedSlotNumber = '0';
					} else {
						gsap.set(mobileNumberElement, { opacity: 0, scale: 1.04 });
					}

					timeline
						.to(surfaceElement, { opacity: 1, scale: 1, duration: 0.72 })
						.to(badgeElement, { opacity: 1, y: 0, duration: 0.46 }, '-=0.18')
						.to(headlineLines, { opacity: 1, yPercent: 0, duration: 0.68, stagger: 0.1 }, '-=0.16')
						.to(descriptionElement, { opacity: 1, y: 0, duration: 0.52 }, '-=0.18');

					if (isDesktop) {
						timeline
							.to(desktopOfferElement, { opacity: 1, y: 0, scale: 1, duration: 0.68 }, '-=0.38')
							.to(desktopNumberElement, { opacity: 1, x: 0, scale: 1, duration: 0.72 }, '-=0.42');

						if (canCount && countElement) {
							timeline.to(
								countState,
								{
									value: targetCount,
									duration: 0.82,
									ease: 'power2.out',
									onUpdate: () => {
										displayedSlotNumber = String(Math.round(countState.value));
									}
								},
								'<'
							);
						}

						timeline
							.to(labelElements, { opacity: 1, y: 0, duration: 0.36, stagger: 0.08 }, '-=0.3')
							.to(activeCtaElement, { opacity: 1, y: 0, duration: 0.5 }, '-=0.12')
							.to(activeUrgencyElement, { opacity: 1, y: 0, duration: 0.4 }, '-=0.22');
					} else {
						timeline
							.to(mobileNumberElement, { opacity: 0.08, scale: 1, duration: 0.54 }, '-=0.34')
							.to(activeCtaElement, { opacity: 1, y: 0, duration: 0.46 }, '-=0.28')
							.to(activeUrgencyElement, { opacity: 1, y: 0, duration: 0.36 }, '-=0.2');
					}

					gsap.to(patternElement, {
						x: () => (desktopQuery.matches ? 36 : 12),
						y: () => (desktopQuery.matches ? -32 : -12),
						ease: 'none',
						scrollTrigger: {
							trigger: rootElement,
							start: 'top bottom',
							end: 'bottom top',
							scrub: 0.7,
							invalidateOnRefresh: true
						}
					});

					gsap.to(isDesktop ? desktopNumberElement : mobileNumberElement, {
						y: isDesktop ? -28 : -14,
						ease: 'none',
						scrollTrigger: {
							trigger: rootElement,
							start: 'top bottom',
							end: 'bottom top',
							scrub: 0.85
						}
					});
				}, rootElement);

				ScrollTrigger.refresh();
				initialized = true;
			})().finally(() => {
				setupPromise = null;
			});

			return setupPromise;
		};

		const handleMotionPreferenceChange = () => {
			if (reducedMotionQuery.matches) {
				showStaticState();
				return;
			}

			void setupAnimations();
			scrollTriggerApi?.refresh();
		};

		const handleDesktopChange = () => {
			scrollTriggerApi?.refresh();
		};

		void setupAnimations();
		reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange);
		desktopQuery.addEventListener('change', handleDesktopChange);

		return () => {
			disposed = true;
			reducedMotionQuery.removeEventListener('change', handleMotionPreferenceChange);
			desktopQuery.removeEventListener('change', handleDesktopChange);
			destroyAnimationRuntime();
		};
	});
</script>

{#snippet ctaContent()}
	{urgency.ctaLabel}
	<span
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
	></span>
	<span
		class="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-white shadow-sm shadow-orange-950/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-orange-500 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
	>
		<svg
			class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2.5"
				d="M17 8l4 4m0 0l-4 4m4-4H3"
			/>
		</svg>
	</span>
{/snippet}

<section
	id="urgency"
	bind:this={rootElement}
	class="relative isolate scroll-mt-20 overflow-hidden bg-slate-950 text-white"
>
	<div
		bind:this={surfaceElement}
		class="relative min-h-0 overflow-hidden bg-[linear-gradient(120deg,#c2410c_0%,#ea580c_42%,#fb923c_100%)] py-14 sm:py-16 lg:min-h-[560px] lg:py-0 xl:min-h-[600px]"
	>
		<div
			bind:this={patternElement}
			aria-hidden="true"
			class="pointer-events-none absolute -inset-[8%] bg-[radial-gradient(circle_at_20%_22%,rgba(255,255,255,0.28),transparent_27%),linear-gradient(30deg,rgba(255,255,255,0.13)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,0.13)_87.5%,rgba(255,255,255,0.13)),linear-gradient(150deg,rgba(255,255,255,0.12)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,0.12)_87.5%,rgba(255,255,255,0.12))] [background-size:auto,60px_60px,60px_60px] [background-position:0_0,0_0,30px_30px] opacity-35"
		></div>
		<div
			bind:this={glowElement}
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_42%,rgba(255,255,255,0.28),transparent_32%),radial-gradient(circle_at_16%_78%,rgba(15,23,42,0.18),transparent_34%)]"
		></div>
		<div
			bind:this={mobileNumberElement}
			aria-hidden="true"
			class="pointer-events-none absolute -right-8 -bottom-8 text-[13rem] leading-none font-black text-white opacity-10 sm:-right-2 sm:text-[16rem] lg:hidden"
		>
			{slot.number}
		</div>

		<div
			class="relative z-10 mx-auto grid max-w-7xl gap-9 px-4 sm:px-6 lg:min-h-[560px] lg:grid-cols-[minmax(0,1fr)_minmax(21rem,28rem)] lg:items-center lg:gap-14 lg:px-8 xl:min-h-[600px]"
		>
			<div class="max-w-[46rem] min-w-0">
				<div
					bind:this={badgeElement}
					class="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-3.5 py-2 text-[11px] font-black tracking-[0.15em] text-orange-100 uppercase shadow-lg shadow-orange-950/25"
				>
					<span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-orange-300"></span>
					{eyebrow}
				</div>

				<h2
					bind:this={headlineElement}
					class="mt-5 max-w-3xl text-[clamp(2.25rem,8vw,3.4rem)] leading-[1.01] font-black tracking-[-0.025em] text-white sm:text-[clamp(2.6rem,5.6vw,3.65rem)] lg:text-[clamp(2.65rem,4vw,3.65rem)]"
				>
					{#each titleLines as line, index (`${line}-${index}`)}
						<span class="block overflow-hidden pb-1">
							<span
								data-offer-headline-line
								class="block drop-shadow-[0_8px_22px_rgba(124,45,18,0.18)] {line.includes(
									slot.number
								)
									? 'text-orange-50'
									: 'text-white'}"
							>
								{line}
							</span>
						</span>
					{/each}
				</h2>

				<p
					bind:this={descriptionElement}
					class="mt-5 max-w-2xl text-base leading-8 font-semibold text-orange-50/95 sm:text-lg"
				>
					{urgency.description}
				</p>

				{#if ctaExternal}
					<a
						bind:this={mobileCtaElement}
						href={ctaHref}
						target="_blank"
						rel="external noopener noreferrer"
						class="group relative mt-8 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#ffffff_0%,#fff7ed_100%)] px-5 py-3.5 text-[15px] font-black text-slate-950 shadow-[0_14px_34px_rgba(124,45,18,0.3)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_22px_48px_rgba(124,45,18,0.38)] focus-visible:ring-3 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:active:scale-100 sm:w-auto lg:hidden"
					>
						{@render ctaContent()}
					</a>
				{:else}
					<a
						bind:this={mobileCtaElement}
						href={resolve(ctaHref as '/')}
						class="group relative mt-8 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#ffffff_0%,#fff7ed_100%)] px-5 py-3.5 text-[15px] font-black text-slate-950 shadow-[0_14px_34px_rgba(124,45,18,0.3)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_22px_48px_rgba(124,45,18,0.38)] focus-visible:ring-3 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:active:scale-100 sm:w-auto lg:hidden"
					>
						{@render ctaContent()}
					</a>
				{/if}
				<p
					bind:this={mobileUrgencyElement}
					class="mt-4 flex items-start gap-2 text-xs leading-5 font-semibold text-orange-50/90 lg:hidden"
				>
					<svg
						class="mt-0.5 h-4 w-4 shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{urgencyNote}
				</p>
			</div>

			<div
				bind:this={desktopOfferElement}
				class="relative hidden min-h-[420px] min-w-0 overflow-hidden rounded-[2rem] border border-white/25 bg-[linear-gradient(145deg,rgba(15,23,42,0.78)_0%,rgba(15,23,42,0.62)_58%,rgba(67,20,7,0.48)_100%)] p-7 shadow-[0_32px_90px_rgba(124,45,18,0.28),inset_0_1px_0_rgba(255,255,255,0.24)] backdrop-blur-xl lg:flex lg:flex-col lg:justify-center xl:p-8"
			>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.2),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%)]"
				></div>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
				></div>
				<div class="relative z-10 flex items-center justify-between gap-4">
					<p
						bind:this={desktopPromoLabelElement}
						class="flex items-center gap-2 text-xs font-black tracking-[0.2em] text-orange-100 uppercase"
					>
						<span
							aria-hidden="true"
							class="h-1.5 w-1.5 rotate-45 bg-orange-300 shadow-[0_0_12px_rgba(253,186,116,0.8)]"
						></span>
						Promo Slot
					</p>
					<span
						class="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[9px] font-black tracking-[0.16em] text-white/75 uppercase"
						>Terbatas</span
					>
				</div>
				<div class="relative z-10 mt-5 flex items-end gap-4">
					<span class="sr-only">{slot.number} {slot.label}</span>
					<div
						aria-hidden="true"
						class="pointer-events-none absolute -top-7 -left-6 h-44 w-44 rounded-full bg-orange-300/24 blur-3xl"
					></div>
					<span
						bind:this={desktopNumberElement}
						aria-hidden="true"
						class="relative text-[clamp(8.25rem,12vw,10.75rem)] leading-[0.72] font-black tracking-[-0.08em] text-white drop-shadow-[0_24px_56px_rgba(124,45,18,0.3)]"
					>
						{displayedSlotNumber}
					</span>
					<span
						bind:this={desktopSeatLabelElement}
						aria-hidden="true"
						class="relative mb-2 max-w-32 text-left text-sm leading-5 font-black tracking-[0.1em] text-orange-50 uppercase"
					>
						{slot.label}
					</span>
				</div>
				<div
					aria-hidden="true"
					class="relative z-10 mt-7 h-px bg-gradient-to-r from-white/20 via-white/8 to-transparent"
				></div>

				{#if ctaExternal}
					<a
						bind:this={desktopCtaElement}
						href={ctaHref}
						target="_blank"
						rel="external noopener noreferrer"
						class="group relative z-10 mt-6 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#ffffff_0%,#fff7ed_100%)] px-6 py-3.5 text-[15px] font-black text-slate-950 shadow-[0_16px_40px_rgba(0,0,0,0.25),0_10px_30px_rgba(234,88,12,0.24)] ring-1 ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.015] hover:shadow-[0_22px_52px_rgba(0,0,0,0.3),0_12px_36px_rgba(251,146,60,0.38)] focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none active:scale-[0.985] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
					>
						{@render ctaContent()}
					</a>
				{:else}
					<a
						bind:this={desktopCtaElement}
						href={resolve(ctaHref as '/')}
						class="group relative z-10 mt-6 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#ffffff_0%,#fff7ed_100%)] px-6 py-3.5 text-[15px] font-black text-slate-950 shadow-[0_16px_40px_rgba(0,0,0,0.25),0_10px_30px_rgba(234,88,12,0.24)] ring-1 ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.015] hover:shadow-[0_22px_52px_rgba(0,0,0,0.3),0_12px_36px_rgba(251,146,60,0.38)] focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none active:scale-[0.985] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
					>
						{@render ctaContent()}
					</a>
				{/if}
				<p
					bind:this={desktopUrgencyElement}
					class="relative z-10 mt-4 flex items-start justify-center gap-2 text-center text-[11px] leading-5 font-semibold text-white/65"
				>
					<svg
						class="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-200"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{urgencyNote}
				</p>
			</div>
		</div>
	</div>
</section>
