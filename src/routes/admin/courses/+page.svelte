<script lang="ts">
	import { goto } from '$app/navigation';
	import { userAuth } from '$lib/auth.svelte';
	import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { onMount } from 'svelte';

	const ADMIN_EMAILS = ['admin@cryptosharia.id'];

	let courses = $state<any[]>([]);
	let isLoading = $state(true);
	let isProcessing = $state(false);
	let isUploading = $state(false);
	
	let isModalOpen = $state(false);
	let modalMode = $state<'add' | 'edit'>('add');

	// Form state
	let formData = $state({
		id: '',
		title: '',
		description: '',
		topics: 0,
		duration: '',
		category: 'Blockchain',
		image: '',
		lessons: [] as { title: string; videoUrl: string; type: string; duration: string }[]
	});

	const categories = ['Blockchain', 'Syariah', 'Trading', 'DeFi', 'Development', 'Data & AI', 'Security'];

	const defaultCourses = [
		{ title: 'Blockchain & Crypto Fundamentals', topics: 24, duration: '8 Jam', category: 'Blockchain', image: '/background-beranda.png' },
		{ title: 'Fiqh Muamalah Digital', topics: 18, duration: '6 Jam', category: 'Syariah', image: '/background-beranda.png' },
		{ title: 'Crypto Trading Fundamental', topics: 22, duration: '7 Jam', category: 'Trading', image: '/background-beranda.png' },
		{ title: 'DeFi & Yield Farming Halal', topics: 16, duration: '5 Jam', category: 'DeFi', image: '/background-beranda.png' },
		{ title: 'Smart Contract & Solidity', topics: 30, duration: '12 Jam', category: 'Development', image: '/background-beranda.png' },
		{ title: 'Token Screening Syariah', topics: 14, duration: '4 Jam', category: 'Syariah', image: '/background-beranda.png' },
		{ title: 'Data Analysis for Crypto', topics: 20, duration: '8 Jam', category: 'Data & AI', image: '/background-beranda.png' },
		{ title: 'NFT Creation & Marketing', topics: 12, duration: '4 Jam', category: 'Blockchain', image: '/background-beranda.png' },
		{ title: 'Web3 Frontend Development', topics: 28, duration: '10 Jam', category: 'Development', image: '/background-beranda.png' },
		{ title: 'Crypto Wallet & Security', topics: 10, duration: '3 Jam', category: 'Security', image: '/background-beranda.png' },
		{ title: 'Technical Analysis Crypto', topics: 18, duration: '6 Jam', category: 'Trading', image: '/background-beranda.png' },
		{ title: 'AI & Machine Learning for Crypto', topics: 22, duration: '8 Jam', category: 'Data & AI', image: '/background-beranda.png' },
		{ title: 'Ekonomi Syariah & Fintech', topics: 16, duration: '5 Jam', category: 'Syariah', image: '/background-beranda.png' },
		{ title: 'Stablecoin & CBDC Analysis', topics: 12, duration: '4 Jam', category: 'Blockchain', image: '/background-beranda.png' },
		{ title: 'DeFi Protocol Deep Dive', topics: 20, duration: '7 Jam', category: 'DeFi', image: '/background-beranda.png' },
		{ title: 'Blockchain Cybersecurity', topics: 14, duration: '5 Jam', category: 'Security', image: '/background-beranda.png' },
	];

	const isAdmin = $derived(
		userAuth.isLoggedIn && userAuth.user?.email && ADMIN_EMAILS.includes(userAuth.user.email)
	);

	$effect(() => {
		if (!userAuth.loading && !isAdmin) {
			goto('/');
		}
	});

	onMount(() => {
		const q = query(collection(db, 'elearning_courses'), orderBy('createdAt', 'desc'));
		const unsub = onSnapshot(q, (snap) => {
			courses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
			isLoading = false;
		});
		return unsub;
	});

	function openModal(mode: 'add' | 'edit', course: any = null) {
		modalMode = mode;
		if (mode === 'edit' && course) {
			formData = { ...course };
		} else {
			formData = {
				id: '',
				title: '',
				description: '',
				topics: 0,
				duration: '',
				category: 'Blockchain',
				image: '',
				lessons: []
			};
		}
		isModalOpen = true;
	}

	async function saveCourse() {
		if (!formData.title) return;
		isProcessing = true;
		try {
			const docId = formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
			
			const courseData: any = {
				title: formData.title,
				description: formData.description,
				topics: formData.topics,
				duration: formData.duration,
				category: formData.category,
				image: formData.image,
				lessons: formData.lessons || [],
				updatedAt: serverTimestamp()
			};

			if (modalMode === 'add') {
				courseData.createdAt = serverTimestamp();
			}

			await setDoc(doc(db, 'elearning_courses', docId), courseData, { merge: true });
			isModalOpen = false;
		} catch (error) {
			console.error("Error saving course:", error);
			alert("Gagal menyimpan materi!");
		} finally {
			isProcessing = false;
		}
	}

	async function deleteCourse(id: string) {
		if (!confirm('Apakah Anda yakin ingin menghapus materi ini?')) return;
		isProcessing = true;
		try {
			await deleteDoc(doc(db, 'elearning_courses', id));
		} catch (error) {
			console.error("Error deleting course:", error);
			alert("Gagal menghapus materi!");
		} finally {
			isProcessing = false;
		}
	}

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		isUploading = true;
		const uploadData = new FormData();
		uploadData.append('file', file);

		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: uploadData
			});
			const data = await res.json();
			if (data.url) {
				formData.image = data.url;
			} else {
				alert(data.error || 'Upload gagal');
			}
		} catch (error) {
			console.error('Upload error:', error);
			alert('Terjadi kesalahan saat upload');
		} finally {
			isUploading = false;
			target.value = '';
		}
	}

	async function seedDefaultCourses() {
		if (!confirm('Masukkan data default ke database? Ini akan membuat dokumen baru jika belum ada.')) return;
		isProcessing = true;
		try {
			const batch = writeBatch(db);
			for (const c of defaultCourses) {
				const id = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
				const docRef = doc(db, 'elearning_courses', id);
				batch.set(docRef, {
					...c,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				});
			}
			await batch.commit();
			alert('Berhasil memasukkan data awal!');
		} catch (error) {
			console.error("Error seeding:", error);
			alert("Gagal memproses seeding!");
		} finally {
			isProcessing = false;
		}
	}
</script>

<svelte:head>
	<title>Admin — Kelola Materi E-Learning | CryptoSharia Academy</title>
</svelte:head>

{#if userAuth.loading || isLoading}
	<div class="min-h-[60vh] flex items-center justify-center">
		<svg class="animate-spin w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
	</div>
{:else if isAdmin}
	<div class="pt-20 pb-16 bg-gray-50 dark:bg-gray-950 min-h-screen">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
				<div>
					<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Kelola Materi E-Learning</h1>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Total {courses.length} materi terdaftar</p>
				</div>
				<div class="flex gap-2">
					{#if courses.length === 0}
						<button onclick={seedDefaultCourses} disabled={isProcessing} class="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer disabled:opacity-50">
							Initialize Default Data
						</button>
					{/if}
					<button onclick={() => openModal('add')} class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary-700 transition-all flex items-center gap-2 cursor-pointer">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
						Tambah Materi
					</button>
				</div>
			</div>

			<!-- Courses list -->
			{#if courses.length === 0}
				<div class="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
					<div class="text-4xl mb-3">📭</div>
					<p class="text-sm text-gray-500 dark:text-gray-400">Belum ada materi e-learning.</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each courses as course (course.id)}
						<div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
							<div class="h-32 bg-cover bg-center border-b border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-900" style="background-image: url('{course.image || '/background-beranda.png'}');">
							</div>
							<div class="p-4 flex-1 flex flex-col">
								<div class="flex items-center justify-between gap-2 mb-2">
									<span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-[10px] font-semibold text-gray-600 dark:text-gray-300">{course.category}</span>
								</div>
								<h3 class="font-bold text-sm text-gray-900 dark:text-white leading-snug mb-3 flex-1">{course.title}</h3>
								
								<div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
									<span>{course.topics} Materi</span>
									<span>{course.duration}</span>
								</div>
								
								<div class="flex gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
									<button onclick={() => openModal('edit', course)} class="flex-1 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer">Edit</button>
									<button onclick={() => deleteCourse(course.id)} class="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer">Hapus</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Modal Form -->
	{#if isModalOpen}
		<div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
			<button aria-label="Tutup modal" onclick={() => { isModalOpen = false; }} class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"></button>
			<div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
				<div class="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<h2 class="text-lg font-extrabold text-gray-900 dark:text-white">
						{modalMode === 'add' ? 'Tambah Materi Baru' : 'Edit Materi'}
					</h2>
					<button aria-label="Tutup" onclick={() => { isModalOpen = false; }} class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
					</button>
				</div>

				<div class="p-6 overflow-y-auto space-y-4">
					<div>
						<label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Judul Materi</label>
						<input type="text" bind:value={formData.title} class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Fiqh Muamalah Digital" />
					</div>
					
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Jumlah Topik</label>
							<input type="number" bind:value={formData.topics} class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" />
						</div>
						<div>
							<label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Estimasi Durasi</label>
							<input type="text" bind:value={formData.duration} class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. 6 Jam" />
						</div>
					</div>

					<div>
						<label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
						<select bind:value={formData.category} class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500">
							{#each categories as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Deskripsi Materi</label>
						<textarea bind:value={formData.description} rows="3" class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Jelaskan isi materi secara singkat..."></textarea>
					</div>

					<div>
						<label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Cover Image</label>
						<div class="flex gap-2">
							<input type="text" bind:value={formData.image} class="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. /uploads/courses/image.png" />
							<label class="relative overflow-hidden cursor-pointer flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
								{#if isUploading}
									<svg class="animate-spin w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
									Loading...
								{:else}
									<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
									Upload
								{/if}
								<input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onchange={handleFileUpload} disabled={isUploading} />
							</label>
						</div>
					</div>

					<!-- Lessons / Daftar Video -->
					<div class="pt-4 border-t border-gray-100 dark:border-gray-700">
						<div class="flex items-center justify-between mb-3">
							<label class="text-xs font-bold text-gray-700 dark:text-gray-300">Daftar Video / Lesson</label>
							<button type="button" onclick={() => { formData.lessons = [...formData.lessons, { title: '', videoUrl: '', type: 'video', duration: '' }]; }} class="text-xs font-semibold text-primary-600 hover:text-primary-700 cursor-pointer flex items-center gap-1">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
								Tambah Lesson
							</button>
						</div>

						{#if formData.lessons.length === 0}
							<div class="text-center py-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
								<p class="text-xs text-gray-400">Belum ada lesson. Klik "Tambah Lesson" di atas.</p>
							</div>
						{:else}
							<div class="space-y-3 max-h-64 overflow-y-auto pr-1">
								{#each formData.lessons as lesson, i}
									<div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700 relative">
										<div class="flex items-center justify-between mb-2">
											<span class="text-[10px] font-bold text-gray-400">LESSON {i + 1}</span>
											<button type="button" onclick={() => { formData.lessons = formData.lessons.filter((_, idx) => idx !== i); }} class="text-red-400 hover:text-red-600 cursor-pointer" title="Hapus lesson">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
											</button>
										</div>
										<input type="text" bind:value={lesson.title} class="w-full rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500 mb-2" placeholder="Judul lesson, e.g. Introduction to Blockchain" />
										<input type="text" bind:value={lesson.videoUrl} class="w-full rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500 mb-2" placeholder="Link video YouTube embed, e.g. https://www.youtube.com/embed/..." />
										<div class="grid grid-cols-2 gap-2">
											<select bind:value={lesson.type} class="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none">
												<option value="video">🎬 Video</option>
												<option value="quiz">📝 Quiz</option>
												<option value="reading">📖 Bacaan</option>
											</select>
											<input type="text" bind:value={lesson.duration} class="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-500" placeholder="e.g. 12 min" />
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Preview Card -->
					<div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
						<p class="text-xs font-bold text-gray-500 mb-2">Preview Kartu:</p>
						<div class="w-full sm:w-1/2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
							<div class="h-28 bg-cover bg-center border-b border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-900" style="background-image: url('{formData.image || '/background-beranda.png'}');">
							</div>
							<div class="p-3">
								<h3 class="font-bold text-xs text-gray-900 dark:text-white line-clamp-2">{formData.title || 'Judul Materi'}</h3>
							</div>
						</div>
					</div>
				</div>

				<div class="p-5 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
					<button onclick={() => { isModalOpen = false; }} class="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">Batal</button>
					<button onclick={saveCourse} disabled={isProcessing || !formData.title} class="px-5 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md transition-all disabled:opacity-50 cursor-pointer">
						{isProcessing ? 'Menyimpan...' : 'Simpan Materi'}
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}
