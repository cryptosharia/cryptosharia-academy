<script lang="ts">
	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ label: 'E-learning', href: '/e-learning' },
		{ label: 'Bootcamp & Program', href: '/bootcamp' }
	];

	$effect(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'}">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<a href="/" class="flex items-center gap-2.5 group">
				<img src="/logo.png" alt="CryptoSharia" class="h-9 w-9 rounded-full transition-transform group-hover:scale-105" />
				<span class="font-sans text-lg font-extrabold text-gray-900">Crypto<span class="text-primary-600">Sharia</span></span>
			</a>
			<nav class="hidden md:flex items-center gap-1">
				{#each navLinks as link}
					<a href={link.href} class="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:text-primary-600 hover:bg-primary-50">{link.label}</a>
				{/each}
			</nav>
			<div class="flex items-center gap-3">
				<a href="/e-learning" class="hidden sm:inline-flex items-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm orange-glow transition-all hover:bg-primary-700 active:scale-95">Mulai Belajar</a>
				<button onclick={() => (mobileMenuOpen = !mobileMenuOpen)} class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100" aria-label="Toggle menu">
					{#if mobileMenuOpen}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
					{:else}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
					{/if}
				</button>
			</div>
		</div>
	</div>
	{#if mobileMenuOpen}
		<div class="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
			<div class="px-4 py-3 space-y-1">
				{#each navLinks as link}
					<a href={link.href} onclick={() => (mobileMenuOpen = false)} class="block px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-primary-50 hover:text-primary-600">{link.label}</a>
				{/each}
				<a href="/e-learning" onclick={() => (mobileMenuOpen = false)} class="block mt-2 text-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Mulai Belajar</a>
			</div>
		</div>
	{/if}
</header>
