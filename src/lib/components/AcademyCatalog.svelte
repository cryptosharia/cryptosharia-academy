<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { collection, getDocs, orderBy, query } from 'firebase/firestore';
	import { db, ensureFirebaseReady } from '$lib/firebase';

	type CourseMetadata = { id: string; title: string; category: string; description: string };
	let courses = $state<CourseMetadata[]>([]);
	let loading = $state(true);
	let error = $state('');
	const subjects = [
		'Analisis Fundamental',
		'Analisis Teknikal',
		'Fikih Muamalah',
		'Web3 & Blockchain'
	];

	onMount(async () => {
		try {
			await ensureFirebaseReady();
			const snapshot = await getDocs(
				query(collection(db, 'elearning_courses'), orderBy('createdAt', 'desc'))
			);
			courses = snapshot.docs.map((document) => {
				const data = document.data();
				return {
					id: document.id,
					title: typeof data.title === 'string' ? data.title : 'Materi',
					category: typeof data.category === 'string' ? data.category : '',
					description: typeof data.description === 'string' ? data.description : ''
				};
			});
		} catch {
			error = 'Katalog belum dapat dimuat. Silakan coba kembali nanti.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head
	><title>Pembelajaran Modul | CryptoSharia Academy</title><meta
		name="description"
		content="Pembelajaran mandiri melalui modul CryptoSharia Academy."
	/></svelte:head
>
<section class="mx-auto max-w-5xl px-6 py-24">
	<h1 class="text-3xl font-bold">Pembelajaran Modul</h1>
	<p class="mt-4">
		Katalog sedang disiapkan dan belum dibuka untuk peserta. Materi memerlukan peninjauan sebelum
		diterbitkan.
	</p>
	<ul class="mt-6 grid gap-3 sm:grid-cols-2">
		{#each subjects as subject (subject)}<li class="rounded border p-4">{subject}</li>{/each}
	</ul>
	{#if loading}<p class="mt-8" role="status">Memuat katalog…</p>
	{:else if error}<p class="mt-8" role="alert">{error}</p>
	{:else if courses.length === 0}<p class="mt-8">Belum ada materi untuk ditampilkan.</p>
	{:else}<ul class="mt-8 space-y-4">
			{#each courses as course (course.id)}<li class="rounded border p-4">
					<a class="font-semibold underline" href={resolve('/e-learning/[id]', { id: course.id })}
						>{course.title}</a
					>
					<p>{course.category}</p>
					<p>{course.description}</p>
				</li>{/each}
		</ul>{/if}
</section>
