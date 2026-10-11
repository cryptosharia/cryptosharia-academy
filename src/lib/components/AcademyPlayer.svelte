<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth, db, lessonDb, ensureFirebaseReady } from '$lib/firebase';
	import { readCatalog, saveProgress, type CatalogLesson } from '$lib/academyData';
	import { createAcademyPlayer, type PlayerState } from '$lib/academyPlayer';
	import { parseYouTubeUrl } from '$lib/youtube';
	let lessons = $state<CatalogLesson[]>([]);
	let selected = $state<CatalogLesson | null>(null);
	let view = $state<PlayerState>({ status: 'loading', media: null });
	let controller = $state<ReturnType<typeof createAcademyPlayer> | undefined>();
	let catalogReady = $state(false);
	let progress = $state('');
	const messages: Record<PlayerState['status'], string> = {
		loading: 'Memuat akses…',
		ready: 'Akses tersedia',
		unauthorized: 'Akses ditolak. Masuk dan gunakan grant yang sesuai.',
		expired: 'Akses kedaluwarsa.',
		revoked: 'Akses dicabut.',
		unpublished: 'Materi belum diterbitkan atau tidak tersedia untuk akses ini.',
		'not-found': 'Materi tidak ditemukan.',
		'backend-unavailable': 'Backend tidak tersedia. Konten telah ditutup.'
	};
	const video = $derived(
		view.media ? parseYouTubeUrl(`https://youtu.be/${view.media.videoId}`) : null
	);
	function select(lesson: CatalogLesson) {
		selected = lesson;
		progress = '';
		controller?.open(lesson);
	}
	async function markProgress() {
		const uid = auth.currentUser?.uid,
			lesson = selected;
		if (!uid || !lesson || view.status !== 'ready') return;
		try {
			await saveProgress(db, uid, lesson, 0);
			if (auth.currentUser?.uid === uid) progress = 'Posisi awal tersimpan.';
		} catch {
			if (auth.currentUser?.uid === uid) progress = 'Progress tidak dapat disimpan.';
		}
	}
	onMount(() => {
		let alive = true;
		controller = createAcademyPlayer(db, lessonDb, auth, (next) => {
			if (alive) view = next;
		});
		const stop = onAuthStateChanged(auth, () => {
			progress = '';
			if (catalogReady) controller?.open(selected);
			else view = { status: 'loading', media: null };
		});
		const offline = () => controller?.suspend();
		const online = () => controller?.resume();
		const visibility = () => (document.hidden ? offline() : online());
		window.addEventListener('offline', offline);
		window.addEventListener('online', online);
		document.addEventListener('visibilitychange', visibility);
		return () => {
			alive = false;
			stop();
			controller?.dispose();
			window.removeEventListener('offline', offline);
			window.removeEventListener('online', online);
			document.removeEventListener('visibilitychange', visibility);
		};
	});
	$effect(() => {
		const scope = page.params.id,
			player = controller;
		if (!player) return;
		let cancelled = false;
		catalogReady = false;
		lessons = [];
		selected = null;
		progress = '';
		player.suspend();
		view = { status: 'loading', media: null };
		void ensureFirebaseReady()
			.then(() => readCatalog(db, scope))
			.then((items) => {
				if (cancelled) return;
				lessons = items;
				selected = items[0] ?? null;
				catalogReady = true;
				player.open(items[0] ?? null);
			})
			.catch(() => {
				if (!cancelled) view = { status: 'backend-unavailable', media: null };
			});
		return () => {
			cancelled = true;
			player.suspend();
		};
	});
</script>

<svelte:head><title>Materi | CryptoSharia Academy</title></svelte:head>
<section class="mx-auto max-w-5xl px-6 py-24">
	<a href={resolve('/e-learning')}>Kembali ke katalog</a>
	<h1 class="my-4 text-2xl font-bold">{selected?.chapter || 'Materi Academy'}</h1>
	<p role="status" data-testid="access-status" data-status={view.status}>{messages[view.status]}</p>
	{#if view.status === 'ready' && video && selected}
		<iframe
			class="my-4 aspect-video w-full"
			src={video.embedUrl}
			title={selected.title}
			referrerpolicy="strict-origin-when-cross-origin"
			allow="encrypted-media; picture-in-picture"
			allowfullscreen
		></iframe>
		<button class="my-3 rounded border p-2" onclick={markProgress}>Simpan posisi awal</button>
		<p role="status">{progress}</p>
	{/if}
	<ul class="my-6 space-y-3">
		{#each lessons as lesson (lesson.id)}<li>
				<button
					class="rounded border p-3"
					aria-pressed={selected?.id === lesson.id}
					onclick={() => select(lesson)}>{lesson.title}</button
				>
			</li>{/each}
	</ul>
	{#if view.status !== 'loading' && view.status !== 'ready'}<button
			class="rounded border p-2"
			onclick={() => controller?.resume()}>Periksa akses kembali</button
		>{/if}
	<p class="mt-6 text-sm">
		Referensi YouTube yang sudah diketahui tidak dapat dicabut oleh situs ini. YouTube Unlisted
		bukan DRM.
	</p>
</section>
