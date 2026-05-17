<script lang="ts">
	import { page } from '$app/state';
	import { userAuth } from '$lib/auth.svelte';
	import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { onMount } from 'svelte';

	let hasAccess = $state(false);
	// Check user subscription status from users collection (set by admin on approval)
	$effect(() => {
		if (!userAuth.isLoggedIn) { hasAccess = false; return; }
		(async () => {
			try {
				const userDoc = await getDoc(doc(db, 'users', userAuth.user.uid));
				if (userDoc.exists()) {
					const data = userDoc.data();
					if (data.subscriptionStatus === 'active' && data.subscriptionExpiry) {
						const expiry = data.subscriptionExpiry instanceof Timestamp
							? data.subscriptionExpiry.toDate()
							: new Date(data.subscriptionExpiry);
						hasAccess = expiry > new Date();
					} else {
						hasAccess = false;
					}
				} else {
					hasAccess = false;
				}
			} catch (e) {
				console.error('Failed to check subscription:', e);
				hasAccess = false;
			}
		})();
	});

	interface Lesson {
		title: string;
		videoUrl: string;
		type: string;
		duration: string;
	}

	interface Course {
		id: string;
		title: string;
		description: string;
		topics: number;
		duration: string;
		category: string;
		image: string;
		lessons: Lesson[];
	}

	let course = $state<Course | null>(null);
	let isLoading = $state(true);
	let notFound = $state(false);
	let activeLessonIndex = $state(0);

	const activeLesson = $derived(course?.lessons?.[activeLessonIndex] || null);
	const activeVideoUrl = $derived(activeLesson?.videoUrl || '');

	onMount(async () => {
		const id = page.params.id;
		try {
			const snap = await getDoc(doc(db, 'elearning_courses', id));
			if (snap.exists()) {
				course = { id: snap.id, ...snap.data() } as Course;
				if (!course.lessons) course.lessons = [];
				if (!course.description) course.description = '';
			} else {
				notFound = true;
			}
		} catch (error) {
			console.error('Failed to fetch course:', error);
			notFound = true;
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>{course?.title || 'Detail Materi'} | CryptoSharia Academy</title>
</svelte:head>

<style>
	.course-layout {
		display: flex;
		flex-direction: row;
		height: calc(100vh - 4rem);
	}
	.video-panel {
		flex: 1;
		min-width: 0;
		background: #111827;
	}
	.video-panel iframe, .video-panel .video-placeholder {
		width: 100%;
		height: 100%;
	}
	.sidebar-panel {
		width: 340px;
		flex-shrink: 0;
		overflow-y: auto;
		border-left: 1px solid rgba(255,255,255,0.08);
	}
	@media (max-width: 768px) {
		.course-layout {
			flex-direction: column;
			height: auto;
		}
		.video-panel {
			aspect-ratio: 16/9;
		}
		.sidebar-panel {
			width: 100%;
			border-left: none;
			border-top: 1px solid rgba(255,255,255,0.08);
			max-height: 40vh;
		}
	}
</style>

{#if isLoading}
	<div class="min-h-screen flex items-center justify-center bg-gray-950">
		<svg class="animate-spin w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
	</div>

{:else if notFound || !course}
	<div class="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4">
		<div class="text-6xl mb-4">📭</div>
		<h1 class="text-2xl font-extrabold text-white mb-2">Materi Tidak Ditemukan</h1>
		<p class="text-sm text-gray-400 mb-6">Halaman yang Anda cari tidak tersedia atau sudah dihapus.</p>
		<a href="/e-learning" class="inline-flex items-center rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 transition-all">← Kembali ke E-Learning</a>
	</div>

{:else}
	<div class="bg-gray-950 min-h-screen pt-16">
		{#if course.lessons.length > 0}
			<!-- Video + Sidebar: forced side-by-side via plain CSS -->
			<div class="course-layout">
				<!-- Video Player (LEFT) -->
				<div class="video-panel">
					{#if userAuth.isLoggedIn && hasAccess}
						{#if activeVideoUrl}
							<iframe
								src={activeVideoUrl}
								title={activeLesson?.title || course.title}
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
							></iframe>
						{:else}
							<div class="video-placeholder flex items-center justify-center text-gray-500">
								<div class="text-center">
									<svg class="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
									<p class="text-sm">Video belum tersedia</p>
								</div>
							</div>
						{/if}
					{:else}
						<div class="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-800/50">
							<p class="text-white mb-4">Anda harus berlangganan untuk menonton video materi ini.</p>
							<a href="/payment/e-learning/{course.id}" class="inline-flex items-center rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition">Berlangganan Sekarang</a>
						</div>
					{/if}
				</div>

				<!-- Lesson List Sidebar (RIGHT) -->
				<div class="sidebar-panel bg-gray-900">
					<div class="px-4 py-3 border-b border-gray-800">
						<h3 class="font-bold text-sm text-white">Materi ({course.lessons.length})</h3>
					</div>
					<div class="divide-y divide-gray-800">
						{#each course.lessons as lesson, i}
							<button
								onclick={() => { activeLessonIndex = i; }}
								class="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all cursor-pointer {activeLessonIndex === i ? 'bg-primary-900/30 border-l-3 border-primary-500' : 'hover:bg-gray-800'}"
							>
								<div class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs {activeLessonIndex === i ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400'}">
									{#if lesson.type === 'quiz'}
										<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
									{:else if lesson.type === 'reading'}
										<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
									{:else}
										<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
									{/if}
								</div>
								<div class="flex-1 min-w-0">
									<span class="text-sm font-medium {activeLessonIndex === i ? 'text-primary-400' : 'text-gray-300'} block truncate">{lesson.title}</span>
									<span class="text-[11px] text-gray-500">{lesson.duration}</span>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			<!-- No lessons: cover image hero -->
			<div class="relative h-72 sm:h-96 bg-gray-900">
				<img src={course.image || '/background-beranda.png'} alt={course.title} class="w-full h-full object-cover opacity-50" />
				<div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
				<div class="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
					<span class="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-md mb-3">{course.category}</span>
					<h1 class="text-3xl sm:text-4xl font-extrabold text-white">{course.title}</h1>
				</div>
			</div>
		{/if}

		<!-- Content Below -->
		<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
			<!-- Breadcrumb -->
			<nav class="flex items-center gap-2 text-xs text-gray-500">
				<a href="/e-learning" class="hover:text-primary-400 transition-colors">E-Learning</a>
				<span>›</span>
				<span>{course.category}</span>
				<span>›</span>
				<span class="text-gray-300">{course.title}</span>
			</nav>

			<!-- Title + Info -->
			<div>
				<h1 class="text-xl sm:text-2xl font-extrabold text-white mb-2">{course.title}</h1>
				<div class="flex flex-wrap items-center gap-4 text-sm text-gray-400">
					<span class="flex items-center gap-1.5">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
						{course.topics} Topik
					</span>
					<span class="flex items-center gap-1.5">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
						{course.duration}
					</span>
					<span class="flex items-center gap-1.5">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
						{course.lessons.length} Video
					</span>
					<span class="px-2.5 py-0.5 rounded-md bg-gray-800 text-gray-300 text-xs font-bold">{course.category}</span>
				</div>
			</div>

			<!-- Description -->
			{#if course.description}
				<div class="bg-gray-900 rounded-xl p-5 border border-gray-800">
					<h3 class="font-bold text-sm text-white mb-2">Tentang Materi Ini</h3>
					<p class="text-sm text-gray-400 leading-relaxed">{course.description}</p>
				</div>
			{/if}

			<!-- Back link -->
			<div>
				<a href="/e-learning" class="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-400 transition-colors">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
					Kembali ke Katalog E-Learning
				</a>
			</div>
		</div>
	</div>
{/if}
