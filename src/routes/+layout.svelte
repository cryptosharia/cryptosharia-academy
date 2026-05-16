<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { theme } from '$lib/theme.svelte';
	import { userAuth } from '$lib/auth.svelte';

	let { children } = $props();

	$effect(() => {
		theme.init();
		userAuth.init();
	});
</script>

<div class="min-h-screen flex flex-col bg-background text-foreground">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
