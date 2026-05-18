<script lang="ts">
	import { goto } from '$app/navigation';
	import { userAuth } from '$lib/auth.svelte';
	import {
		doc,
		getDoc,
		setDoc,
		serverTimestamp,
		collection,
		query,
		where,
		orderBy,
		onSnapshot,
		Timestamp
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let activeMenu = $state('profil');
	let isLoading = $state(true);
	let isSaving = $state(false);
	let saveSuccess = $state(false);

	// Profile form fields
	let namaLengkap = $state('');
	let tanggalLahir = $state('');
	let gender = $state('');
	let nomorTelepon = $state('');
	let alamat = $state('');
	let profesi = $state('');
	let targetPekerjaan = $state('');
	let linkResume = $state('');
	let notifikasi = $state(true);
	let elearningTab = $state('terakhir');
	let showChangePasswordModal = $state(false);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmNewPassword = $state('');
	let pwdLoading = $state(false);
	let pwdError = $state('');
	let pwdSuccess = $state(false);
	let userOrders = $state<any[]>([]);
	let ordersLoading = $state(false);

	const menuItems = [
		{ id: 'profil', label: 'Profil', icon: 'user' },
		{ id: 'subscription', label: 'Subscription', icon: 'book' },
		{ id: 'units', label: 'Units Saya', icon: 'receipt' },
		{ id: 'bootcamp', label: 'Bootcamp', icon: 'graduation' },
		{ id: 'transaksi', label: 'Riwayat Transaksi', icon: 'receipt' }
	];

	const genderOptions = ['Laki-laki', 'Perempuan'];
	const profesiOptions = [
		'Mahasiswa',
		'Fresh Graduate',
		'Karyawan',
		'Freelancer',
		'Entrepreneur',
		'Lainnya'
	];
	const targetOptions = [
		'Blockchain Developer',
		'Crypto Analyst',
		'DeFi Researcher',
		'Smart Contract Auditor',
		'Sharia Compliance',
		'Community Manager',
		'Data Analyst',
		'Product Manager',
		'Lainnya'
	];

	// Load profile from Firestore
	$effect(() => {
		if (!userAuth.loading && !userAuth.isLoggedIn) {
			goto('/auth/login');
			return;
		}
		if (userAuth.isLoggedIn && userAuth.user) {
			loadProfile();
			// Load user orders
			ordersLoading = true;
			const q = query(
				collection(db, 'orders'),
				where('userId', '==', userAuth.user.uid),
				orderBy('createdAt', 'desc')
			);
			const unsub = onSnapshot(q, (snap) => {
				userOrders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
				ordersLoading = false;
			});
			return unsub;
		}
	});

	async function loadProfile() {
		if (!userAuth.user) return;
		isLoading = true;
		try {
			const userRef = doc(db, 'users', userAuth.user.uid);
			const userSnap = await getDoc(userRef);
			if (userSnap.exists()) {
				const data = userSnap.data();
				namaLengkap = data.displayName || userAuth.user.displayName || '';
				tanggalLahir = data.tanggalLahir || '';
				gender = data.gender || '';
				nomorTelepon = data.nomorTelepon || '';
				alamat = data.alamat || '';
				profesi = data.profesi || '';
				targetPekerjaan = data.targetPekerjaan || '';
				linkResume = data.linkResume || '';
				notifikasi = data.notifikasi !== false;
			} else {
				namaLengkap = userAuth.user.displayName || '';
			}
		} catch (e) {
			console.error('Failed to load profile:', e);
		} finally {
			isLoading = false;
		}
	}

	async function saveProfile() {
		if (!userAuth.user) return;
		isSaving = true;
		saveSuccess = false;
		try {
			const userRef = doc(db, 'users', userAuth.user.uid);
			await setDoc(
				userRef,
				{
					displayName: namaLengkap,
					tanggalLahir,
					gender,
					nomorTelepon,
					alamat,
					profesi,
					targetPekerjaan,
					linkResume,
					notifikasi,
					updatedAt: serverTimestamp()
				},
				{ merge: true }
			);
			saveSuccess = true;
			setTimeout(() => {
				saveSuccess = false;
			}, 3000);
		} catch (e) {
			console.error('Failed to save profile:', e);
		} finally {
			isSaving = false;
		}
	}

	async function submitChangePassword() {
		pwdError = '';
		if (!newPassword || newPassword.length < 6) {
			pwdError = 'Password baru minimal 6 karakter';
			return;
		}
		if (newPassword !== confirmNewPassword) {
			pwdError = 'Konfirmasi password tidak cocok';
			return;
		}
		pwdLoading = true;
		try {
			await userAuth.changePassword(currentPassword, newPassword);
			pwdSuccess = true;
			setTimeout(() => {
				pwdSuccess = false;
				showChangePasswordModal = false;
			}, 1500);
		} catch (e) {
			pwdError = userAuth.error || e?.message || 'Gagal mengubah password';
		} finally {
			pwdLoading = false;
		}
	}


	function getUserInitial(): string {
		if (namaLengkap) return namaLengkap[0].toUpperCase();
		if (userAuth.user?.email) return userAuth.user.email[0].toUpperCase();
		return '?';
	}

	function formatDate(ts: any): string {
		if (!ts) return '-';
		const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
		return d.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		})
			.format(amount)
			.replace('Rp', 'Rp ');
	}

	const statusConfig: Record<string, { label: string; class: string }> = {
		pending: {
			label: 'Menunggu',
			class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
		},
		approved: {
			label: 'Disetujui',
			class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
		},
		rejected: {
			label: 'Ditolak',
			class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
		}
	};
</script>

<svelte:head>
	<title>Profil | CryptoSharia Academy</title>
</svelte:head>

{#if userAuth.loading || isLoading}
	<div class="flex min-h-[60vh] items-center justify-center">
		<div class="flex flex-col items-center gap-3">
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
			<span class="text-sm text-gray-500 dark:text-gray-400">Memuat profil...</span>
		</div>
	</div>
{:else if userAuth.isLoggedIn}
	<div class="min-h-screen bg-gray-50 pt-20 pb-16 dark:bg-gray-950">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
				<!-- Sidebar -->
				<aside class="space-y-1">
					<div
						class="mb-3 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500"
					>
						Menu
					</div>
					{#each menuItems as item}
						<button
							onclick={() => {
								activeMenu = item.id;
							}}
							class="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all {activeMenu ===
							item.id
								? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
								: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'}"
						>
							{#if item.icon === 'user'}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/></svg
								>
							{:else if item.icon === 'book'}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/></svg
								>
							{:else if item.icon === 'graduation'}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 14l9-5-9-5-9 5 9 5z"
									/><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
									/></svg
								>
							{:else if item.icon === 'receipt'}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/></svg
								>
							{/if}
							{item.label}
						</button>
					{/each}
				</aside>

				<!-- Main content -->
				<main>
					{#if activeMenu === 'profil'}
						<!-- Profile header -->
						<div class="mb-2 flex items-center gap-4">
							{#if userAuth.user?.photoURL}
								<img
									src={userAuth.user.photoURL}
									alt="Avatar"
									class="h-16 w-16 rounded-full object-cover shadow-md ring-4 ring-white dark:ring-gray-800"
								/>
							{:else}
								<div
									class="from-primary-500 to-primary-700 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-bold text-white shadow-md ring-4 ring-white dark:ring-gray-800"
								>
									{getUserInitial()}
								</div>
							{/if}
							<div>
								<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">
									Welcome, {namaLengkap || 'User'}!
								</h1>
								<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
									Berikut informasi mengenai profil kamu di seluruh layanan CryptoSharia.
								</p>
							</div>
						</div>

						{#if saveSuccess}
							<div
								class="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/></svg
								>
								Profil berhasil disimpan!
							</div>
						{/if}

						<!-- Profile form -->
						<form
							onsubmit={(e) => {
								e.preventDefault();
								saveProfile();
							}}
							class="mt-8 space-y-6"
						>
							<!-- Nama Lengkap -->
							<div>
								<label
									for="namaLengkap"
									class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
									>Nama Lengkap <span class="text-red-500">*</span></label
								>
								<input
									type="text"
									id="namaLengkap"
									bind:value={namaLengkap}
									placeholder="Masukkan nama lengkap kamu..."
									class="focus:ring-primary-500 focus:border-primary-500 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
								/>
							</div>

							<!-- Tanggal Lahir + Gender -->
							<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
								<div>
									<label
										for="tanggalLahir"
										class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
										>Tanggal Lahir</label
									>
									<input
										type="date"
										id="tanggalLahir"
										bind:value={tanggalLahir}
										class="focus:ring-primary-500 focus:border-primary-500 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
									/>
								</div>
								<div>
									<label
										for="gender"
										class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
										>Gender</label
									>
									<select
										id="gender"
										bind:value={gender}
										class="focus:ring-primary-500 focus:border-primary-500 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
									>
										<option value="">Pilih opsi...</option>
										{#each genderOptions as opt}
											<option value={opt}>{opt}</option>
										{/each}
									</select>
								</div>
							</div>

							<!-- Nomor Telepon + Alamat -->
							<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
								<div>
									<label
										for="nomorTelepon"
										class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
										>Nomor Telepon</label
									>
									<input
										type="tel"
										id="nomorTelepon"
										bind:value={nomorTelepon}
										placeholder="62812345678"
										class="focus:ring-primary-500 focus:border-primary-500 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
									/>
								</div>
								<div>
									<label
										for="alamat"
										class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
										>Alamat</label
									>
									<input
										type="text"
										id="alamat"
										bind:value={alamat}
										placeholder="Masukkan alamat kamu..."
										class="focus:ring-primary-500 focus:border-primary-500 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
									/>
								</div>
							</div>

							<!-- Profesi + Target Pekerjaan -->
							<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
								<div>
									<label
										for="profesi"
										class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
										>Profesi</label
									>
									<select
										id="profesi"
										bind:value={profesi}
										class="focus:ring-primary-500 focus:border-primary-500 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
									>
										<option value="">Masukkan atau pilih profesi kamu...</option>
										{#each profesiOptions as opt}
											<option value={opt}>{opt}</option>
										{/each}
									</select>
								</div>
								<div>
									<label
										for="targetPekerjaan"
										class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
										>Target Pekerjaan</label
									>
									<select
										id="targetPekerjaan"
										bind:value={targetPekerjaan}
										class="focus:ring-primary-500 focus:border-primary-500 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
									>
										<option value="">Masukkan atau pilih target pekerjaan kamu...</option>
										{#each targetOptions as opt}
											<option value={opt}>{opt}</option>
										{/each}
									</select>
								</div>
							</div>

							<!-- Link Resume -->
							<div>
								<label
									for="linkResume"
									class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
									>Link Resume / CV</label
								>
								<input
									type="url"
									id="linkResume"
									bind:value={linkResume}
									placeholder="https://example.com/my-resume"
									class="focus:ring-primary-500 focus:border-primary-500 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
								/>
								<p class="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
									CryptoSharia akan menghubungimu jika ada hiring partner yang tertarik dengan skill
									dan pengalamanmu.
								</p>
							</div>

							<!-- Save button -->
							<button
								type="submit"
								disabled={isSaving || !namaLengkap}
								class="bg-primary-600 hover:bg-primary-700 orange-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
							>
								{#if isSaving}
									<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"
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
									Menyimpan...
								{:else}
									Simpan Perubahan
								{/if}
							</button>
						</form>

						<!-- Divider -->
						<hr class="my-10 border-gray-200 dark:border-gray-800" />

						<!-- Pengaturan Akun -->
						<div class="mb-8">
							<h2 class="mb-4 text-xl font-extrabold text-gray-900 dark:text-white">
								Pengaturan Akun
							</h2>
							<div class="flex flex-wrap gap-3">
								<button
									class="text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold transition-all dark:border-gray-700"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/></svg
									>
									Ubah Email
								</button>
								<button
									type="button"
									onclick={() => {
										pwdError = '';
										pwdSuccess = false;
										currentPassword = '';
										newPassword = '';
										confirmNewPassword = '';
										showChangePasswordModal = true;
									}}
									class="text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold transition-all dark:border-gray-700"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/></svg
									>
									Ubah Password
								</button>
							</div>
						</div>

						{#if showChangePasswordModal}
							<div class="fixed inset-0 z-50 flex items-center justify-center">
								<div
									class="absolute inset-0 bg-black/50"
									onclick={() => (showChangePasswordModal = false)}
								></div>
								<div class="relative z-10 w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-800">
									<h3 class="mb-3 text-lg font-bold text-gray-900 dark:text-white">
										Ubah Password
									</h3>
									{#if pwdError}
										<div
											class="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
										>
											{pwdError}
										</div>
									{/if}
									{#if pwdSuccess}
										<div
											class="mb-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
										>
											Password berhasil diubah
										</div>
									{/if}
									<form onsubmit={(e) => { e.preventDefault(); submitChangePassword(); }} class="space-y-3">
										<div>
											<label class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
												>Password Saat Ini</label
											>
											<input
												type="password"
												bind:value={currentPassword}
												placeholder="Masukkan password lama"
												class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
											/>
										</div>
										<div>
											<label class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
												>Password Baru</label
											>
											<input
												type="password"
												bind:value={newPassword}
												placeholder="Masukkan password baru"
												class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
											/>
										</div>
										<div>
											<label class="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
												>Konfirmasi Password Baru</label
											>
											<input
												type="password"
												bind:value={confirmNewPassword}
												placeholder="Konfirmasi password baru"
												class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
											/>
										</div>
										<div class="mt-2 flex justify-end gap-2">
											<button
												type="button"
												onclick={() => (showChangePasswordModal = false)}
												class="rounded-xl border border-gray-200 px-4 py-2 text-sm dark:border-gray-700"
												>Batal</button
											>
											<button
												type="submit"
												disabled={pwdLoading}
												class="bg-primary-600 rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
											>
												{#if pwdLoading}
													Mengubah...
												{:else}
													Simpan
												{/if}
											</button>
										</div>
									</form>
								</div>
							</div>
						{/if}

						<!-- Pengaturan Notifikasi -->
						<div>
							<h2 class="mb-4 text-xl font-extrabold text-gray-900 dark:text-white">
								Pengaturan Notifikasi
							</h2>
							<label class="group flex cursor-pointer items-center gap-3">
								<input
									type="checkbox"
									bind:checked={notifikasi}
									class="text-primary-600 focus:ring-primary-500 h-5 w-5 cursor-pointer rounded border-gray-300 dark:border-gray-600"
								/>
								<span
									class="text-sm text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white"
								>
									Saya bersedia menerima update informasi dari CryptoSharia
								</span>
							</label>
						</div>
					{:else if activeMenu === 'subscription'}
						<!-- Subscription Section -->
						<div>
							<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">
								Langganan Kamu Aktif 🎉
							</h1>
							<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
								Akses semua materi selama langganan aktif.
							</p>

							<div class="mt-5 flex flex-wrap gap-3">
								<a
									href="/subscription"
									class="border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/></svg
									>
									Perpanjang Langganan
								</a>
								<a
									href="/subscription"
									class="bg-primary-600 hover:bg-primary-700 orange-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98]"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
										/></svg
									>
									Akses Semua Materi
								</a>
							</div>
						</div>

						<!-- Aktivitas Subscription -->
						<div class="mt-10">
							<h2 class="mb-5 text-xl font-extrabold text-gray-900 dark:text-white">
								Aktivitas Belajar Kamu
							</h2>

							<!-- Tabs -->
							{#snippet tabBtn(id: string, label: string, active: boolean)}
								<button
									onclick={() => {
										elearningTab = id;
									}}
									class="rounded-t-lg border-b-2 px-5 py-2.5 text-sm font-medium transition-all {active
										? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800'
										: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'}"
									>{label}</button
								>
							{/snippet}

							<div
								class="flex overflow-hidden rounded-t-xl border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
							>
								{@render tabBtn('terakhir', 'Terakhir Dipelajari', elearningTab === 'terakhir')}
								{@render tabBtn('tersimpan', 'Materi Tersimpan', elearningTab === 'tersimpan')}
								{@render tabBtn('selesai', 'Materi Selesai', elearningTab === 'selesai')}
							</div>

							<div class="py-8">
								{#if elearningTab === 'terakhir'}
									<p class="text-sm text-gray-400 italic dark:text-gray-500">
										Belum ada materi untuk ditampilkan.
									</p>
								{:else if elearningTab === 'tersimpan'}
									<p class="text-sm text-gray-400 italic dark:text-gray-500">
										Belum ada materi yang kamu simpan.
									</p>
								{:else if elearningTab === 'selesai'}
									<p class="text-sm text-gray-400 italic dark:text-gray-500">
										Belum ada materi yang selesai.
									</p>
								{/if}
							</div>

							<div class="flex items-center justify-between">
								<button
									class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 19l-7-7 7-7"
										/></svg
									>
									Sebelumnya
								</button>
								<button
									class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
								>
									Selanjutnya
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/></svg
									>
								</button>
							</div>
						</div>
					{:else if activeMenu === 'transaksi'}
						<!-- Riwayat Transaksi -->
						<h1 class="mb-6 text-2xl font-extrabold text-gray-900 dark:text-white">
							Riwayat Transaksi
						</h1>

						{#if ordersLoading}
							<div class="flex items-center gap-3 py-10">
								<svg class="text-primary-600 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"
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
								<span class="text-sm text-gray-500 dark:text-gray-400">Memuat transaksi...</span>
							</div>
						{:else if userOrders.length === 0}
							<div class="py-16 text-center">
								<div class="mb-3 text-4xl">📭</div>
								<p class="mb-4 text-sm text-gray-500 dark:text-gray-400">Belum ada transaksi.</p>
								<a
									href="/subscription"
									class="bg-primary-600 hover:bg-primary-700 orange-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
								>
									Lihat Paket Subscription
								</a>
							</div>
						{:else}
							<div class="space-y-3">
								{#each userOrders as order}
									<div
										class="rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
									>
										<div class="mb-2 flex items-center justify-between gap-4">
											<span class="text-sm font-bold text-gray-900 dark:text-white"
												>{order.packageTitle}</span
											>
											<span
												class="rounded-full px-2.5 py-0.5 text-[11px] font-bold {statusConfig[
													order.status
												]?.class || ''}"
											>
												{statusConfig[order.status]?.label || order.status}
											</span>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-xs text-gray-500 dark:text-gray-400"
												>{formatDate(order.createdAt)}</span
											>
											<span class="text-primary-600 text-sm font-bold"
												>{formatCurrency(order.amount)}</span
											>
										</div>
										{#if order.status === 'rejected' && order.adminNote}
											<div
												class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/10 dark:text-red-400"
											>
												<strong>Alasan:</strong>
												{order.adminNote}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					{:else}
						<!-- Placeholder for other menu items -->
						<div class="flex flex-col items-center justify-center py-20 text-center">
							<div class="mb-4 text-5xl">🚧</div>
							<h2 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">Segera Hadir</h2>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								Fitur ini sedang dalam pengembangan.
							</p>
						</div>
					{/if}
				</main>
			</div>
		</div>
	</div>
{/if}
