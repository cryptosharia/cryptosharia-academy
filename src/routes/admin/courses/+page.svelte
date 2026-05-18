<script lang="ts">
	import { goto } from '$app/navigation';
	import { userAuth } from '$lib/auth.svelte';
	import {
		collection,
		query,
		orderBy,
		onSnapshot,
		doc,
		setDoc,
		deleteDoc,
		serverTimestamp,
		writeBatch
	} from 'firebase/firestore';
	import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import { db, storage } from '$lib/firebase';
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
		price: 49000,
		originalPrice: 299000,
		lessons: [] as { title: string; videoUrl: string; type: string; duration: string }[]
	});

	const categories = [
		'Blockchain',
		'Syariah',
		'Trading',
		'DeFi',
		'Development',
		'Data & AI',
		'Security'
	];

	const defaultCourses = [
		{
			title: 'Blockchain & Crypto Fundamentals',
			topics: 24,
			duration: '8 Jam',
			category: 'Blockchain',
			image: '/background-beranda.png'
		},
		{
			title: 'Fiqh Muamalah Digital',
			topics: 18,
			duration: '6 Jam',
			category: 'Syariah',
			image: '/background-beranda.png'
		},
		{
			title: 'Crypto Trading Fundamental',
			topics: 22,
			duration: '7 Jam',
			category: 'Trading',
			image: '/background-beranda.png'
		},
		{
			title: 'DeFi & Yield Farming Halal',
			topics: 16,
			duration: '5 Jam',
			category: 'DeFi',
			image: '/background-beranda.png'
		},
		{
			title: 'Smart Contract & Solidity',
			topics: 30,
			duration: '12 Jam',
			category: 'Development',
			image: '/background-beranda.png'
		},
		{
			title: 'Token Screening Syariah',
			topics: 14,
			duration: '4 Jam',
			category: 'Syariah',
			image: '/background-beranda.png'
		},
		{
			title: 'Data Analysis for Crypto',
			topics: 20,
			duration: '8 Jam',
			category: 'Data & AI',
			image: '/background-beranda.png'
		},
		{
			title: 'NFT Creation & Marketing',
			topics: 12,
			duration: '4 Jam',
			category: 'Blockchain',
			image: '/background-beranda.png'
		},
		{
			title: 'Web3 Frontend Development',
			topics: 28,
			duration: '10 Jam',
			category: 'Development',
			image: '/background-beranda.png'
		},
		{
			title: 'Crypto Wallet & Security',
			topics: 10,
			duration: '3 Jam',
			category: 'Security',
			image: '/background-beranda.png'
		},
		{
			title: 'Technical Analysis Crypto',
			topics: 18,
			duration: '6 Jam',
			category: 'Trading',
			image: '/background-beranda.png'
		},
		{
			title: 'AI & Machine Learning for Crypto',
			topics: 22,
			duration: '8 Jam',
			category: 'Data & AI',
			image: '/background-beranda.png'
		},
		{
			title: 'Ekonomi Syariah & Fintech',
			topics: 16,
			duration: '5 Jam',
			category: 'Syariah',
			image: '/background-beranda.png'
		},
		{
			title: 'Stablecoin & CBDC Analysis',
			topics: 12,
			duration: '4 Jam',
			category: 'Blockchain',
			image: '/background-beranda.png'
		},
		{
			title: 'DeFi Protocol Deep Dive',
			topics: 20,
			duration: '7 Jam',
			category: 'DeFi',
			image: '/background-beranda.png'
		},
		{
			title: 'Blockchain Cybersecurity',
			topics: 14,
			duration: '5 Jam',
			category: 'Security',
			image: '/background-beranda.png'
		}
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
			courses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
				price: 49000,
				originalPrice: 299000,
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
				price: formData.price || 0,
				originalPrice: formData.originalPrice || 0,
				lessons: formData.lessons || [],
				updatedAt: serverTimestamp()
			};

			if (modalMode === 'add') {
				courseData.createdAt = serverTimestamp();
			}

			await setDoc(doc(db, 'elearning_courses', docId), courseData, { merge: true });
			isModalOpen = false;
		} catch (error) {
			console.error('Error saving course:', error);
			alert('Gagal menyimpan materi!');
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
			console.error('Error deleting course:', error);
			alert('Gagal menghapus materi!');
		} finally {
			isProcessing = false;
		}
	}

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		isUploading = true;
		try {
			const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
			const storageRef = ref(storage, `courses/${filename}`);
			await uploadBytes(storageRef, file);
			const url = await getDownloadURL(storageRef);
			formData.image = url;
		} catch (error) {
			console.error('Upload error:', error);
			alert('Terjadi kesalahan saat upload gambar');
		} finally {
			isUploading = false;
			target.value = '';
		}
	}

	async function seedDefaultCourses() {
		if (
			!confirm('Masukkan data default ke database? Ini akan membuat dokumen baru jika belum ada.')
		)
			return;
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
			console.error('Error seeding:', error);
			alert('Gagal memproses seeding!');
		} finally {
			isProcessing = false;
		}
	}
</script>

<svelte:head>
	<title>Admin — Kelola Materi | CryptoSharia Academy</title>
</svelte:head>

{#if userAuth.loading || isLoading}
	<div class="flex min-h-[60vh] items-center justify-center">
		<svg class="text-primary-600 h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24"
			><circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
			/><path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/></svg
		>
	</div>
{:else if isAdmin}
	<div class="min-h-screen bg-gray-50 pt-20 pb-16 dark:bg-gray-950">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Kelola Materi</h1>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Total {courses.length} materi (digunakan untuk Subscription & Units)
					</p>
				</div>
				<div class="flex gap-2">
					<a
						href="/profile"
						class="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/></svg
						>
						Profil Saya
					</a>
					{#if courses.length === 0}
						<button
							onclick={seedDefaultCourses}
							disabled={isProcessing}
							class="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition-all hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Initialize Default Data
						</button>
					{/if}
					<button
						onclick={() => openModal('add')}
						class="bg-primary-600 hover:bg-primary-700 flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-md transition-all"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/></svg
						>
						Tambah Materi
					</button>
				</div>
			</div>

			<!-- Courses list -->
			{#if courses.length === 0}
				<div
					class="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900"
				>
					<div class="mb-3 text-4xl">📭</div>
					<p class="text-sm text-gray-500 dark:text-gray-400">Belum ada materi e-learning.</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each courses as course (course.id)}
						<div
							class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
						>
							<div
								class="h-32 border-b border-gray-100 bg-gray-100 bg-cover bg-center dark:border-gray-700 dark:bg-gray-900"
								style="background-image: url('{course.image || '/background-beranda.png'}');"
							></div>
							<div class="flex flex-1 flex-col p-4">
								<div class="mb-2 flex items-center justify-between gap-2">
									<span
										class="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300"
										>{course.category}</span
									>
								</div>
								<h3
									class="mb-3 flex-1 text-sm leading-snug font-bold text-gray-900 dark:text-white"
								>
									{course.title}
								</h3>

								<div
									class="mb-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
								>
									<span>{course.topics} Materi</span>
									<span>{course.duration}</span>
								</div>

								<div class="mt-auto flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
									<button
										onclick={() => openModal('edit', course)}
										class="flex-1 cursor-pointer rounded bg-blue-50 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
										>Edit</button
									>
									<button
										onclick={() => deleteCourse(course.id)}
										class="flex-1 cursor-pointer rounded bg-red-50 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
										>Hapus</button
									>
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
			<button
				aria-label="Tutup modal"
				onclick={() => {
					isModalOpen = false;
				}}
				class="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
			></button>
			<div
				class="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
			>
				<div
					class="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-700"
				>
					<h2 class="text-lg font-extrabold text-gray-900 dark:text-white">
						{modalMode === 'add' ? 'Tambah Materi Baru' : 'Edit Materi'}
					</h2>
					<button
						aria-label="Tutup"
						onclick={() => {
							isModalOpen = false;
						}}
						class="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/></svg
						>
					</button>
				</div>

				<div class="space-y-4 overflow-y-auto p-6">
					<div>
						<label class="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300"
							>Judul Materi</label
						>
						<input
							type="text"
							bind:value={formData.title}
							class="focus:ring-primary-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
							placeholder="e.g. Fiqh Muamalah Digital"
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300"
								>Jumlah Topik</label
							>
							<input
								type="number"
								bind:value={formData.topics}
								class="focus:ring-primary-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
							/>
						</div>
						<div>
							<label class="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300"
								>Estimasi Durasi</label
							>
							<input
								type="text"
								bind:value={formData.duration}
								class="focus:ring-primary-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
								placeholder="e.g. 6 Jam"
							/>
						</div>
					</div>

					<div>
						<label class="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300"
							>Kategori</label
						>
						<select
							bind:value={formData.category}
							class="focus:ring-primary-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
						>
							{#each categories as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300"
							>Deskripsi Materi</label
						>
						<textarea
							bind:value={formData.description}
							rows="3"
							class="focus:ring-primary-500 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
							placeholder="Jelaskan isi materi secara singkat..."
						></textarea>
					</div>

					<!-- Harga Satuan (Units) -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300"
								>💰 Harga Satuan (Rp)</label
							>
							<input
								type="number"
								bind:value={formData.price}
								class="focus:ring-primary-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
								placeholder="e.g. 49000"
							/>
							<p class="mt-1 text-[10px] text-gray-400">Harga jual materi satuan di /units</p>
						</div>
						<div>
							<label class="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300"
								>🏷️ Harga Coret (Rp)</label
							>
							<input
								type="number"
								bind:value={formData.originalPrice}
								class="focus:ring-primary-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
								placeholder="e.g. 299000"
							/>
							<p class="mt-1 text-[10px] text-gray-400">Harga coret (sebelum diskon)</p>
						</div>
					</div>

					<div>
						<label class="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300"
							>Cover Image</label
						>
						<div class="flex gap-2">
							<input
								type="text"
								bind:value={formData.image}
								class="focus:ring-primary-500 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
								placeholder="e.g. /uploads/courses/image.png"
							/>
							<label
								class="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
							>
								{#if isUploading}
									<svg class="mr-1.5 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
										><circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										/><path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/></svg
									>
									Loading...
								{:else}
									<svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
										/></svg
									>
									Upload
								{/if}
								<input
									type="file"
									accept="image/*"
									class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
									onchange={handleFileUpload}
									disabled={isUploading}
								/>
							</label>
						</div>
					</div>

					<!-- Lessons / Daftar Video -->
					<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
						<div class="mb-3 flex items-center justify-between">
							<label class="text-xs font-bold text-gray-700 dark:text-gray-300"
								>Daftar Video / Lesson</label
							>
							<button
								type="button"
								onclick={() => {
									formData.lessons = [
										...formData.lessons,
										{ title: '', videoUrl: '', type: 'video', duration: '' }
									];
								}}
								class="text-primary-600 hover:text-primary-700 flex cursor-pointer items-center gap-1 text-xs font-semibold"
							>
								<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 4v16m8-8H4"
									/></svg
								>
								Tambah Lesson
							</button>
						</div>

						{#if formData.lessons.length === 0}
							<div
								class="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-6 text-center dark:border-gray-700 dark:bg-gray-900"
							>
								<p class="text-xs text-gray-400">Belum ada lesson. Klik "Tambah Lesson" di atas.</p>
							</div>
						{:else}
							<div class="max-h-64 space-y-3 overflow-y-auto pr-1">
								{#each formData.lessons as lesson, i}
									<div
										class="relative rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
									>
										<div class="mb-2 flex items-center justify-between">
											<span class="text-[10px] font-bold text-gray-400">LESSON {i + 1}</span>
											<button
												type="button"
												onclick={() => {
													formData.lessons = formData.lessons.filter((_, idx) => idx !== i);
												}}
												class="cursor-pointer text-red-400 hover:text-red-600"
												title="Hapus lesson"
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
													><path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/></svg
												>
											</button>
										</div>
										<input
											type="text"
											bind:value={lesson.title}
											class="focus:ring-primary-500 mb-2 w-full rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
											placeholder="Judul lesson, e.g. Introduction to Blockchain"
										/>
										<input
											type="text"
											bind:value={lesson.videoUrl}
											class="focus:ring-primary-500 mb-2 w-full rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
											placeholder="Link video YouTube embed, e.g. https://www.youtube.com/embed/..."
										/>
										<div class="grid grid-cols-2 gap-2">
											<select
												bind:value={lesson.type}
												class="rounded border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
											>
												<option value="video">🎬 Video</option>
												<option value="quiz">📝 Quiz</option>
												<option value="reading">📖 Bacaan</option>
											</select>
											<input
												type="text"
												bind:value={lesson.duration}
												class="focus:ring-primary-500 rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:ring-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
												placeholder="e.g. 12 min"
											/>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Preview Card -->
					<div class="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
						<p class="mb-2 text-xs font-bold text-gray-500">Preview Kartu:</p>
						<div
							class="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:w-1/2 dark:border-gray-700 dark:bg-gray-800"
						>
							<div
								class="h-28 border-b border-gray-100 bg-gray-100 bg-cover bg-center dark:border-gray-700 dark:bg-gray-900"
								style="background-image: url('{formData.image || '/background-beranda.png'}');"
							></div>
							<div class="p-3">
								<h3 class="line-clamp-2 text-xs font-bold text-gray-900 dark:text-white">
									{formData.title || 'Judul Materi'}
								</h3>
							</div>
						</div>
					</div>
				</div>

				<div
					class="flex justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900"
				>
					<button
						onclick={() => {
							isModalOpen = false;
						}}
						class="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
						>Batal</button
					>
					<button
						onclick={saveCourse}
						disabled={isProcessing || !formData.title}
						class="bg-primary-600 hover:bg-primary-700 cursor-pointer rounded-lg px-5 py-2 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50"
					>
						{isProcessing ? 'Menyimpan...' : 'Simpan Materi'}
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}
