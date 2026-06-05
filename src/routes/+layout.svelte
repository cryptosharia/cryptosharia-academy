<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { theme } from '$lib/theme.svelte';
	import { userAuth } from '$lib/auth.svelte';

	let { children } = $props();

	// On admin routes we hide the public marketing footer + WhatsApp FAB and
	// show a slim admin footer instead, so the editor feels like a real CMS.
	const currentYear = new Date().getFullYear();
	const isAdminRoute = $derived(page.url.pathname.startsWith('/admin'));

	$effect(() => {
		theme.init();
		userAuth.init();
	});
</script>

<div class="bg-background text-foreground flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	{#if isAdminRoute}
		<footer class="border-t border-gray-200 bg-white py-4 dark:border-gray-800 dark:bg-gray-950">
			<div
				class="mx-auto flex max-w-7xl items-center justify-between px-4 text-xs text-gray-400 sm:px-6 lg:px-8 dark:text-gray-500"
			>
				<span>CryptoSharia Admin · Landing Page Editor</span>
				<span>© {currentYear}</span>
			</div>
		</footer>
	{:else}
		<Footer />
	{/if}
</div>
