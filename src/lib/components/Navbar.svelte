<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import { page } from '$app/state';
	import { userAuth } from '$lib/auth.svelte';
	import { buildWhatsappUrl, defaultLandingContent } from '$lib/landingContent';

	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);
	let userMenuOpen = $state(false);

	const ADMIN_EMAILS = ['admin@cryptosharia.id'];

	const isAdmin = $derived(
		userAuth.isLoggedIn && userAuth.user?.email && ADMIN_EMAILS.includes(userAuth.user.email)
	);

	const whatsappUrl = buildWhatsappUrl(defaultLandingContent.whatsapp);

	const navLinks = $derived(
		isAdmin
			? [
					{ label: 'Landing Page', href: '/admin/landing' },
					{ label: 'Kelola Materi', href: '/admin/courses' },
					{ label: 'Voucher', href: '/admin/vouchers' },
					{ label: 'Pesanan', href: '/admin/orders' }
				]
			: [
					{ label: 'Beranda', href: '/#hero' },
					{ label: 'Pemateri', href: '/#instructors' },
					{ label: 'Kurikulum', href: '/#curriculum' },
					{ label: 'Harga', href: '/#pricing' },
					{ label: 'FAQ', href: '/#faq' }
				]
	);

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
		const handleClick = () => {
			userMenuOpen = false;
		};
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

	function isActiveLink(href: string) {
		if (href.startsWith('/#')) {
			return page.url.pathname === '/' && page.url.hash === href.slice(1);
		}
		return page.url.pathname === href;
	}
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-300 {scrolled
		? 'bg-white/90 shadow-sm backdrop-blur-md dark:bg-gray-900/90'
		: 'bg-white dark:bg-gray-900'}"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<a href="/" class="group flex items-center gap-2.5">
				<img
					src="/logo.png"
					alt="CryptoSharia"
					class="h-9 w-9 rounded-full transition-transform group-hover:scale-105"
				/>
				<span class="font-sans text-lg font-extrabold text-gray-900 dark:text-white"
					>Crypto<span class="text-primary-600 dark:text-primary-400">Sharia</span></span
				>
			</a>
			<nav class="hidden items-center gap-1 md:flex">
				{#each navLinks as link}
					{@const active = isActiveLink(link.href)}
					<a
						href={link.href}
						aria-current={active ? 'page' : undefined}
						class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {active
							? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 ring-primary-200 dark:ring-primary-800 ring-1'
							: 'hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-gray-600 dark:text-gray-300'}"
						>{link.label}</a
					>
				{/each}
			</nav>
			<div class="flex items-center gap-2">
				<ThemeToggle />

				{#if userAuth.isLoggedIn}
					<!-- User avatar + dropdown -->
					<div class="relative">
						<button
							onclick={(e) => {
								e.stopPropagation();
								userMenuOpen = !userMenuOpen;
							}}
							class="hover:ring-primary-300 dark:hover:ring-primary-600 flex items-center gap-2 rounded-full p-0.5 transition-all hover:ring-2"
						>
							{#if userAuth.user?.photoURL}
								<img
									src={userAuth.user.photoURL}
									alt="Avatar"
									class="h-9 w-9 rounded-full object-cover"
								/>
							{:else}
								<div
									class="from-primary-500 to-primary-700 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white"
								>
									{getUserInitial(userAuth.user)}
								</div>
							{/if}
						</button>

						{#if userMenuOpen}
							<div
								class="animate-in fade-in slide-in-from-top-2 absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-xl dark:border-gray-700 dark:bg-gray-800"
							>
								<!-- User info -->
								<div class="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
									<div class="truncate text-sm font-semibold text-gray-900 dark:text-white">
										{userAuth.user?.displayName || 'User'}
									</div>
									<div class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
										{userAuth.user?.email}
									</div>
								</div>
								<!-- Menu items -->
								<a
									href="/profile"
									class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
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
								<a
									href="/profile"
									class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/></svg
									>
									Kursus Saya
								</a>
								<div class="my-1 border-t border-gray-100 dark:border-gray-700"></div>
								<button
									onclick={handleLogout}
									class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										/></svg
									>
									Keluar
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Guest buttons -->
					<a
						href={whatsappUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="bg-primary-600 orange-glow hover:bg-primary-700 hidden items-center rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all active:scale-95 sm:inline-flex"
						>Daftar</a
					>
				{/if}

				<button
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/></svg
						>
					{:else}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/></svg
						>
					{/if}
				</button>
			</div>
		</div>
	</div>
	{#if mobileMenuOpen}
		<div
			class="border-t border-gray-100 bg-white/95 backdrop-blur-md md:hidden dark:border-gray-800 dark:bg-gray-900/95"
		>
			<div class="space-y-1 px-4 py-3">
				{#each navLinks as link}
					{@const active = isActiveLink(link.href)}
					<a
						href={link.href}
						onclick={() => (mobileMenuOpen = false)}
						aria-current={active ? 'page' : undefined}
						class="block rounded-lg px-3 py-2.5 text-sm font-medium {active
							? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
							: 'hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 dark:text-gray-300'}"
						>{link.label}</a
					>
				{/each}
				{#if userAuth.isLoggedIn}
					<div class="mt-2 border-t border-gray-100 pt-2 dark:border-gray-700">
						<div class="flex items-center gap-3 px-3 py-2">
							{#if userAuth.user?.photoURL}
								<img src={userAuth.user.photoURL} alt="Avatar" class="h-8 w-8 rounded-full" />
							{:else}
								<div
									class="from-primary-500 to-primary-700 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white"
								>
									{getUserInitial(userAuth.user)}
								</div>
							{/if}
							<div>
								<div class="text-sm font-semibold text-gray-900 dark:text-white">
									{userAuth.user?.displayName || 'User'}
								</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">{userAuth.user?.email}</div>
							</div>
						</div>
						<a
							href="/profile"
							onclick={() => (mobileMenuOpen = false)}
							class="mt-2 block w-full rounded-full border border-gray-200 px-5 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
							>Profil Saya</a
						>
						<button
							onclick={() => {
								handleLogout();
								mobileMenuOpen = false;
							}}
							class="mt-2 block w-full rounded-full border border-red-200 px-5 py-2.5 text-center text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
							>Keluar</button
						>
					</div>
				{:else}
					<a
						href={whatsappUrl}
						target="_blank"
						rel="noopener noreferrer"
						onclick={() => (mobileMenuOpen = false)}
						class="bg-primary-600 hover:bg-primary-700 mt-2 block rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white"
						>Daftar</a
					>
				{/if}
			</div>
		</div>
	{/if}
</header>
