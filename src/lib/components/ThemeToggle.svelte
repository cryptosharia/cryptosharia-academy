<script lang="ts">
	import { theme } from '$lib/theme.svelte';

	let open = $state(false);

	const options = [
		{ value: 'light' as const, label: 'Light', icon: '☀️' },
		{ value: 'dark' as const, label: 'Dark', icon: '🌙' },
		{ value: 'system' as const, label: 'System', icon: '💻' }
	];

	function select(value: 'light' | 'dark' | 'system') {
		theme.set(value);
		open = false;
	}
</script>

<div class="relative">
	<button
		onclick={() => (open = !open)}
		class="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
		aria-label="Toggle theme"
	>
		{#if theme.mode === 'dark'}
			<span class="text-lg">🌙</span>
		{:else if theme.mode === 'light'}
			<span class="text-lg">☀️</span>
		{:else}
			<span class="text-lg">💻</span>
		{/if}
	</button>

	{#if open}
		<!-- Backdrop -->
		<button class="fixed inset-0 z-40" onclick={() => (open = false)} aria-label="Close menu"></button>
		<!-- Dropdown -->
		<div class="absolute right-0 top-full mt-2 z-50 w-36 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-1.5 animate-fade-in-up" style="animation-duration: 0.15s">
			{#each options as opt}
				<button
					onclick={() => select(opt.value)}
					class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
						{theme.mode === opt.value
							? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold'
							: 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}"
				>
					<span class="text-base">{opt.icon}</span>
					{opt.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
