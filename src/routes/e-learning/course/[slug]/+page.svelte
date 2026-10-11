<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { userAuth } from '$lib/auth.svelte';

	const slug = $derived(page.params.slug);

	// Mock course data — in production, fetch from Firestore by slug
	const course = {
		title: 'Pengantar Crypto Syariah',
		instructor: 'Ahmad Fauzi - Blockchain Researcher at CryptoSharia Lab',
		category: ['Blockchain', 'Crypto Syariah', 'Pengantar Crypto Syariah'],
		description:
			'Dalam materi ini, kita akan mempelajari dasar-dasar cryptocurrency dari perspektif syariah. Kita akan memahami konsep blockchain, bagaimana transaksi crypto bekerja, dan analisis hukum syariah terhadap aset digital. Kemudian, kita akan mempelajari perbedaan antara crypto yang halal dan haram serta cara mengidentifikasinya.',
		videoUrl: 'https://www.youtube.com/embed/rYQgy8QDEBI',
		materials: [
			{ id: 'pre-test', title: 'Pre-Test', type: 'quiz', duration: '5 min' },
			{
				id: 'intro-blockchain',
				title: 'Introduction to Blockchain',
				type: 'video',
				duration: '8 min'
			},
			{
				id: 'crypto-basics',
				title: 'Dasar-Dasar Cryptocurrency',
				type: 'video',
				duration: '12 min'
			},
			{
				id: 'hukum-syariah',
				title: 'Hukum Syariah Aset Digital',
				type: 'video',
				duration: '15 min'
			},
			{
				id: 'halal-haram',
				title: 'Identifikasi Crypto Halal & Haram',
				type: 'video',
				duration: '10 min'
			},
			{ id: 'studi-kasus', title: 'Studi Kasus', type: 'video', duration: '7 min' },
			{ id: 'post-test', title: 'Post-Test', type: 'quiz', duration: '5 min' }
		],
		tags: [
			'Modul Praktik',
			'Bahan Bacaan Wajib (± 5 menit)',
			'Beri Feedback',
			'Study Plan',
			'Grup Diskusi'
		],
		progress: 14,
		completedVideos: 0,
		totalVideos: 5,
		rating: 4.67,
		reviews: [
			{
				name: 'Aisyah Rahmawati',
				date: '2 Mei 2026',
				rating: 5,
				text: 'Penjelasan mudah diterima dan sangat relevan untuk memahami crypto dari perspektif syariah.'
			},
			{
				name: 'Budi Santoso',
				date: '28 April 2026',
				rating: 5,
				text: 'Materi yang sangat dibutuhkan. Singkat, jelas, dan memberikan studi kasus nyata.'
			},
			{
				name: 'Farah Azzahra',
				date: '25 April 2026',
				rating: 4,
				text: 'Bagus untuk pemula. Penjelasan hukum syariah-nya sangat membantu saya memilih aset yang tepat.'
			},
			{
				name: 'Rizky Pratama',
				date: '20 April 2026',
				rating: 5,
				text: 'Materi yang padat dan praktis. Sangat direkomendasikan untuk siapapun yang ingin masuk dunia crypto syariah.'
			}
		],
		relatedCourses: [
			{
				title: 'DeFi & Keuangan Syariah',
				videos: 5,
				views: 36213,
				rating: 4.63,
				progress: 0,
				color: 'from-teal-500 to-emerald-600'
			},
			{
				title: 'Smart Contract Halal',
				videos: 3,
				views: 24449,
				rating: 4.62,
				progress: 0,
				color: 'from-blue-500 to-indigo-600'
			},
			{
				title: 'Analisis Tokenomics',
				videos: 3,
				views: 18359,
				rating: 4.63,
				progress: 0,
				color: 'from-purple-500 to-violet-600'
			},
			{
				title: 'NFT dalam Islam',
				videos: 3,
				views: 16695,
				rating: 4.61,
				progress: 0,
				color: 'from-orange-500 to-red-600'
			}
		]
	};

	let activeMaterialId = $state('intro-blockchain');
	let isSaved = $state(false);

	const activeMaterial = $derived(course.materials.find((m) => m.id === activeMaterialId));

	function renderStars(rating: number): string {
		return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
	}
</script>

<svelte:head>
	<title>{course.title} | CryptoSharia Academy</title>
</svelte:head>

<div class="min-h-screen bg-white pt-16 dark:bg-gray-950">
	<!-- Video + Sidebar (side by side) -->
	<div style="display: flex; flex-direction: row;">
		<!-- Video Player (left) -->
		<div style="flex: 1; min-width: 0;" class="bg-gray-900">
			<div style="height: calc(100vh - 4rem);">
				<iframe
					src={course.videoUrl}
					title={activeMaterial?.title || course.title}
					class="h-full w-full"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			</div>
		</div>

		<!-- Material Sidebar (right, fixed width) -->
		<div
			style="width: 320px; flex-shrink: 0; position: sticky; top: 4rem; height: calc(100vh - 4rem);"
			class="overflow-y-auto border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
				<h3 class="text-sm font-bold text-gray-900 dark:text-white">Materi</h3>
			</div>
			<div class="divide-y divide-gray-100 dark:divide-gray-800">
				{#each course.materials as material, i}
					<button
						onclick={() => {
							activeMaterialId = material.id;
						}}
						class="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all {activeMaterialId ===
						material.id
							? 'bg-primary-50 dark:bg-primary-900/20 border-primary-600 border-l-3'
							: 'hover:bg-gray-50 dark:hover:bg-gray-800'}"
					>
						<div
							class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs {activeMaterialId ===
							material.id
								? 'bg-primary-600 text-white'
								: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}"
						>
							{#if material.type === 'quiz'}
								<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/></svg
								>
							{:else}
								<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
									/><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/></svg
								>
							{/if}
						</div>
						<div class="min-w-0 flex-1">
							<span
								class="text-sm font-medium {activeMaterialId === material.id
									? 'text-primary-600 dark:text-primary-400'
									: 'text-gray-700 dark:text-gray-300'} block">{material.title}</span
							>
							<span class="text-[11px] text-gray-400 dark:text-gray-500">{material.duration}</span>
						</div>
						<input
							type="checkbox"
							class="text-primary-600 h-4 w-4 cursor-pointer rounded border-gray-300 dark:border-gray-600"
						/>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Content Below Video -->
	<div class="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
		<!-- Breadcrumb + Title -->
		<div>
			<nav class="mb-4 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
				{#each course.category as cat, i}
					<span>{cat}</span>
					{#if i < course.category.length - 1}<span>›</span>{/if}
				{/each}
			</nav>
			<div class="flex items-start justify-between gap-4">
				<div>
					<h1 class="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
						{course.title}
					</h1>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{course.instructor}</p>
				</div>
				<button
					onclick={() => {
						isSaved = !isSaved;
					}}
					class="flex-shrink-0 rounded-lg p-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
					title="Simpan"
				>
					<svg
						class="h-6 w-6 {isSaved ? 'text-primary-600 fill-primary-600' : 'text-gray-400'}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
						/></svg
					>
				</button>
			</div>
			<p class="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
				{course.description}
			</p>
		</div>

		<!-- Tags -->
		<div>
			<h3 class="mb-3 text-sm font-bold text-gray-900 dark:text-white">Dalam Materi Ini</h3>
			<div class="flex flex-wrap gap-2">
				{#each course.tags as tag}
					<span class="bg-primary-600 rounded-full px-4 py-2 text-xs font-semibold text-white"
						>{tag}</span
					>
				{/each}
			</div>
		</div>

		<!-- Progress & Sertifikat -->
		<div class="grid gap-8 sm:grid-cols-2">
			<div>
				<h2 class="mb-4 text-xl font-extrabold text-gray-900 dark:text-white">
					Progress & Sertifikat 🎓
				</h2>
				<a
					href="/profile"
					class="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline"
					>Sertifikat Materi</a
				>
				<p class="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
					Kamu baru menyelesaikan {course.completedVideos} dari {course.totalVideos} video. Selesaikan
					progress dengan menyelesaikan semua video, pre-test dan post-test (skor minimal 75) dalam materi
					ini.
				</p>
				<div class="mt-4">
					<div
						class="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
					>
						<span>Progress</span>
						<span>{course.progress}%</span>
					</div>
					<div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
						<div
							class="bg-primary-600 h-full rounded-full transition-all"
							style="width: {course.progress}%"
						></div>
					</div>
				</div>
				<div class="mt-4 flex flex-wrap gap-2">
					<button
						class="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
						>Dapatkan Sertifikat</button
					>
					<button
						class="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
						>Upload ke LinkedIn</button
					>
					<a
						href="/bootcamp"
						class="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-xs font-bold text-white"
						>Join Bootcamp</a
					>
				</div>
			</div>
			<div class="space-y-6">
				<div>
					<div class="mb-1 flex items-center justify-between">
						<span class="text-sm font-semibold text-gray-900 dark:text-white"
							>Progress Topik: Crypto Syariah</span
						>
						<span class="text-xs text-gray-400">0%</span>
					</div>
					<div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
						<div class="bg-primary-600 h-full rounded-full" style="width: 0%"></div>
					</div>
					<button
						class="text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold dark:border-gray-700"
						>Lihat Topik</button
					>
				</div>
				<div>
					<div class="mb-1 flex items-center justify-between">
						<span class="text-sm font-semibold text-gray-900 dark:text-white"
							>Progress Learning Path: Blockchain Syariah</span
						>
						<span class="text-xs text-gray-400">0%</span>
					</div>
					<div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
						<div class="bg-primary-600 h-full rounded-full" style="width: 0%"></div>
					</div>
					<button
						class="text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold dark:border-gray-700"
						>Lihat Learning Path</button
					>
				</div>
			</div>
		</div>

		<!-- Rating Materi -->
		<div>
			<h2 class="mb-6 text-xl font-extrabold text-gray-900 dark:text-white">Rating Materi</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each course.reviews as review}
					<div
						class="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
					>
						<div class="mb-1 text-sm font-bold text-gray-900 dark:text-white">{review.name}</div>
						<div class="mb-2 flex items-center gap-2">
							<span class="text-xs text-yellow-400">{renderStars(review.rating)}</span>
							<span class="text-[10px] text-gray-400">📅 {review.date}</span>
						</div>
						<p class="line-clamp-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
							{review.text}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Rekomendasi Kelas Lainnya -->
		<div>
			<h2 class="mb-2 text-xl font-extrabold text-gray-900 dark:text-white">
				Rekomendasi Kelas Lainnya
			</h2>
			<p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
				Pelajari skill melalui serial short video + mini quiz dengan learning path dan topik yang
				terstruktur.
			</p>
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{#each course.relatedCourses as related, i}
					<a
						href="/subscription"
						class="group block overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
					>
						<div
							class="aspect-[4/3] bg-gradient-to-br {related.color} flex flex-col justify-end p-5"
						>
							<h3 class="text-lg leading-tight font-extrabold text-white">{related.title}</h3>
						</div>
						<div class="space-y-2 p-4">
							<div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
								<span>🎬 {related.videos}</span>
								<span>👁 {related.views.toLocaleString('id-ID')}</span>
								<span>⭐ {related.rating}</span>
							</div>
							<div class="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
								<div
									class="bg-primary-600 h-full rounded-full"
									style="width: {related.progress}%"
								></div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
