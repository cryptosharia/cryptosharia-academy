<script lang="ts">
	import { onMount } from 'svelte';
	import {
		defaultLandingContent,
		subscribeLandingContent,
		buildWhatsappUrl,
		resolveVideoEmbed,
		type LandingContent
	} from '$lib/landingContent';
	import CoinTicker from '$lib/components/CoinTicker.svelte';
	import TestimonialCarousel from '$lib/components/TestimonialCarousel.svelte';
	import SpecialOfferSection from '$lib/components/landing/SpecialOfferSection.svelte';

	type PricingPackage = LandingContent['pricing']['packages'][number];
	type AuthorityActivity = LandingContent['authority']['activities'][number];
	type AuthorityStat = LandingContent['authority']['stats'][number];

	let content = $state<LandingContent>(structuredClone(defaultLandingContent));
	const INITIAL_FAQ_INDEXES = [0, 1, 3, 4, 5, 7, 10];

	const whatsappUrl = $derived(buildWhatsappUrl(content.whatsapp));
	const heroVideo = $derived(resolveVideoEmbed(content.hero.videoUrl));
	const heroHeadlineWords = $derived(splitHeroHeadline(content.hero.badge));
	const quoteParts = $derived(splitQuoteAttribution(content.usp.quote));
	const uspTitleParts = $derived(splitUspTitle(content.usp.title));

	// Only render sections that are marked visible, in the admin-defined order.
	const sections = $derived(content.layout.filter((s) => s.visible).map((s) => s.id));

	let openFaqIndex = $state<number | null>(0);
	let showAllFaqs = $state(false);

	const visibleFaqItems = $derived(
		showAllFaqs ? mapFaqItems(content.faq.items) : buildInitialFaqItems(content.faq.items)
	);
	const pricingPackages = $derived(content.pricing.packages ?? []);
	const pricingProgramItems = $derived(content.pricing.programIncludes ?? []);
	const pricingBundleBonuses = $derived(content.pricing.bundleBonuses ?? []);
	let selectedPricingPackageIndex = $state(0);
	let bundleScrollContainer = $state<HTMLDivElement | null>(null);
	let bundleProgress = $state(0);
	let bundleAnimationsReady = $state(false);
	let bundleDesktop = $state(false);
	let bundleReducedMotion = $state(false);
	let uspSection = $state<HTMLElement | null>(null);
	let uspProgress = $state(0);
	let uspAnimationsReady = $state(false);
	let experienceSection = $state<HTMLElement | null>(null);
	const selectedPricingPackage = $derived(
		pricingPackages[selectedPricingPackageIndex] ?? pricingPackages[0]
	);

	function splitHeroHeadline(value: string) {
		const words = value.trim().split(/\s+/).filter(Boolean);
		return words.map((text, index) => ({
			key: `${text}-${index}`,
			text: `${text}${index < words.length - 1 ? ' ' : ''}`,
			highlight: text.toLowerCase().includes('sharia')
		}));
	}

	function splitQuoteAttribution(value: string) {
		const trimmed = value.trim();
		const text = trimmed.replace(/\s*[-\u2013\u2014]\s*Warren Buffett\s*$/, '').trim();
		return {
			text: text || trimmed,
			attribution: text && text !== trimmed ? 'Warren Buffett' : ''
		};
	}

	function splitUspTitle(value: string) {
		const highlightPhrase = 'Crypto Sharia Masterclass';
		const highlightIndex = value.toLowerCase().indexOf(highlightPhrase.toLowerCase());
		if (highlightIndex < 0) return { prefix: value, highlight: '' };

		return {
			prefix: value.slice(0, highlightIndex).trim(),
			highlight: value.slice(highlightIndex).trim()
		};
	}

	function mapFaqItems(items: LandingContent['faq']['items']) {
		return items.map((item, index) => ({ item, index }));
	}

	function buildInitialFaqItems(items: LandingContent['faq']['items']) {
		const selected = INITIAL_FAQ_INDEXES.filter((index) => index < items.length).map((index) => ({
			item: items[index],
			index
		}));
		const usedIndexes = selected.map((entry) => entry.index);
		const minimumCount = Math.min(items.length, 6);

		if (selected.length < minimumCount) {
			for (const entry of mapFaqItems(items)) {
				if (usedIndexes.includes(entry.index)) continue;
				selected.push(entry);
				usedIndexes.push(entry.index);
				if (selected.length >= minimumCount) break;
			}
		}

		return selected.sort((a, b) => a.index - b.index);
	}

	function toggleFaq(index: number) {
		openFaqIndex = openFaqIndex === index ? null : index;
	}

	function selectPricingPackage(index: number) {
		selectedPricingPackageIndex = index;
	}

	function packageWhatsappUrl(pkg: PricingPackage) {
		return buildWhatsappUrl({
			phone: content.whatsapp.phone,
			message:
				pkg.ctaMessage?.trim() ||
				`Assalamu'alaikum admin, saya tertarik ikut ${pkg.code} ${pkg.title} Crypto Sharia Masterclass.`
		});
	}

	function bundleVisible(threshold: number) {
		return !bundleAnimationsReady || bundleReducedMotion || bundleProgress >= threshold;
	}

	function bundleDelay(milliseconds: number) {
		return `${bundleDesktop || bundleReducedMotion ? 0 : milliseconds}ms`;
	}

	function uspVisible(threshold: number) {
		return !uspAnimationsReady || bundleReducedMotion || uspProgress >= threshold;
	}

	function updateUspSpotlight(event: MouseEvent) {
		const card = event.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		card.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
		card.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
	}

	function resetUspSpotlight(event: MouseEvent) {
		const card = event.currentTarget as HTMLElement;
		card.style.removeProperty('--spotlight-x');
		card.style.removeProperty('--spotlight-y');
	}

	function packageTone(pkg: PricingPackage) {
		const packageCode = pkg.code.trim().toUpperCase();

		if (packageCode.endsWith('B')) {
			return {
				bar: 'bg-gradient-to-r from-sky-400 to-cyan-400',
				card: 'border-sky-300 shadow-sky-950/5 hover:border-sky-400 hover:shadow-sky-950/15 dark:border-sky-800/70 dark:hover:border-sky-500',
				featured: 'ring-2 ring-sky-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-950',
				badge: 'bg-sky-400 text-sky-950',
				text: 'text-sky-700 dark:text-sky-300',
				panel: 'border-sky-100 bg-sky-50/70 dark:border-sky-900/60 dark:bg-sky-950/25',
				dot: 'bg-sky-500',
				button: 'bg-sky-600 text-white hover:bg-sky-500'
			};
		}

		if (packageCode.endsWith('C')) {
			return {
				bar: 'bg-gradient-to-r from-violet-500 to-fuchsia-400',
				card: 'border-violet-300 shadow-violet-950/5 hover:border-violet-400 hover:shadow-violet-950/15 dark:border-violet-800/70 dark:hover:border-violet-500',
				featured:
					'ring-2 ring-violet-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-950',
				badge: 'bg-violet-500 text-white',
				text: 'text-violet-700 dark:text-violet-300',
				panel: 'border-violet-100 bg-violet-50/70 dark:border-violet-900/60 dark:bg-violet-950/25',
				dot: 'bg-violet-500',
				button: 'bg-violet-600 text-white hover:bg-violet-500'
			};
		}

		if (packageCode.endsWith('D')) {
			return {
				bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
				card: 'border-emerald-400 shadow-emerald-950/10 hover:border-emerald-300 hover:shadow-emerald-950/20 dark:border-emerald-700 dark:hover:border-emerald-400',
				featured:
					'ring-2 ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-950',
				badge: 'bg-emerald-400 text-emerald-950',
				text: 'text-emerald-700 dark:text-emerald-300',
				panel:
					'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/25',
				dot: 'bg-emerald-500',
				button:
					'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-950/20 hover:bg-emerald-400'
			};
		}

		return {
			bar: 'bg-gradient-to-r from-orange-500 to-amber-400',
			card: 'border-orange-300 shadow-orange-950/5 hover:border-orange-400 hover:shadow-orange-950/15 dark:border-orange-800/70 dark:hover:border-orange-500',
			featured: 'ring-2 ring-orange-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-950',
			badge: 'bg-orange-400 text-slate-950',
			text: 'text-orange-700 dark:text-orange-300',
			panel: 'border-orange-100 bg-orange-50/70 dark:border-orange-900/60 dark:bg-orange-950/25',
			dot: 'bg-orange-500',
			button: 'bg-orange-600 text-white hover:bg-orange-500'
		};
	}

	function faqCategory(index: number) {
		if (index <= 2) return 'Tentang Program';
		if (index <= 6) return 'Teknis Kelas';
		if (index <= 9) return 'Materi & Syariah';
		return 'Pembayaran';
	}

	function activityBadge(item: LandingContent['authority']['activities'][number]) {
		const value = item.meta?.trim();
		if (value) return value;
		if (/qna|diskusi|gathering|kelas/i.test(item.title)) return 'Kelas / Diskusi';
		return 'Dokumentasi Event';
	}

	function formatIndonesianNumber(value: number) {
		return new Intl.NumberFormat('id-ID').format(value);
	}

	function authorityStatValue(stat: AuthorityStat) {
		return `${formatIndonesianNumber(stat.value)}${stat.suffix}`;
	}

	function activityParticipantLabel(item: AuthorityActivity) {
		if (item.participantLabel?.trim()) return item.participantLabel;
		if (Number.isFinite(item.participants)) {
			return `${formatIndonesianNumber(item.participants ?? 0)} peserta`;
		}
		return '';
	}

	function benefitIconKey(title: string) {
		const value = title.toLowerCase();
		if (value.includes('materi')) return 'layers';
		if (value.includes('sharia')) return 'shield';
		if (value.includes('tugas')) return 'task';
		if (value.includes('fgd') || value.includes('mentoring')) return 'users';
		if (value.includes('komunitas')) return 'globe';
		if (value.includes('sertifikat')) return 'certificate';
		return 'list';
	}

	onMount(() => {
		const unsubscribe = subscribeLandingContent((c) => {
			content = c;
		});
		const desktopQuery = window.matchMedia('(min-width: 1024px)');
		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

		function updateBundleAnimation() {
			if (bundleReducedMotion) {
				bundleProgress = 1;
				return;
			}

			const element = bundleScrollContainer;
			if (!element) return;
			const rect = element.getBoundingClientRect();
			const viewportHeight = window.innerHeight;

			if (!bundleDesktop) {
				if (rect.top <= viewportHeight * 0.85 && rect.bottom >= 0) bundleProgress = 1;
				return;
			}

			const revealStart = viewportHeight * 0.78;
			const revealDistance = Math.max(rect.height - viewportHeight * 0.25, 1);
			bundleProgress = Math.min(1, Math.max(0, (revealStart - rect.top) / revealDistance));
		}

		function updateUspAnimation() {
			if (bundleReducedMotion) {
				uspProgress = 1;
				return;
			}

			const element = uspSection;
			if (!element) return;
			const rect = element.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const revealStart = viewportHeight * 0.86;
			const revealDistance = Math.max(rect.height + viewportHeight * 0.15, 1);
			uspProgress = Math.min(1, Math.max(0, (revealStart - rect.top) / revealDistance));
		}

		function updatePageAnimations() {
			bundleDesktop = desktopQuery.matches;
			bundleReducedMotion = reducedMotionQuery.matches;
			updateBundleAnimation();
			updateUspAnimation();
		}

		const beginAnimation = window.requestAnimationFrame(() => {
			bundleAnimationsReady = true;
			uspAnimationsReady = true;
			updatePageAnimations();
		});
		window.addEventListener('scroll', updatePageAnimations, { passive: true });
		window.addEventListener('resize', updatePageAnimations);
		desktopQuery.addEventListener('change', updatePageAnimations);
		reducedMotionQuery.addEventListener('change', updatePageAnimations);

		return () => {
			unsubscribe();
			window.cancelAnimationFrame(beginAnimation);
			window.removeEventListener('scroll', updatePageAnimations);
			window.removeEventListener('resize', updatePageAnimations);
			desktopQuery.removeEventListener('change', updatePageAnimations);
			reducedMotionQuery.removeEventListener('change', updatePageAnimations);
		};
	});

	onMount(() => {
		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const desktopQuery = window.matchMedia('(min-width: 1024px)');
		let disposed = false;
		let context: { revert: () => void } | null = null;
		let setupPromise: Promise<void> | null = null;

		function setExperienceCountersFinal() {
			const counters =
				experienceSection?.querySelectorAll<HTMLElement>('[data-experience-stat-value]') ?? [];

			for (const counter of counters) {
				const value = Number(counter.dataset.value);
				const suffix = counter.dataset.suffix ?? '';
				counter.textContent = `${formatIndonesianNumber(Number.isFinite(value) ? value : 0)}${suffix}`;
			}
		}

		function clearExperienceAnimations() {
			context?.revert();
			context = null;
			setExperienceCountersFinal();
		}

		async function setupExperienceAnimations() {
			if (context || setupPromise || reducedMotionQuery.matches || !experienceSection) {
				if (reducedMotionQuery.matches) setExperienceCountersFinal();
				return;
			}

			setupPromise = (async () => {
				const [{ gsap }, { ScrollTrigger }] = await Promise.all([
					import('gsap'),
					import('gsap/ScrollTrigger')
				]);

				const root = experienceSection;
				if (disposed || reducedMotionQuery.matches || !root) {
					setExperienceCountersFinal();
					return;
				}

				gsap.registerPlugin(ScrollTrigger);

				context = gsap.context(() => {
					const heading = root.querySelectorAll<HTMLElement>('.experience-heading');
					const lead = root.querySelectorAll<HTMLElement>('.experience-lead');
					const statCards = gsap.utils.toArray<HTMLElement>('.experience-stat-card');
					const counters = gsap.utils.toArray<HTMLElement>('[data-experience-stat-value]');
					const visibleEventCards = gsap.utils
						.toArray<HTMLElement>('.experience-event-card')
						.filter((card) => card.getClientRects().length > 0);

					const introTimeline = gsap.timeline({
						defaults: { ease: 'power3.out' },
						scrollTrigger: {
							trigger: root,
							start: 'top 72%',
							once: true
						}
					});

					introTimeline
						.from(heading, { opacity: 0, y: 32, duration: 0.72 })
						.from(lead, { opacity: 0, y: 22, duration: 0.58 }, '-=0.4')
						.from(statCards, { opacity: 0, y: 18, duration: 0.5, stagger: 0.1 }, '-=0.2');

					for (const counter of counters) {
						const target = Number(counter.dataset.value);
						const suffix = counter.dataset.suffix ?? '';
						const state = { value: 0 };
						counter.textContent = `0${suffix}`;

						introTimeline.to(
							state,
							{
								value: Number.isFinite(target) ? target : 0,
								duration: 0.9,
								ease: 'power2.out',
								onUpdate: () => {
									counter.textContent = `${formatIndonesianNumber(Math.round(state.value))}${suffix}`;
								}
							},
							'<'
						);
					}

					for (const card of visibleEventCards) {
						const side = card.dataset.experienceSide;
						const fromX = side === 'left' ? -32 : side === 'right' ? 32 : 0;
						const image = card.querySelector<HTMLElement>('.experience-event-image');
						const copyElements = card.querySelectorAll<HTMLElement>('.experience-event-copy > *');
						const participantBadge = card.querySelector<HTMLElement>(
							'.experience-participant-badge'
						);
						const eventTimeline = gsap.timeline({
							defaults: { ease: 'power3.out' },
							scrollTrigger: {
								trigger: card,
								start: 'top 82%',
								once: true
							}
						});

						eventTimeline.from(card, { opacity: 0, y: 28, x: fromX, duration: 0.65 });
						if (image) eventTimeline.from(image, { scale: 1.04, duration: 0.78 }, '<');
						if (copyElements.length) {
							eventTimeline.from(
								copyElements,
								{ opacity: 0, y: 14, duration: 0.42, stagger: 0.06 },
								'-=0.45'
							);
						}
						if (participantBadge) {
							eventTimeline.from(
								participantBadge,
								{ opacity: 0, scale: 0.92, duration: 0.28 },
								'-=0.25'
							);
						}
					}

					if (desktopQuery.matches) {
						for (const image of gsap.utils.toArray<HTMLElement>('.experience-event-image')) {
							if (image.getClientRects().length === 0) continue;
							gsap.to(image, {
								yPercent: -4,
								ease: 'none',
								scrollTrigger: {
									trigger: image,
									start: 'top bottom',
									end: 'bottom top',
									scrub: 0.7
								}
							});
						}
					}
				}, root);

				ScrollTrigger.refresh();
			})();

			await setupPromise;
			setupPromise = null;
		}

		function handleReducedMotionChange() {
			if (reducedMotionQuery.matches) clearExperienceAnimations();
			else void setupExperienceAnimations();
		}

		void setupExperienceAnimations();
		reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

		return () => {
			disposed = true;
			reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
			clearExperienceAnimations();
		};
	});
</script>

{#snippet pricingPackageCard(pkg: PricingPackage)}
	{@const curriculumDay = content.curriculum.schedule.find((day) => day.stage === pkg.title)}
	{@const tone = packageTone(pkg)}
	<article
		class="group flex h-full min-h-[680px] flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-950 dark:shadow-black/20 {tone.card} {pkg.badge
			? tone.featured
			: ''}"
	>
		<div class="h-1.5 w-full shrink-0 {tone.bar}"></div>
		<div class="relative aspect-[4/3] overflow-hidden bg-slate-950">
			{#if pkg.image}
				<img
					src={pkg.image}
					alt="Poster {pkg.code} {pkg.title}"
					class="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
					loading="lazy"
				/>
				<div
					class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent"
				></div>
			{:else}
				<div
					class="flex h-full items-center justify-center bg-slate-900 text-sm font-bold text-slate-500"
				>
					CryptoSharia
				</div>
			{/if}
			<div
				class="absolute top-4 left-4 rounded-full px-3 py-1.5 text-[11px] font-black tracking-[0.14em] uppercase shadow-lg shadow-black/20 {tone.badge}"
			>
				{pkg.code}
			</div>
			{#if pkg.badge}
				<div
					class="absolute top-4 right-4 rounded-full px-3 py-1.5 text-[10px] font-black tracking-[0.1em] uppercase shadow-lg shadow-black/30 {tone.badge}"
				>
					★ {pkg.badge}
				</div>
			{/if}
		</div>

		<div class="flex flex-1 flex-col p-5">
			<h3 class="text-2xl leading-tight font-black text-slate-950 dark:text-white">
				{pkg.title}
			</h3>
			<p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
				{pkg.description}
			</p>

			<div class="mt-5">
				<p class="text-[11px] font-black tracking-[0.14em] uppercase {tone.text}">
					Detail per sesi
				</p>
				{#if curriculumDay}
					<div class="mt-3 space-y-3">
						{#each curriculumDay.sessions as session, sessionIndex (session.title)}
							<div class="rounded-md border p-3 {tone.panel}">
								<div class="flex flex-wrap items-start justify-between gap-2">
									<div>
										<p class="text-[10px] font-black tracking-[0.12em] uppercase {tone.text}">
											Sesi {sessionIndex + 1}
										</p>
										<h4 class="mt-1 text-sm leading-5 font-black text-slate-900 dark:text-white">
											{session.title}
										</h4>
									</div>
									<span class="text-[11px] font-bold {tone.text}">
										{session.price}
									</span>
								</div>
								<ul class="mt-2 space-y-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
									{#each session.topics as topic (topic)}
										<li class="flex gap-2">
											<span class="mt-2 h-1 w-1 shrink-0 rounded-full {tone.dot}"></span>
											<span>{topic}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>
				{:else}
					<ul class="mt-3 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
						{#each pkg.lessons as lesson (lesson)}
							<li class="flex gap-2">
								<span class="mt-2.5 h-1 w-1 shrink-0 rounded-full {tone.dot}"></span>
								<span>{lesson}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<div class="mt-auto pt-6">
				<div class="border-t border-slate-200 pt-5 dark:border-slate-800">
					<p class="text-xs font-bold text-slate-500 dark:text-slate-400">Investasi ilmu</p>
					<div class="mt-1 text-3xl font-black text-slate-950 dark:text-white">{pkg.price}</div>
					<p class="mt-1 text-xs leading-5 font-semibold {tone.text}">
						{pkg.sessionPrice}
					</p>
					<a
						href={packageWhatsappUrl(pkg)}
						target="_blank"
						rel="external noopener noreferrer"
						class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-black transition active:scale-95 {tone.button}"
					>
						Info Detail
						<svg
							class="h-4 w-4"
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
					</a>
				</div>
			</div>
		</div>
	</article>
{/snippet}

{#snippet authorityActivityImage(item: AuthorityActivity, aspectClass: string)}
	{#if item.image}
		<div class="experience-image-frame relative overflow-hidden rounded-xl {aspectClass}">
			<img
				src={item.image}
				alt={item.title}
				class="experience-event-image h-[112%] w-full object-cover"
				loading="lazy"
			/>
			<div
				class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-950/80 to-transparent"
			></div>
		</div>
	{:else}
		<div
			class="experience-image-frame relative flex {aspectClass} items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_28%_22%,rgba(249,115,22,0.20),transparent_40%),linear-gradient(135deg,#0f172a,#111827)]"
		>
			<div
				class="pointer-events-none absolute inset-0 [background-image:linear-gradient(30deg,rgba(255,255,255,0.06)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,0.06)_87.5%)] [background-size:48px_48px] opacity-30"
			></div>
			<p class="experience-event-image relative text-lg font-bold text-white/70">{item.title}</p>
		</div>
	{/if}
{/snippet}

{#snippet authorityActivityCopy(
	item: AuthorityActivity,
	titleClass: string,
	descriptionClass: string
)}
	{@const participant = activityParticipantLabel(item)}
	<div class="experience-event-copy flex flex-col justify-center">
		<div class="mb-3 flex flex-wrap items-center gap-2">
			<span
				class="w-fit rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-black tracking-[0.14em] text-orange-300 uppercase"
				>{activityBadge(item)}</span
			>
			{#if participant}
				<span
					class="experience-participant-badge w-fit rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-[10px] font-black tracking-[0.1em] text-amber-200 uppercase shadow-sm shadow-orange-950/20"
					>{participant}</span
				>
			{/if}
		</div>
		<h3 class="{titleClass} font-bold text-white">{item.title}</h3>
		<p class="mt-3 {descriptionClass} leading-7 text-slate-300">{item.description}</p>
	</div>
{/snippet}

<svelte:head>
	<title>{content.seo.title}</title>
	<meta name="description" content={content.seo.description} />
</svelte:head>

{#each sections as sectionId (sectionId)}
	{#if sectionId === 'hero'}
		<section
			id="hero"
			class="relative isolate scroll-mt-20 overflow-hidden bg-slate-950 pt-16 text-white sm:pt-20"
		>
			<div
				class="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
				style="background-image: url('/background-beranda.png');"
			></div>
			<div
				class="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(249,115,22,0.35),transparent_30%),radial-gradient(circle_at_78%_42%,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.82))]"
			></div>
			<div
				class="absolute inset-0 [background-image:linear-gradient(30deg,rgba(255,255,255,0.07)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,0.07)_87.5%,rgba(255,255,255,0.07)),linear-gradient(150deg,rgba(255,255,255,0.07)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,0.07)_87.5%,rgba(255,255,255,0.07))] [background-size:56px_56px] [background-position:0_0,28px_28px] opacity-[0.14]"
			></div>

			<div
				class="relative mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24"
			>
				<div
					class="flex w-full max-w-[calc(100vw-2rem)] min-w-0 flex-col justify-center sm:max-w-3xl"
				>
					<div
						class="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-3.5 py-2 text-[11px] font-black tracking-[0.18em] text-orange-100 uppercase shadow-lg shadow-orange-950/20"
					>
						<span class="h-1.5 w-1.5 rounded-full bg-orange-300"></span>
						Masterclass 2026
					</div>
					<h1
						class="font-display max-w-full text-4xl leading-[1.04] font-black tracking-normal break-words text-white sm:text-6xl lg:text-7xl"
					>
						{#each heroHeadlineWords as word (word.key)}
							<span
								class={word.highlight
									? 'text-orange-300 drop-shadow-[0_0_18px_rgba(251,146,60,0.55)]'
									: ''}
							>
								{word.text}
							</span>
						{/each}
					</h1>
					<p
						class="mt-5 max-w-full text-lg leading-8 font-bold break-words text-orange-100 sm:max-w-2xl sm:text-2xl sm:leading-9"
					>
						{content.hero.title}
					</p>
					<p
						class="mt-5 max-w-full text-base leading-8 break-words text-slate-300 sm:max-w-2xl sm:text-lg"
					>
						{content.hero.subtitle}
					</p>
					<p
						class="mt-4 max-w-full text-sm leading-7 break-words text-slate-400 sm:max-w-2xl sm:text-base sm:leading-8"
					>
						{content.hero.description}
					</p>

					<div class="mt-8 flex flex-col gap-3 sm:flex-row">
						<a
							href={whatsappUrl}
							target="_blank"
							rel="external noopener noreferrer"
							class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-orange-950/40 transition hover:bg-orange-400 active:scale-95 sm:w-auto"
						>
							{content.hero.primaryCtaLabel}
							<svg
								class="h-4 w-4"
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
						</a>
						<a
							href={content.hero.secondaryCta.href || '#pricing'}
							class="inline-flex w-full items-center justify-center rounded-lg border border-white/20 bg-white/[0.04] px-6 py-4 text-sm font-bold text-slate-100 transition hover:border-orange-300 hover:bg-white/10 sm:w-auto"
						>
							{content.hero.secondaryCta.label}
						</a>
					</div>
					<div class="mt-7 flex flex-wrap gap-2 text-[11px] font-black tracking-[0.14em] uppercase">
						<span
							class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-slate-300"
							>Crypto</span
						>
						<span
							class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-slate-300"
							>Finance</span
						>
						<span
							class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-slate-300"
							>Fiqih Muamalah</span
						>
					</div>
				</div>

				<div class="relative min-w-0">
					<div
						class="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_50%_42%,rgba(249,115,22,0.28),transparent_58%)] blur-2xl"
					></div>
					<div
						class="relative overflow-hidden rounded-lg border border-orange-300/25 bg-slate-900 shadow-2xl shadow-orange-950/30"
					>
						<div class="flex items-center gap-2 border-b border-white/10 bg-slate-950/90 px-4 py-3">
							<span class="h-3 w-3 rounded-full bg-red-400"></span>
							<span class="h-3 w-3 rounded-full bg-yellow-400"></span>
							<span class="h-3 w-3 rounded-full bg-green-400"></span>
							<span class="ml-2 text-xs font-semibold text-slate-400"
								>{content.hero.videoLabel}</span
							>
						</div>
						<div class="relative aspect-video bg-slate-900 p-6">
							{#if heroVideo.kind === 'iframe'}
								<iframe
									class="absolute inset-0 h-full w-full"
									src={heroVideo.src}
									title={content.hero.videoTitle}
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									referrerpolicy="strict-origin-when-cross-origin"
									allowfullscreen
								></iframe>
							{:else if heroVideo.kind === 'file'}
								<!-- svelte-ignore a11y_media_has_caption -->
								<video class="absolute inset-0 h-full w-full bg-black" src={heroVideo.src} controls>
									Browser Anda tidak mendukung pemutaran video.
								</video>
							{:else}
								<div
									class="absolute inset-0 [background-image:radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.34),transparent_34%),linear-gradient(120deg,rgba(249,115,22,0.24),transparent_42%),linear-gradient(45deg,rgba(20,184,166,0.2),transparent_56%)] opacity-70"
								></div>
								<div class="relative flex h-full flex-col items-center justify-center text-center">
									<div
										class="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-lg shadow-orange-950/30"
									>
										<svg
											class="ml-1 h-8 w-8 text-white"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M8 5v14l11-7z" />
										</svg>
									</div>
									<p class="text-lg font-bold text-white">{content.hero.videoTitle}</p>
									<p class="mt-2 max-w-sm text-sm leading-6 text-slate-300">
										{content.hero.videoDescription}
									</p>
								</div>
							{/if}
						</div>
					</div>

					<CoinTicker highlights={content.hero.highlights} />
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'authority'}
		<section
			bind:this={experienceSection}
			class="experience-section relative overflow-hidden bg-gray-950 pt-20 pb-16 sm:pt-28 sm:pb-[5.5rem]"
		>
			<!-- Subtle geometric pattern overlay -->
			<div
				class="pointer-events-none absolute inset-0 [background-image:linear-gradient(30deg,rgba(255,255,255,0.5)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,0.5)_87.5%)] [background-size:60px_60px] opacity-[0.04]"
			></div>
			<!-- Top border glow -->
			<div
				class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent dark:via-orange-700/50"
			></div>

			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<!-- Section header -->
				<div class="mx-auto mb-16 max-w-3xl text-center">
					{#if content.authority.eyebrow}
						<p class="mb-4 text-xs font-black tracking-[0.22em] text-orange-300 uppercase">
							{content.authority.eyebrow}
						</p>
					{/if}
					<h2
						class="experience-heading heading-gradient text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl"
					>
						{content.authority.title}
					</h2>
					<p class="experience-lead mt-5 text-base leading-8 text-slate-300">
						{content.authority.description}
					</p>
					<dl class="mt-8 grid gap-3 sm:grid-cols-3">
						{#each content.authority.stats as stat (stat.label)}
							<div
								class="experience-stat-card rounded-lg border border-white/10 bg-white/[0.045] px-4 py-4 text-left shadow-lg shadow-black/10 backdrop-blur sm:text-center"
							>
								<dt
									class="text-2xl leading-none font-black text-white sm:text-3xl"
									data-experience-stat-value
									data-value={stat.value}
									data-suffix={stat.suffix}
								>
									{authorityStatValue(stat)}
								</dt>
								<dd class="mt-2 text-xs leading-5 font-bold text-slate-400">
									{stat.label}
								</dd>
							</div>
						{/each}
					</dl>
				</div>

				<!-- Desktop: Alternating storytelling layout -->
				<div class="relative hidden lg:block">
					<!-- Vertical timeline line -->
					<div
						class="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-orange-500/30 via-orange-300/20 to-transparent"
					></div>

					<div class="space-y-20">
						{#each content.authority.activities as item, index (item.title)}
							{@const isEven = index % 2 === 0}
							{@const isFirst = index === 0}
							<div
								class="experience-event-card relative grid grid-cols-2 items-center gap-12"
								class:grid-cols-[1.2fr_0.8fr]={isFirst && isEven}
								class:grid-cols-[0.8fr_1.2fr]={!isFirst && !isEven}
								class:grid-cols-[1.1fr_0.9fr]={!isFirst && isEven}
								data-experience-side={isEven ? 'left' : 'right'}
							>
								<!-- Large numbered badge -->
								<div
									class="pointer-events-none absolute -top-6 text-7xl font-black text-orange-500/15"
									class:left-4={isEven}
									class:right-4={!isEven}
								>
									{String(index + 1).padStart(2, '0')}
								</div>

								{#if isEven}
									<!-- Image LEFT, text RIGHT -->
									<div class="relative">
										<!-- Subtle radial glow behind image -->
										<div
											class="absolute -inset-4 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.10),transparent_70%)]"
										></div>
										{@render authorityActivityImage(
											item,
											isFirst ? 'aspect-[16/10]' : 'aspect-[16/9]'
										)}
									</div>
									{@render authorityActivityCopy(item, 'text-2xl', 'text-base')}
								{:else}
									<!-- Text LEFT, image RIGHT -->
									{@render authorityActivityCopy(item, 'text-2xl', 'text-base')}
									<div class="relative">
										<div
											class="absolute -inset-4 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.10),transparent_70%)]"
										></div>
										{@render authorityActivityImage(item, 'aspect-[16/9]')}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Mobile: Vertical timeline layout -->
				<div class="lg:hidden">
					<div class="relative space-y-10 pl-10">
						<!-- Timeline line -->
						<div
							class="absolute top-2 left-[15px] h-[calc(100%-1rem)] w-px bg-gradient-to-b from-orange-500/30 via-orange-300/20 to-transparent"
						></div>

						{#each content.authority.activities as item, index (item.title)}
							<div class="experience-event-card relative" data-experience-side="mobile">
								<!-- Timeline dot -->
								<div
									class="absolute top-1 -left-10 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-orange-500/40 bg-gray-950 text-xs font-black text-orange-400"
								>
									{index + 1}
								</div>

								<!-- Image -->
								<div class="mb-4">
									{@render authorityActivityImage(item, 'aspect-[16/9]')}
								</div>

								<!-- Text -->
								{@render authorityActivityCopy(item, 'text-xl', 'text-sm')}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'testimonials'}
		<section class="bg-white py-20 dark:bg-gray-950" id="testimonials">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mx-auto mb-12 max-w-3xl text-center">
					<h2 class="heading-gradient text-3xl font-extrabold sm:text-4xl">
						{content.testimonials.title}
					</h2>
					<p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
						{content.testimonials.description}
					</p>
				</div>

				<TestimonialCarousel items={content.testimonials.items} />
			</div>
		</section>
	{/if}

	{#if sectionId === 'usp'}
		<section
			bind:this={uspSection}
			class="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20"
		>
			<div
				class="absolute inset-0 [background-image:radial-gradient(circle_at_18%_12%,rgba(249,115,22,0.18),transparent_30%),linear-gradient(30deg,rgba(255,255,255,0.05)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,0.05)_87.5%,rgba(255,255,255,0.05)),linear-gradient(150deg,rgba(255,255,255,0.05)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,0.05)_87.5%,rgba(255,255,255,0.05))] [background-size:auto,56px_56px,56px_56px] [background-position:0_0,0_0,28px_28px] opacity-60"
				style:background-position={`0 0, ${uspProgress * 16}px ${uspProgress * 16}px, ${28 + uspProgress * 16}px ${28 + uspProgress * 16}px`}
			></div>
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="relative mx-auto max-w-4xl text-center">
					<h2 class="text-3xl leading-tight font-black sm:text-4xl">
						<span
							class="block transition-all duration-700 ease-out motion-reduce:transition-none {uspVisible(
								0.04
							)
								? 'translate-y-0 opacity-100'
								: 'translate-y-6 opacity-0'}"
						>
							{uspTitleParts.prefix}
						</span>
						{#if uspTitleParts.highlight}
							<span
								class="mt-1 block bg-gradient-to-r from-orange-200 via-orange-400 to-amber-200 bg-clip-text text-transparent transition-all delay-100 duration-700 ease-out motion-reduce:transition-none {uspVisible(
									0.1
								)
									? 'usp-title-highlight-active translate-y-0 opacity-100'
									: 'translate-y-6 opacity-0'}"
							>
								{uspTitleParts.highlight}
							</span>
						{/if}
					</h2>
					{#if content.usp.description}
						<p
							class="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300 transition-all delay-150 duration-700 ease-out motion-reduce:transition-none sm:text-lg {uspVisible(
								0.17
							)
								? 'translate-y-0 opacity-100'
								: 'translate-y-4 opacity-0'}"
						>
							{content.usp.description}
						</p>
					{/if}
				</div>

				<div class="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each content.usp.items as item, index (item.title)}
						{@const iconKey = benefitIconKey(item.title)}
						<div
							class="group relative overflow-hidden rounded-lg border border-orange-400/35 bg-orange-500/[0.08] p-6 transition-all duration-600 ease-out hover:-translate-y-1 hover:border-orange-300/70 hover:shadow-[0_18px_45px_rgba(249,115,22,0.12)] motion-reduce:transition-none {uspVisible(
								0.25 + index * 0.065
							)
								? 'usp-card-revealed translate-y-0 scale-100 opacity-100'
								: 'translate-y-9 scale-[0.96] opacity-0'}"
							onmousemove={updateUspSpotlight}
							onmouseleave={resetUspSpotlight}
							role="group"
							aria-label={item.title}
						>
							<div
								class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(249,115,22,0.10),transparent_60%)]"
							></div>
							<div
								class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								style="background: radial-gradient(260px circle at var(--spotlight-x, 85%) var(--spotlight-y, 15%), rgba(251,146,60,0.16), transparent 65%);"
							></div>
							<div
								class="relative mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.08] text-orange-200 transition-all duration-600 ease-out group-hover:border-orange-300/40 group-hover:bg-orange-400/15 group-hover:shadow-[0_0_24px_rgba(249,115,22,0.18)] motion-reduce:transition-none {uspVisible(
									0.25 + index * 0.065
								)
									? 'scale-100 rotate-0 opacity-100'
									: 'scale-[0.7] -rotate-[6deg] opacity-0'}"
							>
								{#if iconKey === 'layers'}
									<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 7l6-3 6 3-6 3-6-3zm0 5l6 3 6-3M6 17l6 3 6-3"
										/>
									</svg>
								{:else if iconKey === 'shield'}
									<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 3l7 4v5c0 4.5-2.8 7.7-7 9-4.2-1.3-7-4.5-7-9V7l7-4z"
										/>
									</svg>
								{:else if iconKey === 'task'}
									<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m5 2a8 8 0 11-16 0 8 8 0 0116 0z"
										/>
									</svg>
								{:else if iconKey === 'certificate'}
									<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 012-2z"
										/>
									</svg>
								{:else if iconKey === 'users'}
									<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m8-4.13a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
								{:else if iconKey === 'globe'}
									<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2-2.4 3-5.4 3-9s-1-6.6-3-9m0 18c-2-2.4-3-5.4-3-9s1-6.6 3-9m-7 9h14"
										/>
									</svg>
								{:else}
									<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 6h16M4 12h16M4 18h10"
										/>
									</svg>
								{/if}
							</div>
							<h3
								class="relative text-xl leading-snug font-extrabold text-white transition-colors duration-300 group-hover:text-orange-100"
							>
								{item.title}
							</h3>
							<p class="relative mt-3 text-[15px] leading-7 text-slate-300">
								{item.description}
							</p>
						</div>
					{/each}
				</div>

				<div
					class="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-lg border border-orange-500/30 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(255,255,255,0.04)_48%,rgba(20,184,166,0.08))] p-6 text-left shadow-2xl shadow-orange-950/10 transition-all duration-700 ease-out motion-reduce:transition-none sm:p-8 {uspVisible(
						0.66
					)
						? 'translate-y-0 scale-100 opacity-100'
						: 'translate-y-11 scale-[0.98] opacity-0'}"
				>
					<div
						class="absolute top-2 right-6 text-8xl leading-none font-black text-orange-400 transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none {uspVisible(
							0.69
						)
							? 'opacity-20'
							: 'opacity-0'}"
						style:transform={`translateY(${bundleReducedMotion ? 0 : Math.max(0, 1 - uspProgress) * 18}px) scale(${uspVisible(0.69) ? 1 : 0.8})`}
					>
						"
					</div>
					<div class="relative grid gap-6 sm:grid-cols-[8rem_1fr] sm:items-center">
						{#if content.usp.quoteImage}
							<figure
								class="transition-all duration-700 ease-out motion-reduce:transition-none {uspVisible(
									0.72
								)
									? 'translate-y-0 scale-100 opacity-100'
									: 'translate-y-5 scale-[0.94] opacity-0'}"
							>
								<img
									src={content.usp.quoteImage}
									alt="Warren Buffett"
									class="mx-auto aspect-square w-28 rounded-xl border-2 border-orange-400/60 object-cover shadow-lg shadow-black/30 sm:w-32"
									loading="lazy"
								/>
							</figure>
						{/if}
						<div class="relative overflow-hidden pl-5">
							<div
								class="absolute top-0 left-0 w-1 bg-orange-400 transition-[height,opacity] duration-700 ease-out motion-reduce:transition-none {uspVisible(
									0.76
								)
									? 'h-full opacity-100'
									: 'h-0 opacity-0'}"
							></div>
							<div
								class="transition-all duration-700 ease-out motion-reduce:transition-none {uspVisible(
									0.8
								)
									? 'translate-x-0 opacity-100'
									: '-translate-x-6 opacity-0'}"
							>
								<blockquote
									class="text-xl leading-8 font-extrabold text-white sm:text-2xl sm:leading-9"
								>
									{quoteParts.text}
								</blockquote>
							</div>
							{#if quoteParts.attribution}
								<p
									class="mt-4 text-xs font-black tracking-[0.16em] text-orange-200 uppercase transition-all duration-500 ease-out motion-reduce:transition-none {uspVisible(
										0.9
									)
										? 'translate-y-0 opacity-100'
										: 'translate-y-3 opacity-0'}"
								>
									{quoteParts.attribution}
								</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'pricing'}
		<section class="scroll-mt-20 bg-white py-16 sm:py-20 dark:bg-gray-950" id="pricing">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mx-auto max-w-4xl text-center">
					<div
						class="mb-4 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-[11px] font-black tracking-[0.14em] text-orange-700 uppercase dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-200"
					>
						{content.pricing.eyebrow || 'Pilihan Paket Masterclass'}
					</div>
					<h2 class="heading-gradient text-3xl leading-tight font-extrabold sm:text-5xl">
						{content.pricing.title}
					</h2>
					<p class="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
						{content.pricing.description}
					</p>
					{#if content.pricing.dateCard?.date}
						<div
							class="mt-7 inline-flex max-w-full flex-col gap-3 rounded-lg border border-orange-200 bg-orange-50/60 px-5 py-4 text-left sm:flex-row sm:items-center sm:gap-5 dark:border-orange-900/50 dark:bg-orange-950/20"
						>
							<div>
								<p
									class="text-xs font-black tracking-[0.14em] text-orange-700 uppercase dark:text-orange-400"
								>
									{content.pricing.dateCard.label}
								</p>
								<p class="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
									{content.pricing.dateCard.date}
								</p>
							</div>
							{#if content.pricing.dateCard.time}
								<div
									class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
								>
									<svg
										class="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									{content.pricing.dateCard.time}
								</div>
							{/if}
						</div>
					{/if}
				</div>

				{#if pricingPackages.length > 0}
					<div class="mt-12 lg:hidden">
						<div
							class="grid grid-cols-4 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900"
							role="tablist"
							aria-label="Pilihan paket masterclass"
						>
							{#each pricingPackages as pkg, index (pkg.code)}
								<button
									type="button"
									role="tab"
									aria-selected={selectedPricingPackageIndex === index}
									onclick={() => selectPricingPackage(index)}
									class={selectedPricingPackageIndex === index
										? 'rounded-md bg-orange-600 px-3 py-3 text-sm font-black text-white shadow-sm'
										: 'rounded-md px-3 py-3 text-sm font-black text-slate-600 transition hover:bg-white hover:text-orange-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-300'}
								>
									{pkg.code.replace('Paket ', '')}
								</button>
							{/each}
						</div>
						{#if selectedPricingPackage}
							<div class="mt-5">
								{@render pricingPackageCard(selectedPricingPackage)}
							</div>
						{/if}
					</div>

					<div class="mt-12 hidden gap-5 lg:grid lg:grid-cols-2 xl:grid-cols-4">
						{#each pricingPackages as pkg (pkg.code)}
							{@render pricingPackageCard(pkg)}
						{/each}
					</div>
				{/if}

				<div
					bind:this={bundleScrollContainer}
					class="relative mt-12 {bundleReducedMotion ? '' : 'lg:min-h-[165vh]'}"
				>
					<article
						class="relative overflow-hidden rounded-xl border border-orange-300 bg-orange-50 transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none dark:border-orange-900/70 dark:bg-orange-950/20 {bundleReducedMotion
							? ''
							: 'lg:sticky lg:top-20'} {bundleVisible(0.01)
							? 'translate-y-0 opacity-100 shadow-[0_18px_55px_rgba(249,115,22,0.16)]'
							: 'translate-y-10 opacity-0 shadow-none'}"
					>
						<div
							class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(249,115,22,0.18),transparent_38%)] transition-opacity duration-700 {bundleVisible(
								0.04
							)
								? 'opacity-100'
								: 'opacity-0'}"
						></div>
						<div
							class="absolute top-0 left-[40%] z-20 hidden w-px bg-orange-500/55 transition-[height,opacity] duration-700 ease-out lg:block {bundleVisible(
								0.43
							)
								? 'h-full opacity-100'
								: 'h-0 opacity-0'}"
						></div>

						<div class="relative z-10 grid lg:grid-cols-[0.8fr_1.2fr]">
							<div class="flex flex-col bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
								<span
									class="inline-flex w-fit rounded-full bg-orange-600 px-3 py-1.5 text-[11px] font-black tracking-[0.14em] text-white uppercase transition-all duration-500 ease-out motion-reduce:transition-none {bundleVisible(
										0.08
									)
										? 'translate-y-0 opacity-100'
										: 'translate-y-4 opacity-0'}"
									style:transition-delay={bundleDelay(0)}
								>
									{content.pricing.priceBadge || 'Promo Bundling'}
								</span>
								<h3
									class="mt-5 text-3xl leading-tight font-black transition-all duration-600 ease-out motion-reduce:transition-none sm:text-4xl {bundleVisible(
										0.15
									)
										? 'translate-y-0 opacity-100'
										: 'translate-y-6 opacity-0'}"
									style:transition-delay={bundleDelay(120)}
								>
									{content.pricing.bundleTitle}
								</h3>

								<div
									class="mt-8 transition-all duration-600 ease-out motion-reduce:transition-none {bundleVisible(
										0.22
									)
										? 'translate-y-0 opacity-100'
										: 'translate-y-5 opacity-0'}"
									style:transition-delay={bundleDelay(260)}
								>
									<p class="text-sm font-bold text-slate-400">Total Value</p>
									<p class="mt-1 text-2xl font-black text-slate-400">
										<span class="relative inline-block">
											{content.pricing.originalPrice}
											<span
												class="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 bg-slate-400 transition-[width] duration-700 ease-out motion-reduce:transition-none {bundleVisible(
													0.3
												)
													? 'w-full'
													: 'w-0'}"
												style:transition-delay={bundleDelay(400)}
											></span>
										</span>
									</p>
								</div>

								<div
									class="mt-6 transition-all duration-700 ease-out motion-reduce:transition-none {bundleVisible(
										0.36
									)
										? 'translate-y-0 scale-100 opacity-100'
										: 'translate-y-5 scale-[0.92] opacity-0'}"
									style:transition-delay={bundleDelay(520)}
								>
									<p class="text-sm font-black tracking-wide text-orange-300 uppercase">
										Promo Diskon Bundling Jadi
									</p>
									<p
										class="mt-2 text-5xl leading-none font-black transition-[filter] duration-700 sm:text-6xl {bundleVisible(
											0.4
										)
											? 'drop-shadow-[0_0_18px_rgba(251,146,60,0.3)]'
											: ''}"
									>
										{content.pricing.price}
									</p>
								</div>

								<a
									href={whatsappUrl}
									target="_blank"
									rel="external noopener noreferrer"
									class="group/cta mt-8 hidden w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-500 hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-orange-500/40 active:scale-95 motion-reduce:transition-none lg:mt-auto lg:inline-flex {bundleVisible(
										0.94
									)
										? 'scale-100 opacity-100'
										: 'scale-[0.97] opacity-0'}"
								>
									{content.pricing.ctaLabel}
									<svg
										class="h-4 w-4 transition-transform group-hover/cta:translate-x-1"
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
								</a>
							</div>

							<div class="grid gap-8 p-6 sm:p-8 xl:grid-cols-2 xl:p-10">
								<div>
									<h4
										class="text-lg font-black text-slate-900 transition-all duration-500 motion-reduce:transition-none dark:text-white {bundleVisible(
											0.47
										)
											? 'translate-y-0 opacity-100'
											: 'translate-y-4 opacity-0'}"
										style:transition-delay={bundleDelay(700)}
									>
										Yang Didapat:
									</h4>
									<ul class="mt-5 space-y-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
										{#each pricingProgramItems as point, index (point)}
											<li
												class="flex gap-3 transition-all duration-500 ease-out motion-reduce:transition-none {bundleVisible(
													0.5 + index * 0.045
												)
													? 'translate-x-0 opacity-100'
													: '-translate-x-3 opacity-0'}"
												style:transition-delay={bundleDelay(820 + index * 140)}
											>
												<span
													class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-black text-white transition-transform duration-500 motion-reduce:transition-none {bundleVisible(
														0.5 + index * 0.045
													)
														? 'scale-100'
														: 'scale-75'}"
													aria-hidden="true">✓</span
												>
												<span>{point}</span>
											</li>
										{/each}
									</ul>
								</div>

								<div>
									<h4
										class="text-lg font-black text-slate-900 transition-all duration-500 motion-reduce:transition-none dark:text-white {bundleVisible(
											0.73
										)
											? 'translate-y-0 opacity-100'
											: 'translate-y-4 opacity-0'}"
										style:transition-delay={bundleDelay(1580)}
									>
										Bonus Tambahan Spesial:
									</h4>
									<ul class="mt-5 space-y-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
										{#each pricingBundleBonuses as bonus, index (bonus)}
											<li
												class="flex gap-3 transition-all duration-500 ease-out motion-reduce:transition-none {bundleVisible(
													0.76 + index * 0.05
												)
													? 'translate-y-0 opacity-100'
													: 'translate-y-4 opacity-0'}"
												style:transition-delay={bundleDelay(1720 + index * 140)}
											>
												<span
													class="text-lg leading-6 transition-all duration-500 motion-reduce:transition-none {bundleVisible(
														0.76 + index * 0.05
													)
														? 'scale-100 rotate-0 opacity-100'
														: 'scale-[0.8] -rotate-[8deg] opacity-0'}"
													aria-hidden="true">🎁</span
												>
												<span>{bonus}</span>
											</li>
										{/each}
									</ul>
								</div>

								<a
									href={whatsappUrl}
									target="_blank"
									rel="external noopener noreferrer"
									class="group/cta inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-500 hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-orange-500/40 active:scale-95 motion-reduce:transition-none lg:hidden xl:col-span-2 {bundleVisible(
										0.94
									)
										? 'scale-100 opacity-100'
										: 'scale-[0.97] opacity-0'}"
									style:transition-delay={bundleDelay(2360)}
								>
									{content.pricing.ctaLabel}
									<svg
										class="h-4 w-4 transition-transform group-hover/cta:translate-x-1"
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
								</a>
							</div>
						</div>
					</article>
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'curriculum'}
		<section class="scroll-mt-20 bg-slate-50 py-16 sm:py-20 dark:bg-slate-900" id="curriculum">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mx-auto mb-12 max-w-4xl text-center">
					{#if content.curriculum.eyebrow}
						<p
							class="mb-3 text-sm font-black tracking-[0.16em] text-orange-600 uppercase dark:text-orange-300"
						>
							{content.curriculum.eyebrow}
						</p>
					{/if}
					<h2 class="heading-gradient text-3xl leading-tight font-extrabold sm:text-5xl">
						{content.curriculum.title}
					</h2>
					{#if content.curriculum.description}
						<p
							class="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300"
						>
							{content.curriculum.description}
						</p>
					{/if}
				</div>

				{#if content.curriculum.schedule.length > 0}
					<div class="space-y-8">
						{#each content.curriculum.schedule as day, dayIndex (day.stage)}
							<article
								class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-950/5 dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/20"
							>
								<div class="p-5 sm:p-7 lg:p-8">
									<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
										<div class="min-w-0">
											<p class="text-sm font-black text-orange-600 dark:text-orange-300">
												Hari {dayIndex + 1} — {day.date.replace(/^(Sabtu|Minggu),\s*/, '')}
											</p>
											<h3
												class="mt-2 text-2xl leading-tight font-black text-slate-950 sm:text-3xl dark:text-white"
											>
												{day.stage}
											</h3>
										</div>
										{#if day.time}
											<div
												class="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
											>
												<svg
													class="h-4 w-4 text-orange-500"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
												{day.time}
											</div>
										{/if}
									</div>

									<p class="mt-4 max-w-5xl text-base leading-7 text-slate-700 dark:text-slate-300">
										{day.description}
									</p>

									<div class="mt-7 grid gap-4 lg:grid-cols-2">
										{#each day.sessions as session, sessionIndex (session.title)}
											<section
												class="rounded-lg border border-orange-200 bg-orange-50/80 p-5 dark:border-orange-900/60 dark:bg-orange-950/20"
											>
												<div
													class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
												>
													<h4
														class="text-lg leading-snug font-black text-slate-950 dark:text-white"
													>
														Sesi {sessionIndex + 1}: {session.title}
													</h4>
													<p
														class="shrink-0 text-sm font-bold text-orange-600 italic dark:text-orange-300"
													>
														{session.price}
													</p>
												</div>
												<ul
													class="mt-5 space-y-3 text-[15px] leading-6 text-slate-800 dark:text-slate-200"
												>
													{#each session.topics as topic (topic)}
														<li class="flex gap-3">
															<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
															></span>
															<span>{topic}</span>
														</li>
													{/each}
												</ul>
											</section>
										{/each}
									</div>
								</div>
								<div
									class="border-t border-orange-200 bg-orange-50 px-5 py-3 text-sm font-black text-orange-700 sm:px-7 lg:px-8 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-300"
								>
									Total Paket Hari {dayIndex + 1}: {day.packagePrice}
								</div>
							</article>
						{/each}
					</div>
				{:else}
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{#each content.curriculum.topics as topic, index (topic)}
							<div
								class="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
							>
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-900 text-sm font-black text-white dark:bg-orange-600"
								>
									{index + 1}
								</div>
								<div>
									<h3 class="font-bold text-slate-900 dark:text-white">{topic}</h3>
									<p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
										Dipelajari melalui kerangka riset, studi kasus, dan diskusi penerapan.
									</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}

				<div class="mt-12">
					<h3
						class="border-b-2 border-orange-500 pb-2 text-2xl font-black tracking-wide text-orange-600 uppercase dark:text-orange-300"
					>
						Ringkasan Investasi
					</h3>
					<div
						class="mt-4 grid overflow-hidden rounded-lg border border-orange-200 bg-orange-50 sm:grid-cols-3 dark:border-orange-900/60 dark:bg-orange-950/20"
					>
						<div
							class="p-5 text-center sm:border-r sm:border-orange-200 dark:sm:border-orange-900/60"
						>
							<p class="text-sm font-black text-slate-900 dark:text-white">Per Sesi</p>
							<p class="mt-1 text-2xl font-black text-orange-600 dark:text-orange-300">
								{content.curriculum.investmentSummary.sessionPrice}
							</p>
						</div>
						<div
							class="border-t border-orange-200 p-5 text-center sm:border-t-0 sm:border-r dark:border-orange-900/60"
						>
							<p class="text-sm font-black text-slate-900 dark:text-white">Per Paket (1 Hari)</p>
							<p class="mt-1 text-2xl font-black text-orange-600 dark:text-orange-300">
								{content.curriculum.investmentSummary.packagePrice}
							</p>
						</div>
						<div
							class="border-t border-orange-200 p-5 text-center sm:border-t-0 dark:border-orange-900/60"
						>
							<p class="text-sm font-black text-slate-900 dark:text-white">Total 4 Paket</p>
							<p class="mt-1 text-2xl font-black text-orange-600 dark:text-orange-300">
								{content.curriculum.investmentSummary.totalPrice}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'instructors'}
		<section class="scroll-mt-20 bg-white py-16 sm:py-20 dark:bg-gray-950" id="instructors">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mb-12 max-w-4xl">
					{#if content.instructors.eyebrow}
						<p class="mb-4 text-xs font-black tracking-[0.22em] text-orange-600 uppercase">
							{content.instructors.eyebrow}
						</p>
					{/if}
					<h2 class="heading-gradient text-3xl leading-tight font-extrabold sm:text-4xl">
						{content.instructors.title}
					</h2>
					<p class="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
						{content.instructors.description}
					</p>
				</div>

				<div class="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
					{#each content.instructors.items as instructor (instructor.name)}
						<div
							class="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-orange-200 hover:shadow-lg hover:shadow-orange-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-900/70"
						>
							<div
								class="relative aspect-[5/4] overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-orange-50/40 to-slate-100 sm:aspect-[4/3] dark:border-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
							>
								<img
									src={instructor.photo}
									alt={instructor.name}
									class="h-full w-full object-cover object-[center_22%] brightness-[1.03] contrast-[1.04] saturate-[0.96]"
								/>
							</div>
							<div class="flex flex-1 flex-col p-5 sm:p-6">
								<div class="mb-5 flex flex-col">
									<div class="flex flex-col xl:min-h-[12.25rem]">
										<p
											class="mb-5 inline-flex min-h-12 w-fit items-center rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-sm leading-5 font-bold text-orange-700 dark:border-orange-700/70 dark:bg-orange-500/10 dark:text-orange-200"
										>
											{instructor.badge}
										</p>
										<h3
											class="text-2xl leading-snug font-black break-words text-slate-900 xl:min-h-[4.25rem] dark:text-white"
										>
											{instructor.name}
										</h3>
										<p class="mt-2 min-h-6 text-sm font-bold text-slate-500 dark:text-slate-400">
											{instructor.credentials}
										</p>
									</div>

									<div class="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
										<h4
											class="text-xs font-black tracking-[0.14em] text-slate-600 uppercase dark:text-slate-300"
										>
											Kredensial Utama
										</h4>
										<ul class="mt-4 space-y-3">
											{#each instructor.highlights as highlight (highlight)}
												<li
													class="flex gap-3 text-[15px] leading-7 text-slate-700 dark:text-slate-200"
												>
													<svg
														class="mt-1 h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden="true"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2.5"
															d="M5 13l4 4L19 7"
														/>
													</svg>
													<span>{highlight}</span>
												</li>
											{/each}
										</ul>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<div
					class="mt-10 rounded-lg border border-orange-100 bg-orange-50/70 p-6 shadow-sm shadow-orange-950/5 sm:p-8 dark:border-orange-900/50 dark:bg-slate-950"
				>
					<div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
						<div>
							{#if content.instructors.closing}
								<p class="max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
									{content.instructors.closing}
								</p>
							{/if}
							<h3 class="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
								{content.instructors.ctaTitle}
							</h3>
							<p class="mt-2 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
								{content.instructors.ctaDescription}
							</p>
						</div>
						<div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
							<a
								href="#curriculum"
								class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-4 text-sm font-bold whitespace-nowrap text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-500 active:scale-95 sm:w-auto sm:min-w-44"
							>
								{content.instructors.primaryCta.label}
								<svg
									class="h-4 w-4"
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
							</a>
							<a
								href={content.instructors.secondaryCta.href || whatsappUrl}
								target="_blank"
								rel="external noopener noreferrer"
								class="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-6 py-4 text-sm font-bold whitespace-nowrap text-slate-900 transition hover:border-orange-300 hover:bg-orange-50 sm:w-auto sm:min-w-44 dark:border-slate-700 dark:text-white dark:hover:border-orange-800 dark:hover:bg-orange-950/30"
							>
								{content.instructors.secondaryCta.label}
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'urgency'}
		<SpecialOfferSection urgency={content.urgency} ctaHref={whatsappUrl} />
	{/if}

	{#if sectionId === 'faq'}
		<section class="scroll-mt-20 bg-white py-16 sm:py-20 dark:bg-gray-950" id="faq">
			<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<div class="mb-10 text-center">
					<h2 class="heading-gradient text-3xl font-extrabold sm:text-4xl">
						{content.faq.title}
					</h2>
				</div>

				<div class="space-y-4">
					{#each visibleFaqItems as entry, visibleIndex (entry.index)}
						{@const faq = entry.item}
						{@const index = entry.index}
						{@const category = faqCategory(index)}
						{#if visibleIndex === 0 || faqCategory(visibleFaqItems[visibleIndex - 1].index) !== category}
							<div class="pt-3 first:pt-0">
								<p
									class="text-xs font-black tracking-[0.16em] text-orange-600 uppercase dark:text-orange-300"
								>
									{category}
								</p>
							</div>
						{/if}
						<div
							class="overflow-hidden rounded-lg border transition {openFaqIndex === index
								? 'border-orange-300 shadow-sm shadow-orange-950/5 dark:border-orange-800'
								: 'border-slate-200 dark:border-slate-800'}"
						>
							<button
								type="button"
								onclick={() => toggleFaq(index)}
								class="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition {openFaqIndex ===
								index
									? 'bg-gradient-to-b from-orange-950/15 to-transparent dark:from-orange-950/20 dark:to-transparent'
									: 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800'}"
								aria-expanded={openFaqIndex === index}
							>
								<span class="font-bold text-slate-900 dark:text-white">{faq.question}</span>
								<svg
									class="h-5 w-5 shrink-0 text-orange-600 transition dark:text-orange-300 {openFaqIndex ===
									index
										? 'rotate-180'
										: ''}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2.5"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							{#if openFaqIndex === index}
								<div class="bg-white px-5 py-5 dark:bg-slate-950">
									<p class="text-sm leading-7 text-slate-600 dark:text-slate-300">
										{faq.answer}
									</p>
								</div>
							{/if}
						</div>
					{/each}
				</div>
				{#if content.faq.items.length > visibleFaqItems.length}
					<div class="mt-8 flex justify-center">
						<button
							type="button"
							onclick={() => (showAllFaqs = true)}
							class="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-5 py-3.5 text-sm font-bold text-slate-900 transition hover:border-orange-300 hover:bg-orange-50 sm:w-auto dark:border-slate-700 dark:text-white dark:hover:border-orange-800 dark:hover:bg-orange-950/30"
						>
							Lihat FAQ lainnya
						</button>
					</div>
				{:else if showAllFaqs && content.faq.items.length > 5}
					<div class="mt-8 flex justify-center">
						<button
							type="button"
							onclick={() => {
								showAllFaqs = false;
								openFaqIndex = 0;
							}}
							class="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-5 py-3.5 text-sm font-bold text-slate-900 transition hover:border-orange-300 hover:bg-orange-50 sm:w-auto dark:border-slate-700 dark:text-white dark:hover:border-orange-800 dark:hover:bg-orange-950/30"
						>
							Sembunyikan FAQ
						</button>
					</div>
				{/if}
			</div>
		</section>
	{/if}

	{#if sectionId === 'finalCta'}
		<section class="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
			<div
				class="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(249,115,22,0.2),transparent_34%),linear-gradient(30deg,rgba(255,255,255,0.05)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,0.05)_87.5%,rgba(255,255,255,0.05)),linear-gradient(150deg,rgba(255,255,255,0.05)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,0.05)_87.5%,rgba(255,255,255,0.05))] [background-size:auto,56px_56px,56px_56px] [background-position:0_0,0_0,28px_28px]"
			></div>
			<div class="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
				<div
					class="mx-auto mb-8 h-px max-w-xs bg-gradient-to-r from-transparent via-orange-400 to-transparent"
				></div>
				<h2 class="text-4xl leading-tight font-black sm:text-5xl">
					{content.finalCta.title}
				</h2>
				<p class="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
					{content.finalCta.description}
				</p>
				<a
					href={whatsappUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-8 py-4 text-sm font-black text-white shadow-xl ring-1 shadow-orange-500/20 ring-orange-300/20 transition hover:bg-orange-500 active:scale-95 sm:w-auto"
				>
					{content.finalCta.ctaLabel}
					<svg
						class="h-4 w-4"
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
				</a>
			</div>
		</section>
	{/if}
{/each}

<style>
	@keyframes usp-title-glow {
		0% {
			filter: drop-shadow(0 0 0 rgba(251, 146, 60, 0));
		}
		45% {
			filter: drop-shadow(0 0 14px rgba(251, 146, 60, 0.38));
		}
		100% {
			filter: drop-shadow(0 0 0 rgba(251, 146, 60, 0));
		}
	}

	@keyframes usp-card-glow {
		0% {
			box-shadow: 0 0 0 rgba(249, 115, 22, 0);
		}
		45% {
			box-shadow: 0 0 24px rgba(249, 115, 22, 0.16);
		}
		100% {
			box-shadow: 0 0 0 rgba(249, 115, 22, 0);
		}
	}

	.usp-title-highlight-active {
		animation: usp-title-glow 900ms ease-out;
	}

	.usp-card-revealed {
		animation: usp-card-glow 850ms ease-out;
	}

	@media (prefers-reduced-motion: reduce) {
		.usp-title-highlight-active,
		.usp-card-revealed {
			animation: none;
		}
	}
</style>
