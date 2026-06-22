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
	let mobileCtaElement = $state<HTMLAnchorElement | null>(null);
	let mobileNumberElement = $state<HTMLDivElement | null>(null);

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
				mobileCtaElement,
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
					const headlineLines = Array.from(
						rootElement?.querySelectorAll<HTMLElement>('[data-offer-headline-line]') ?? []
					);
					const labelElements = [desktopPromoLabelElement, desktopSeatLabelElement].filter(
						(element): element is HTMLElement => Boolean(element)
					);
					const ctaElements = [mobileCtaElement, desktopCtaElement].filter(
						(element): element is HTMLAnchorElement => Boolean(element)
					);

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
					gsap.set([descriptionElement, ...ctaElements], {
						opacity: 0,
						y: 20
					});
					gsap.set(badgeElement, { opacity: 0, y: -12 });
					gsap.set(headlineLines, { opacity: 0, yPercent: 110 });
					gsap.set(desktopOfferElement, { opacity: 0, x: 24 });
					gsap.set(desktopNumberElement, { opacity: 0, x: 80, scale: 1.08 });
					gsap.set(labelElements, { opacity: 0, y: 12 });
					gsap.set(mobileNumberElement, { opacity: 0, scale: 1.06 });
					gsap.set(glowElement, { opacity: 0.45 });

					timeline
						.to(surfaceElement, { opacity: 1, scale: 1, duration: 0.72 })
						.to(badgeElement, { opacity: 1, y: 0, duration: 0.46 }, '-=0.18')
						.to(headlineLines, { opacity: 1, yPercent: 0, duration: 0.68, stagger: 0.1 }, '-=0.16')
						.to(descriptionElement, { opacity: 1, y: 0, duration: 0.52 }, '-=0.18')
						.to(mobileNumberElement, { opacity: 0.1, scale: 1, duration: 0.62 }, '-=0.42')
						.to(
							desktopOfferElement,
							{ opacity: 1, x: 0, duration: 0.62 },
							desktopQuery.matches ? '-=0.46' : '<'
						)
						.to(desktopNumberElement, { opacity: 1, x: 0, scale: 1, duration: 0.74 }, '-=0.48')
						.to(labelElements, { opacity: 1, y: 0, duration: 0.36, stagger: 0.08 }, '-=0.28')
						.to(ctaElements, { opacity: 1, y: 0, duration: 0.48, stagger: 0.08 }, '-=0.16');

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

					gsap.to(desktopNumberElement, {
						y: -36,
						ease: 'none',
						scrollTrigger: {
							trigger: rootElement,
							start: 'top bottom',
							end: 'bottom top',
							scrub: 0.85
						}
					});

					gsap.to(mobileNumberElement, {
						y: -18,
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
	<svg
		class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
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
			class="relative z-10 mx-auto grid max-w-7xl gap-9 px-4 sm:px-6 lg:min-h-[560px] lg:grid-cols-[minmax(0,1fr)_minmax(19rem,27rem)] lg:items-center lg:gap-12 lg:px-8 xl:min-h-[600px]"
		>
			<div class="max-w-3xl min-w-0">
				<div
					bind:this={badgeElement}
					class="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-3.5 py-2 text-[11px] font-black tracking-[0.15em] text-orange-100 uppercase shadow-lg shadow-orange-950/25"
				>
					<span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-orange-300"></span>
					{eyebrow}
				</div>

				<h2
					bind:this={headlineElement}
					class="mt-5 max-w-4xl text-[clamp(2.35rem,8vw,3.65rem)] leading-[0.98] font-black tracking-normal text-white sm:text-[clamp(2.75rem,6vw,4rem)] lg:text-[clamp(2.8rem,4.8vw,4rem)]"
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
						class="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-orange-700 shadow-xl shadow-orange-950/25 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-50 hover:shadow-[0_18px_42px_rgba(124,45,18,0.28)] focus-visible:ring-3 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 sm:w-auto lg:hidden"
					>
						{@render ctaContent()}
					</a>
				{:else}
					<a
						bind:this={mobileCtaElement}
						href={resolve(ctaHref as '/')}
						class="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-orange-700 shadow-xl shadow-orange-950/25 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-50 hover:shadow-[0_18px_42px_rgba(124,45,18,0.28)] focus-visible:ring-3 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 sm:w-auto lg:hidden"
					>
						{@render ctaContent()}
					</a>
				{/if}
			</div>

			<div
				bind:this={desktopOfferElement}
				class="relative hidden min-h-[390px] min-w-0 flex-col justify-center rounded-[2rem] border border-white/20 bg-slate-950/20 p-7 shadow-[0_30px_80px_rgba(124,45,18,0.22)] backdrop-blur-[3px] lg:flex xl:p-8"
			>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.16),transparent_34%)]"
				></div>
				<p
					bind:this={desktopPromoLabelElement}
					class="relative text-xs font-black tracking-[0.2em] text-orange-100 uppercase"
				>
					Promo Slot
				</p>
				<div class="relative mt-4 flex items-end gap-4">
					<span
						bind:this={desktopNumberElement}
						class="text-[clamp(8.5rem,13vw,11.5rem)] leading-[0.72] font-black text-white drop-shadow-[0_24px_56px_rgba(124,45,18,0.24)]"
					>
						{slot.number}
					</span>
					<span
						bind:this={desktopSeatLabelElement}
						class="mb-2 max-w-32 text-left text-sm leading-5 font-black tracking-[0.1em] text-orange-50 uppercase"
					>
						{slot.label}
					</span>
				</div>

				{#if ctaExternal}
					<a
						bind:this={desktopCtaElement}
						href={ctaHref}
						target="_blank"
						rel="external noopener noreferrer"
						class="group relative mt-9 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-black text-orange-700 shadow-xl shadow-orange-950/25 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-50 hover:shadow-[0_18px_42px_rgba(124,45,18,0.28)] focus-visible:ring-3 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
					>
						{@render ctaContent()}
					</a>
				{:else}
					<a
						bind:this={desktopCtaElement}
						href={resolve(ctaHref as '/')}
						class="group relative mt-9 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-black text-orange-700 shadow-xl shadow-orange-950/25 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-50 hover:shadow-[0_18px_42px_rgba(124,45,18,0.28)] focus-visible:ring-3 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
					>
						{@render ctaContent()}
					</a>
				{/if}
			</div>
		</div>
	</div>
</section>
