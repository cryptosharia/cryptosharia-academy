<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import { userAuth } from '$lib/auth.svelte';

	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);
	let userMenuOpen = $state(false);

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

	// Close user menu when clicking outside
	$effect(() => {
		if (!userMenuOpen) return;
		const handleClick = () => { userMenuOpen = false; };
		setTimeout(() => window.addEventListener('click', handleClick), 0);
		return () => window.removeEventListener('click', handleClick);
	});

	function getUserInitial(user: any): string {
		if (user?.displayName) return user.displayName[0].toUpperCase();
		if (user?.email) return user.email[0].toUpperCase();
		return '?';
	}

	async function handleLogout() {
		await userAuth.logout();
		userMenuOpen = false;
	}
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-white dark:bg-gray-900'}">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<a href="/" class="flex items-center gap-2.5 group">
				<img src="/logo.png" alt="CryptoSharia" class="h-9 w-9 rounded-full transition-transform group-hover:scale-105" />
				<span class="font-sans text-lg font-extrabold text-gray-900 dark:text-white">Crypto<span class="text-primary-600 dark:text-primary-400">Sharia</span></span>
			</a>
			<nav class="hidden md:flex items-center gap-1">
				{#each navLinks as link}
					<a href={link.href} class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg transition-colors hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30">{link.label}</a>
				{/each}
			</nav>
			<div class="flex items-center gap-2">
				<ThemeToggle />

				{#if userAuth.isLoggedIn}
					<!-- User avatar + dropdown -->
					<div class="relative">
						<button
							onclick={(e) => { e.stopPropagation(); userMenuOpen = !userMenuOpen; }}
							class="flex items-center gap-2 rounded-full p-0.5 transition-all hover:ring-2 hover:ring-primary-300 dark:hover:ring-primary-600"
						>
							{#if userAuth.user?.photoURL}
								<img src={userAuth.user.photoURL} alt="Avatar" class="w-9 h-9 rounded-full object-cover" />
							{:else}
								<div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
									{getUserInitial(userAuth.user)}
								</div>
							{/if}
						</button>

						{#if userMenuOpen}
							<div class="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
								<!-- User info -->
								<div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
									<div class="font-semibold text-sm text-gray-900 dark:text-white truncate">
										{userAuth.user?.displayName || 'User'}
									</div>
									<div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
										{userAuth.user?.email}
									</div>
								</div>
								<!-- Menu items -->
								<a href="/profile" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
									Profil Saya
								</a>
								<a href="/profile" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
									Kursus Saya
								</a>
								<div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
								<button onclick={handleLogout} class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
									Keluar
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Guest buttons -->
					<a href="/auth/login" class="hidden sm:inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95">Masuk</a>
					<a href="/auth/register" class="hidden sm:inline-flex items-center rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm orange-glow transition-all hover:bg-primary-700 active:scale-95">Daftar</a>
				{/if}

				<button onclick={() => (mobileMenuOpen = !mobileMenuOpen)} class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle menu">
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
		<div class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
			<div class="px-4 py-3 space-y-1">
				{#each navLinks as link}
					<a href={link.href} onclick={() => (mobileMenuOpen = false)} class="block px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400">{link.label}</a>
				{/each}
				{#if userAuth.isLoggedIn}
					<div class="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
						<div class="flex items-center gap-3 px-3 py-2">
							{#if userAuth.user?.photoURL}
								<img src={userAuth.user.photoURL} alt="Avatar" class="w-8 h-8 rounded-full" />
							{:else}
								<div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs">
									{getUserInitial(userAuth.user)}
								</div>
							{/if}
							<div>
								<div class="text-sm font-semibold text-gray-900 dark:text-white">{userAuth.user?.displayName || 'User'}</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">{userAuth.user?.email}</div>
							</div>
						</div>
						<button onclick={() => { handleLogout(); mobileMenuOpen = false; }} class="block w-full mt-2 text-center rounded-full border border-red-200 dark:border-red-800 px-5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Keluar</button>
					</div>
				{:else}
					<a href="/auth/login" onclick={() => (mobileMenuOpen = false)} class="block mt-2 text-center rounded-full border border-gray-200 dark:border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Masuk</a>
					<a href="/auth/register" onclick={() => (mobileMenuOpen = false)} class="block mt-2 text-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Daftar</a>
				{/if}
			</div>
		</div>
	{/if}
</header>
