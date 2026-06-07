<script lang="ts">
	import { onMount } from 'svelte';
	import {
		defaultLandingContent,
		subscribeLandingContent,
		buildWhatsappUrl,
		resolveVideoEmbed,
		type LandingContent,
		type SectionId
	} from '$lib/landingContent';

	let content = $state<LandingContent>(structuredClone(defaultLandingContent));

	const whatsappUrl = $derived(buildWhatsappUrl(content.whatsapp));
	const heroVideo = $derived(resolveVideoEmbed(content.hero.videoUrl));

	// Only render sections that are marked visible, in the admin-defined order.
	const sections = $derived(
		content.layout.filter((s) => s.visible && s.id !== 'testimonials').map((s) => s.id)
	);

	function isVisible(id: SectionId) {
		return sections.includes(id);
	}

	let openFaqIndex = $state<number | null>(0);

	function toggleFaq(index: number) {
		openFaqIndex = openFaqIndex === index ? null : index;
	}

	function resolveCtaHref(cta: { href: string }) {
		return cta.href?.trim() || whatsappUrl;
	}

	function isExternalHref(href: string) {
		return /^https?:\/\//.test(href);
	}

	onMount(() => {
		return subscribeLandingContent((c) => {
			content = c;
		});
	});
</script>

<svelte:head>
	<title>{content.seo.title}</title>
	<meta name="description" content={content.seo.description} />
</svelte:head>

{#each sections as sectionId (sectionId)}
	{#if sectionId === 'hero'}
		<section class="relative isolate overflow-hidden bg-slate-950 pt-20 text-white">
			<div
				class="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(30,41,59,0.9)),linear-gradient(90deg,rgba(234,88,12,0.18)_0%,rgba(20,184,166,0.1)_48%,rgba(15,23,42,0)_100%)]"
			></div>
			<div
				class="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px] opacity-20"
			></div>

			<div
				class="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24"
			>
				<div class="flex max-w-3xl min-w-0 flex-col justify-center">
					<h1
						class="font-display text-4xl leading-tight font-extrabold tracking-normal break-words sm:text-6xl lg:text-7xl"
					>
						{content.hero.badge}
					</h1>
					<p class="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
						{content.hero.subtitle}
					</p>
					<p class="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
						{content.hero.description}
					</p>

					<div class="mt-8 flex flex-col gap-3 sm:flex-row">
						<a
							href={whatsappUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-500 active:scale-95 sm:w-auto"
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
							href={content.hero.secondaryCta.href}
							class="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-6 py-4 text-sm font-bold text-slate-100 transition hover:border-orange-300 hover:bg-white/10 sm:w-auto"
						>
							{content.hero.secondaryCta.label}
						</a>
					</div>
				</div>

				<div class="relative min-w-0">
					<div
						class="overflow-hidden rounded-lg border border-white/15 bg-slate-900 shadow-2xl shadow-black/30"
					>
						<div class="flex items-center gap-2 border-b border-white/10 bg-slate-950 px-4 py-3">
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
									class="absolute inset-0 [background-image:linear-gradient(120deg,rgba(249,115,22,0.26),transparent_42%),linear-gradient(45deg,rgba(20,184,166,0.2),transparent_56%)] opacity-40"
								></div>
								<div class="relative flex h-full flex-col items-center justify-center text-center">
									<div
										class="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10"
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

					<div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
						{#each content.hero.highlights as item}
							<div class="rounded-lg border border-white/10 bg-white/[0.06] p-4">
								<div class="text-xs font-semibold text-slate-400">{item.symbol}</div>
								<div class="mt-1 text-2xl font-black text-emerald-300">{item.performance}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'authority'}
		<section class="bg-white py-20 dark:bg-gray-950">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
					<div>
						<h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
							{content.authority.title}
						</h2>
						<p class="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
							{content.authority.description}
						</p>
					</div>

					<div class="grid gap-4 sm:grid-cols-2">
						{#each content.authority.activities as item}
							<div
								class="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
							>
								{#if item.image}
									<div
										class="mb-4 aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-slate-700"
									>
										<img src={item.image} alt={item.title} class="h-full w-full object-cover" />
									</div>
								{:else}
									<div
										class="mb-4 aspect-video rounded-md border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
									></div>
								{/if}
								<h3 class="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
								<p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
									{item.description}
								</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'valueProps'}
		<section class="bg-slate-50 py-20 dark:bg-slate-900" id="program">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mx-auto mb-12 max-w-3xl text-center">
					<h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
						{content.valueProps.title}
					</h2>
				</div>

				<div class="grid gap-5 md:grid-cols-3">
					{#each content.valueProps.items as item}
						<div
							class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
						>
							<h3 class="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
							<p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
								{item.description}
							</p>
						</div>
					{/each}
				</div>

				{#if content.valueProps.docImages.length > 0}
					<div
						class="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
					>
						<div class="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
							<div class="p-6 sm:p-8">
								<h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">
									{content.valueProps.docTitle}
								</h3>
								<p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
									{content.valueProps.docDescription}
								</p>
							</div>
							<div class="grid grid-cols-2 gap-3 bg-slate-100 p-4 dark:bg-slate-900">
								{#each content.valueProps.docImages as img}
									<div
										class="aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
									>
										<img
											src={img}
											alt={content.valueProps.docTitle}
											class="h-full w-full object-cover"
										/>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</section>
	{/if}

	{#if sectionId === 'testimonials'}
		<section class="bg-white py-20 dark:bg-gray-950" id="testimonials">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mb-12 max-w-3xl">
					<h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
						{content.testimonials.title}
					</h2>
					<p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
						{content.testimonials.description}
					</p>
				</div>

				<div class="grid gap-5 md:grid-cols-3">
					{#each content.testimonials.items as item}
						<div
							class="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"
						>
							<div
								class="mb-5 h-32 rounded-md border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
							>
								<div class="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800"></div>
								<div class="mt-4 h-3 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
								<div class="mt-3 h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
								<div class="mt-5 h-8 w-24 rounded bg-emerald-100 dark:bg-emerald-950"></div>
							</div>
							<h3 class="text-lg font-bold text-slate-900 dark:text-white">"{item.title}"</h3>
							<p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
								{item.description}
							</p>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'usp'}
		<section class="bg-slate-950 py-20 text-white">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
					<div>
						<h2 class="text-3xl font-extrabold sm:text-4xl">
							{content.usp.title}
						</h2>
						<blockquote
							class="mt-8 border-l-4 border-orange-500 pl-5 text-lg leading-8 font-semibold text-slate-200"
						>
							{content.usp.quote}
						</blockquote>
					</div>

					<div class="grid gap-4 sm:grid-cols-2">
						{#each content.usp.items as item}
							<div class="rounded-lg border border-white/10 bg-white/[0.04] p-5">
								<h3 class="text-lg font-bold text-white">{item.title}</h3>
								<p class="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'pricing'}
		<section class="bg-white py-20 dark:bg-gray-950" id="pricing">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
					<div>
						<h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
							{content.pricing.title}
						</h2>
						<p class="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
							{content.pricing.description}
						</p>
						<div class="mt-8 grid gap-4 sm:grid-cols-2">
							{#each content.pricing.benefitCards as card, cardIndex}
								<div class="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
									<p class="text-sm font-bold text-slate-500">{card.title}</p>
									<ul class="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
										{#each card.items as point}
											<li class="flex gap-3">
												<span
													class="mt-1 h-2 w-2 rounded-full {cardIndex % 2 === 0
														? 'bg-orange-500'
														: 'bg-teal-500'}"
												></span>
												{point}
											</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>
					</div>

					<div
						class="rounded-lg border border-orange-200 bg-orange-50 p-6 shadow-xl shadow-orange-950/10 dark:border-orange-900/60 dark:bg-orange-950/20"
					>
						<div class="flex items-end gap-3">
							<span class="text-lg font-bold text-slate-500 line-through"
								>{content.pricing.originalPrice}</span
							>
						</div>
						<div class="mt-2 text-5xl font-black text-slate-900 dark:text-white">
							{content.pricing.price}
						</div>
						<p class="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
							{content.pricing.note}
						</p>
						<a
							href={whatsappUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-orange-500 active:scale-95"
						>
							{content.pricing.ctaLabel}
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
		</section>
	{/if}

	{#if sectionId === 'curriculum'}
		<section class="bg-slate-50 py-20 dark:bg-slate-900" id="curriculum">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mx-auto mb-12 max-w-4xl text-center">
					<h2
						class="text-3xl leading-tight font-extrabold text-slate-900 sm:text-5xl dark:text-white"
					>
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
					<div class="relative">
						<div
							class="pointer-events-none absolute top-16 right-10 left-10 hidden h-px bg-gradient-to-r from-orange-200 via-slate-300 to-teal-200 xl:block dark:from-orange-900/70 dark:via-slate-700 dark:to-teal-900/60"
						></div>
						<div class="relative grid gap-6 md:grid-cols-2 xl:grid-cols-4">
							{#each content.curriculum.schedule as day, dayIndex}
								<div
									class="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 dark:border-slate-700 dark:bg-slate-950"
								>
									<div class="flex items-start justify-between gap-4">
										<div class="min-w-0">
											<p class="text-xs font-black tracking-[0.18em] text-orange-600 uppercase">
												Hari {dayIndex + 1}
											</p>
											<h3
												class="mt-2 text-2xl leading-tight font-extrabold break-words text-slate-900 dark:text-white"
											>
												{day.stage}
											</h3>
										</div>
										<span
											class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-sm font-black text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-300"
										>
											{String(dayIndex + 1).padStart(2, '0')}
										</span>
									</div>

									<p
										class="mt-5 border-b border-slate-100 pb-5 text-[15px] leading-6 font-bold text-slate-600 dark:border-slate-800 dark:text-slate-300"
									>
										{day.date}
									</p>

									<ol class="mt-6 space-y-5">
										{#each day.sessions as session, sessionIndex}
											<li class="flex gap-3">
												<span
													class="mt-0.5 inline-flex h-8 min-w-16 shrink-0 items-center justify-center rounded-md bg-slate-900 px-3 text-xs font-black text-white dark:bg-orange-600"
												>
													Sesi {sessionIndex + 1}
												</span>
												<div class="min-w-0">
													<p
														class="text-[15px] leading-7 font-bold break-words text-slate-800 dark:text-white"
													>
														{session}
													</p>
													{#if day.sessionSpeakers?.[sessionIndex]}
														<p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
															oleh {day.sessionSpeakers[sessionIndex]}
														</p>
													{/if}
												</div>
											</li>
										{/each}
									</ol>

									{#if day.outcome}
										<div class="mt-auto border-t border-slate-100 pt-6 dark:border-slate-800">
											<p
												class="text-[11px] font-black tracking-[0.16em] text-teal-700 uppercase dark:text-teal-300"
											>
												Outcome
											</p>
											<p class="mt-3 text-[15px] leading-8 text-slate-700 dark:text-slate-300">
												{day.outcome}
											</p>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{#each content.curriculum.topics as topic, index}
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

				<div class="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800">
					<div class="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
						{#if content.curriculum.outcomes.length > 0}
							<div>
								<h3
									class="text-2xl leading-tight font-extrabold text-slate-900 sm:text-3xl dark:text-white"
								>
									Setelah mengikuti bootcamp, peserta diharapkan mampu:
								</h3>
								<ul
									class="mt-7 grid gap-4 text-base leading-8 text-slate-700 sm:grid-cols-2 dark:text-slate-200"
								>
									{#each content.curriculum.outcomes as outcome}
										<li class="flex gap-3">
											<svg
												class="mt-1.5 h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400"
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
											<span>{outcome}</span>
										</li>
									{/each}
								</ul>
								{#if content.curriculum.disclaimer}
									<p class="mt-6 text-xs leading-6 text-slate-500 dark:text-slate-500">
										{content.curriculum.disclaimer}
									</p>
								{/if}
							</div>
						{/if}

						<div
							class="rounded-lg border border-slate-200 bg-slate-950 p-7 text-white shadow-xl shadow-slate-950/10 dark:border-orange-900/40"
						>
							<h3 class="text-2xl leading-snug font-extrabold">
								{content.curriculum.ctaTitle}
							</h3>
							<p class="mt-3 text-[15px] leading-8 text-slate-300">
								{content.curriculum.ctaDescription}
							</p>
							<div class="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
								<a
									href={resolveCtaHref(content.curriculum.primaryCta)}
									target={isExternalHref(resolveCtaHref(content.curriculum.primaryCta))
										? '_blank'
										: undefined}
									rel={isExternalHref(resolveCtaHref(content.curriculum.primaryCta))
										? 'noopener noreferrer'
										: undefined}
									class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3.5 text-sm font-bold whitespace-nowrap text-white transition hover:bg-orange-500 active:scale-95"
								>
									{content.curriculum.primaryCta.label}
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
									href={resolveCtaHref(content.curriculum.secondaryCta)}
									target={isExternalHref(resolveCtaHref(content.curriculum.secondaryCta))
										? '_blank'
										: undefined}
									rel={isExternalHref(resolveCtaHref(content.curriculum.secondaryCta))
										? 'noopener noreferrer'
										: undefined}
									class="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-5 py-3.5 text-sm font-bold whitespace-nowrap text-white transition hover:border-orange-300 hover:bg-white/10"
								>
									{content.curriculum.secondaryCta.label}
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'instructors'}
		<section class="bg-white py-20 dark:bg-gray-950" id="instructors">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mb-12 max-w-4xl">
					{#if content.instructors.eyebrow}
						<p class="mb-4 text-xs font-black tracking-[0.22em] text-orange-600 uppercase">
							{content.instructors.eyebrow}
						</p>
					{/if}
					<h2
						class="text-3xl leading-tight font-extrabold text-slate-900 sm:text-4xl dark:text-white"
					>
						{content.instructors.title}
					</h2>
					<p class="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
						{content.instructors.description}
					</p>
				</div>

				<div class="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
					{#each content.instructors.items as instructor}
						<div
							class="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-orange-200 hover:shadow-lg hover:shadow-orange-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-900/70"
						>
							<div
								class="aspect-[4/3] overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-orange-50/40 to-slate-100 dark:border-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
							>
								<img
									src={instructor.photo}
									alt={instructor.name}
									class="h-full w-full object-cover object-[center_22%] brightness-[1.03] contrast-[1.04] saturate-[0.96]"
								/>
							</div>
							<div class="flex flex-1 flex-col p-6">
								<p
									class="mb-5 inline-flex w-fit rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-sm leading-5 font-bold text-orange-700 dark:border-orange-700/70 dark:bg-orange-500/10 dark:text-orange-200"
								>
									{instructor.badge}
								</p>
								<h3
									class="text-2xl leading-snug font-extrabold break-words text-slate-900 dark:text-white"
								>
									{instructor.name}
								</h3>
								<p class="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
									{instructor.credentials}
								</p>
								<p class="mt-2 text-base font-bold text-orange-600 dark:text-orange-400">
									{instructor.role}
								</p>

								<div class="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
									<h4
										class="text-xs font-black tracking-[0.14em] text-slate-600 uppercase dark:text-slate-300"
									>
										Kredensial Utama
									</h4>
									<ul class="mt-3 space-y-2.5">
										{#each instructor.highlights as highlight}
											<li
												class="flex gap-3 text-[15px] leading-7 text-slate-700 dark:text-slate-200"
											>
												<svg
													class="mt-1 h-3.5 w-3.5 shrink-0 text-orange-600 dark:text-orange-400"
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

								<div class="mt-5">
									<h4
										class="text-xs font-black tracking-[0.14em] text-slate-600 uppercase dark:text-slate-300"
									>
										Fokus Materi
									</h4>
									<p class="mt-3 text-[15px] leading-8 text-slate-600 dark:text-slate-300">
										{instructor.description}
									</p>
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
								href={content.instructors.primaryCta.href}
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
								rel="noopener noreferrer"
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
		<section class="bg-orange-600 py-16 text-white">
			<div
				class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8"
			>
				<div>
					<h2 class="text-3xl font-extrabold sm:text-4xl">{content.urgency.title}</h2>
					<p class="mt-3 max-w-2xl text-sm leading-7 text-orange-50">
						{content.urgency.description}
					</p>
				</div>
				<a
					href={whatsappUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-sm font-bold text-orange-700 transition hover:bg-orange-50 active:scale-95 sm:w-auto"
				>
					{content.urgency.ctaLabel}
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

	{#if sectionId === 'faq'}
		<section class="bg-white py-20 dark:bg-gray-950" id="faq">
			<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<div class="mb-10 text-center">
					<h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
						{content.faq.title}
					</h2>
				</div>

				<div class="space-y-3">
					{#each content.faq.items as faq, index}
						<div class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
							<button
								type="button"
								onclick={() => toggleFaq(index)}
								class="flex w-full items-center justify-between gap-4 bg-slate-50 px-5 py-5 text-left transition hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
								aria-expanded={openFaqIndex === index}
							>
								<span class="font-bold text-slate-900 dark:text-white">{faq.question}</span>
								<svg
									class="h-5 w-5 shrink-0 text-slate-500 transition {openFaqIndex === index
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
									<p class="text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	{#if sectionId === 'finalCta'}
		<section class="bg-slate-950 py-20 text-white">
			<div class="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
				<h2 class="text-4xl leading-tight font-black sm:text-5xl">
					{content.finalCta.title}
				</h2>
				<p class="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
					{content.finalCta.description}
				</p>
				<a
					href={whatsappUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-orange-500 active:scale-95"
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
