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
		description: 'Dalam materi ini, kita akan mempelajari dasar-dasar cryptocurrency dari perspektif syariah. Kita akan memahami konsep blockchain, bagaimana transaksi crypto bekerja, dan analisis hukum syariah terhadap aset digital. Kemudian, kita akan mempelajari perbedaan antara crypto yang halal dan haram serta cara mengidentifikasinya.',
		videoUrl: 'https://www.youtube.com/embed/rYQgy8QDEBI',
		materials: [
			{ id: 'pre-test', title: 'Pre-Test', type: 'quiz', duration: '5 min' },
			{ id: 'intro-blockchain', title: 'Introduction to Blockchain', type: 'video', duration: '8 min' },
			{ id: 'crypto-basics', title: 'Dasar-Dasar Cryptocurrency', type: 'video', duration: '12 min' },
			{ id: 'hukum-syariah', title: 'Hukum Syariah Aset Digital', type: 'video', duration: '15 min' },
			{ id: 'halal-haram', title: 'Identifikasi Crypto Halal & Haram', type: 'video', duration: '10 min' },
			{ id: 'studi-kasus', title: 'Studi Kasus', type: 'video', duration: '7 min' },
			{ id: 'post-test', title: 'Post-Test', type: 'quiz', duration: '5 min' }
		],
		tags: ['Modul Praktik', 'Bahan Bacaan Wajib (± 5 menit)', 'Beri Feedback', 'Study Plan', 'Grup Diskusi'],
		progress: 14,
		completedVideos: 0,
		totalVideos: 5,
		rating: 4.67,
		reviews: [
			{ name: 'Aisyah Rahmawati', date: '2 Mei 2026', rating: 5, text: 'Penjelasan mudah diterima dan sangat relevan untuk memahami crypto dari perspektif syariah.' },
			{ name: 'Budi Santoso', date: '28 April 2026', rating: 5, text: 'Materi yang sangat dibutuhkan. Singkat, jelas, dan memberikan studi kasus nyata.' },
			{ name: 'Farah Azzahra', date: '25 April 2026', rating: 4, text: 'Bagus untuk pemula. Penjelasan hukum syariah-nya sangat membantu saya memilih aset yang tepat.' },
			{ name: 'Rizky Pratama', date: '20 April 2026', rating: 5, text: 'Materi yang padat dan praktis. Sangat direkomendasikan untuk siapapun yang ingin masuk dunia crypto syariah.' }
		],
		relatedCourses: [
			{ title: 'DeFi & Keuangan Syariah', videos: 5, views: 36213, rating: 4.63, progress: 0, color: 'from-teal-500 to-emerald-600' },
			{ title: 'Smart Contract Halal', videos: 3, views: 24449, rating: 4.62, progress: 0, color: 'from-blue-500 to-indigo-600' },
			{ title: 'Analisis Tokenomics', videos: 3, views: 18359, rating: 4.63, progress: 0, color: 'from-purple-500 to-violet-600' },
			{ title: 'NFT dalam Islam', videos: 3, views: 16695, rating: 4.61, progress: 0, color: 'from-orange-500 to-red-600' }
		]
	};

	let activeMaterialId = $state('intro-blockchain');
	let isSaved = $state(false);

	const activeMaterial = $derived(course.materials.find(m => m.id === activeMaterialId));

	function renderStars(rating: number): string {
		return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
	}
</script>

<svelte:head>
	<title>{course.title} | CryptoSharia Academy</title>
</svelte:head>

<div class="bg-white dark:bg-gray-950 min-h-screen pt-16">
	<!-- Video + Sidebar (side by side) -->
	<div style="display: flex; flex-direction: row;">
		<!-- Video Player (left) -->
		<div style="flex: 1; min-width: 0;" class="bg-gray-900">
			<div style="height: calc(100vh - 4rem);">
				<iframe
					src={course.videoUrl}
					title={activeMaterial?.title || course.title}
					class="w-full h-full"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			</div>
		</div>

		<!-- Material Sidebar (right, fixed width) -->
		<div style="width: 320px; flex-shrink: 0; position: sticky; top: 4rem; height: calc(100vh - 4rem);" class="bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
			<div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
				<h3 class="font-bold text-sm text-gray-900 dark:text-white">Materi</h3>
			</div>
			<div class="divide-y divide-gray-100 dark:divide-gray-800">
				{#each course.materials as material, i}
					<button
						onclick={() => { activeMaterialId = material.id; }}
						class="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all {activeMaterialId === material.id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-3 border-primary-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}"
					>
						<div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs {activeMaterialId === material.id ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}">
							{#if material.type === 'quiz'}
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
							{:else}
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
							{/if}
						</div>
						<div class="flex-1 min-w-0">
							<span class="text-sm font-medium {activeMaterialId === material.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'} block">{material.title}</span>
							<span class="text-[11px] text-gray-400 dark:text-gray-500">{material.duration}</span>
						</div>
						<input type="checkbox" class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 cursor-pointer" />
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Content Below Video -->
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

		<!-- Breadcrumb + Title -->
		<div>
			<nav class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-4">
				{#each course.category as cat, i}
					<span>{cat}</span>
					{#if i < course.category.length - 1}<span>›</span>{/if}
				{/each}
			</nav>
			<div class="flex items-start justify-between gap-4">
				<div>
					<h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">{course.title}</h1>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.instructor}</p>
				</div>
				<button onclick={() => { isSaved = !isSaved; }} class="flex-shrink-0 p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800" title="Simpan">
					<svg class="w-6 h-6 {isSaved ? 'text-primary-600 fill-primary-600' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
				</button>
			</div>
			<p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-4">{course.description}</p>
		</div>

		<!-- Tags -->
		<div>
			<h3 class="font-bold text-sm text-gray-900 dark:text-white mb-3">Dalam Materi Ini</h3>
			<div class="flex flex-wrap gap-2">
				{#each course.tags as tag}
					<span class="px-4 py-2 rounded-full bg-primary-600 text-white text-xs font-semibold">{tag}</span>
				{/each}
			</div>
		</div>

		<!-- Progress & Sertifikat -->
		<div class="grid sm:grid-cols-2 gap-8">
			<div>
				<h2 class="text-xl font-extrabold text-gray-900 dark:text-white mb-4">Progress & Sertifikat 🎓</h2>
				<a href="/profile" class="text-primary-600 dark:text-primary-400 font-semibold text-sm hover:underline">Sertifikat Materi</a>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">Kamu baru menyelesaikan {course.completedVideos} dari {course.totalVideos} video. Selesaikan progress dengan menyelesaikan semua video, pre-test dan post-test (skor minimal 75) dalam materi ini.</p>
				<div class="mt-4">
					<div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
						<span>Progress</span>
						<span>{course.progress}%</span>
					</div>
					<div class="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div class="h-full bg-primary-600 rounded-full transition-all" style="width: {course.progress}%"></div>
					</div>
				</div>
				<div class="flex flex-wrap gap-2 mt-4">
					<button class="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">Dapatkan Sertifikat</button>
					<button class="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">Upload ke LinkedIn</button>
					<a href="/bootcamp" class="px-4 py-2 rounded-lg bg-primary-600 text-xs font-bold text-white hover:bg-primary-700">Join Bootcamp</a>
				</div>
			</div>
			<div class="space-y-6">
				<div>
					<div class="flex items-center justify-between mb-1">
						<span class="text-sm font-semibold text-gray-900 dark:text-white">Progress Topik: Crypto Syariah</span>
						<span class="text-xs text-gray-400">0%</span>
					</div>
					<div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div class="h-full bg-primary-600 rounded-full" style="width: 0%"></div></div>
					<button class="mt-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20">Lihat Topik</button>
				</div>
				<div>
					<div class="flex items-center justify-between mb-1">
						<span class="text-sm font-semibold text-gray-900 dark:text-white">Progress Learning Path: Blockchain Syariah</span>
						<span class="text-xs text-gray-400">0%</span>
					</div>
					<div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div class="h-full bg-primary-600 rounded-full" style="width: 0%"></div></div>
					<button class="mt-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20">Lihat Learning Path</button>
				</div>
			</div>
		</div>

		<!-- Rating Materi -->
		<div>
			<h2 class="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Rating Materi</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each course.reviews as review}
					<div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
						<div class="font-bold text-sm text-gray-900 dark:text-white mb-1">{review.name}</div>
						<div class="flex items-center gap-2 mb-2">
							<span class="text-yellow-400 text-xs">{renderStars(review.rating)}</span>
							<span class="text-[10px] text-gray-400">📅 {review.date}</span>
						</div>
						<p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{review.text}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Rekomendasi Kelas Lainnya -->
		<div>
			<h2 class="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Rekomendasi Kelas Lainnya</h2>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Pelajari skill melalui serial short video + mini quiz dengan learning path dan topik yang terstruktur.</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{#each course.relatedCourses as related, i}
					<a href="/e-learning" class="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
						<div class="aspect-[4/3] bg-gradient-to-br {related.color} p-5 flex flex-col justify-end">
							<h3 class="text-white font-extrabold text-lg leading-tight">{related.title}</h3>
						</div>
						<div class="p-4 space-y-2">
							<div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
								<span>🎬 {related.videos}</span>
								<span>👁 {related.views.toLocaleString('id-ID')}</span>
								<span>⭐ {related.rating}</span>
							</div>
							<div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
								<div class="h-full bg-primary-600 rounded-full" style="width: {related.progress}%"></div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
