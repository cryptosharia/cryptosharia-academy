<script lang="ts">
	import '../../app.css';
	import { theme } from '$lib/theme.svelte';
	import { userAuth } from '$lib/auth.svelte';

	let { children } = $props();

	$effect(() => {
		theme.init();
		userAuth.init();
	});
</script>

{@render children()}
