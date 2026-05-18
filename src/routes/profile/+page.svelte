<script lang="ts">
	import { goto } from '$app/navigation';
	import { userAuth } from '$lib/auth.svelte';
	import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
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
	const profesiOptions = ['Mahasiswa', 'Fresh Graduate', 'Karyawan', 'Freelancer', 'Entrepreneur', 'Lainnya'];
	const targetOptions = ['Blockchain Developer', 'Crypto Analyst', 'DeFi Researcher', 'Smart Contract Auditor', 'Sharia Compliance', 'Community Manager', 'Data Analyst', 'Product Manager', 'Lainnya'];

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
			const q = query(collection(db, 'orders'), where('userId', '==', userAuth.user.uid), orderBy('createdAt', 'desc'));
			const unsub = onSnapshot(q, (snap) => {
				userOrders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
			await setDoc(userRef, {
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
			}, { merge: true });
			saveSuccess = true;
			setTimeout(() => { saveSuccess = false; }, 3000);
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
		return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount).replace('Rp', 'Rp ');
	}

	const statusConfig: Record<string, { label: string; class: string }> = {
		pending: { label: 'Menunggu', class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
		approved: { label: 'Disetujui', class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
		rejected: { label: 'Ditolak', class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' }
	};
</script>

<svelte:head>
	<title>Profil | CryptoSharia Academy</title>
</svelte:head>

{#if userAuth.loading || isLoading}
	<div class="min-h-[60vh] flex items-center justify-center">
		<div class="flex flex-col items-center gap-3">
			<svg class="animate-spin w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
			<span class="text-sm text-gray-500 dark:text-gray-400">Memuat profil...</span>
		</div>
	</div>
{:else if userAuth.isLoggedIn}
	<div class="pt-20 pb-16 bg-gray-50 dark:bg-gray-950 min-h-screen">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
				<!-- Sidebar -->
				<aside class="space-y-1">
					<div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-3">Menu</div>
					{#each menuItems as item}
						<button
							onclick={() => { activeMenu = item.id; }}
							class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all {activeMenu === item.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}"
						>
							{#if item.icon === 'user'}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
							{:else if item.icon === 'book'}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
							{:else if item.icon === 'graduation'}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
							{:else if item.icon === 'receipt'}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
							{/if}
							{item.label}
						</button>
					{/each}
				</aside>

				<!-- Main content -->
				<main>
					{#if activeMenu === 'profil'}
						<!-- Profile header -->
						<div class="flex items-center gap-4 mb-2">
							{#if userAuth.user?.photoURL}
								<img src={userAuth.user.photoURL} alt="Avatar" class="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-md" />
							{:else}
								<div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white dark:ring-gray-800 shadow-md">
									{getUserInitial()}
								</div>
							{/if}
							<div>
								<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome, {namaLengkap || 'User'}!</h1>
								<p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Berikut informasi mengenai profil kamu di seluruh layanan CryptoSharia.</p>
							</div>
						</div>

						{#if saveSuccess}
							<div class="mt-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
								Profil berhasil disimpan!
							</div>
						{/if}

						<!-- Profile form -->
						<form onsubmit={(e) => { e.preventDefault(); saveProfile(); }} class="mt-8 space-y-6">
							<!-- Nama Lengkap -->
							<div>
								<label for="namaLengkap" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Nama Lengkap <span class="text-red-500">*</span></label>
								<input type="text" id="namaLengkap" bind:value={namaLengkap} placeholder="Masukkan nama lengkap kamu..."
									class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
							</div>

							<!-- Tanggal Lahir + Gender -->
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
								<div>
									<label for="tanggalLahir" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Tanggal Lahir</label>
									<input type="date" id="tanggalLahir" bind:value={tanggalLahir}
										class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
								</div>
								<div>
									<label for="gender" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Gender</label>
									<select id="gender" bind:value={gender}
										class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer">
										<option value="">Pilih opsi...</option>
										{#each genderOptions as opt}
											<option value={opt}>{opt}</option>
										{/each}
									</select>
								</div>
							</div>

							<!-- Nomor Telepon + Alamat -->
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
								<div>
									<label for="nomorTelepon" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Nomor Telepon</label>
									<input type="tel" id="nomorTelepon" bind:value={nomorTelepon} placeholder="62812345678"
										class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
								</div>
								<div>
									<label for="alamat" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Alamat</label>
									<input type="text" id="alamat" bind:value={alamat} placeholder="Masukkan alamat kamu..."
										class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
								</div>
							</div>

							<!-- Profesi + Target Pekerjaan -->
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
								<div>
									<label for="profesi" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Profesi</label>
									<select id="profesi" bind:value={profesi}
										class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer">
										<option value="">Masukkan atau pilih profesi kamu...</option>
										{#each profesiOptions as opt}
											<option value={opt}>{opt}</option>
										{/each}
									</select>
								</div>
								<div>
									<label for="targetPekerjaan" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Target Pekerjaan</label>
									<select id="targetPekerjaan" bind:value={targetPekerjaan}
										class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer">
										<option value="">Masukkan atau pilih target pekerjaan kamu...</option>
										{#each targetOptions as opt}
											<option value={opt}>{opt}</option>
										{/each}
									</select>
								</div>
							</div>

							<!-- Link Resume -->
							<div>
								<label for="linkResume" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Link Resume / CV</label>
								<input type="url" id="linkResume" bind:value={linkResume} placeholder="https://example.com/my-resume"
									class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
								<p class="mt-1.5 text-xs text-gray-400 dark:text-gray-500">CryptoSharia akan menghubungimu jika ada hiring partner yang tertarik dengan skill dan pengalamanmu.</p>
							</div>

							<!-- Save button -->
							<button type="submit" disabled={isSaving || !namaLengkap}
								class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed orange-glow">
								{#if isSaving}
									<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
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
							<h2 class="text-xl font-extrabold text-gray-900 dark:text-white mb-4">Pengaturan Akun</h2>
							<div class="flex flex-wrap gap-3">
								<button class="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-2.5 text-sm font-semibold text-primary-600 dark:text-primary-400 transition-all hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
									Ubah Email
								</button>
								<button type="button" onclick={() => { pwdError=''; pwdSuccess=false; currentPassword=''; newPassword=''; confirmNewPassword=''; showChangePasswordModal = true; }} class="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-2.5 text-sm font-semibold text-primary-600 dark:text-primary-400 transition-all hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
									Ubah Password
								</button>
							</div>
						</div>

						{#if showChangePasswordModal}
							<div class="fixed inset-0 z-50 flex items-center justify-center">
								<div class="absolute inset-0 bg-black/50" on:click={() => (showChangePasswordModal = false)}></div>
								<div class="relative bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md z-10">
									<h3 class="text-lg font-bold mb-3 text-gray-900 dark:text-white">Ubah Password</h3>
									{#if pwdError}
										<div class="mb-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-700 dark:text-red-400">{pwdError}</div>
									{/if}
									{#if pwdSuccess}
										<div class="mb-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-3 py-2 text-sm text-green-700 dark:text-green-400">Password berhasil diubah</div>
									{/if}
									<form on:submit|preventDefault={submitChangePassword} class="space-y-3">
										<div>
											<label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Password Saat Ini</label>
											<input type="password" bind:value={currentPassword} placeholder="Masukkan password lama" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" />
										</div>
										<div>
											<label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Password Baru</label>
											<input type="password" bind:value={newPassword} placeholder="Masukkan password baru" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" />
										</div>
										<div>
											<label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Konfirmasi Password Baru</label>
											<input type="password" bind:value={confirmNewPassword} placeholder="Konfirmasi password baru" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" />
										</div>
										<div class="flex justify-end gap-2 mt-2">
											<button type="button" onclick={() => (showChangePasswordModal = false)} class="rounded-xl px-4 py-2 text-sm border border-gray-200 dark:border-gray-700">Batal</button>
											<button type="submit" disabled={pwdLoading} class="rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
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
							<h2 class="text-xl font-extrabold text-gray-900 dark:text-white mb-4">Pengaturan Notifikasi</h2>
							<label class="flex items-center gap-3 cursor-pointer group">
								<input type="checkbox" bind:checked={notifikasi}
									class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer" />
								<span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
									Saya bersedia menerima update informasi dari CryptoSharia
								</span>
							</label>
						</div>
					{:else if activeMenu === 'subscription'}
						<!-- Subscription Section -->
						<div>
							<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Langganan Kamu Aktif 🎉</h1>
							<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Akses semua materi selama langganan aktif.</p>

							<div class="mt-5 flex flex-wrap gap-3">
								<a href="/subscription" class="inline-flex items-center gap-2 rounded-xl border border-primary-500 dark:border-primary-600 px-5 py-2.5 text-sm font-semibold text-primary-600 dark:text-primary-400 transition-all hover:bg-primary-50 dark:hover:bg-primary-900/20 active:scale-[0.98]">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
									Perpanjang Langganan
								</a>
								<a href="/subscription" class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 active:scale-[0.98] orange-glow">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
									Akses Semua Materi
								</a>
							</div>
						</div>
						</div>

						<!-- Aktivitas Subscription -->
						<div class="mt-10">
							<h2 class="text-xl font-extrabold text-gray-900 dark:text-white mb-5">Aktivitas Belajar Kamu</h2>

							<!-- Tabs -->
							{#snippet tabBtn(id: string, label: string, active: boolean)}
								<button
									onclick={() => { elearningTab = id; }}
									class="px-5 py-2.5 text-sm font-medium transition-all rounded-t-lg border-b-2 {active ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}"
								>{label}</button>
							{/snippet}

							<div class="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-xl overflow-hidden">
								{@render tabBtn('terakhir', 'Terakhir Dipelajari', elearningTab === 'terakhir')}
								{@render tabBtn('tersimpan', 'Materi Tersimpan', elearningTab === 'tersimpan')}
								{@render tabBtn('selesai', 'Materi Selesai', elearningTab === 'selesai')}
							</div>

							<div class="py-8">
								{#if elearningTab === 'terakhir'}
									<p class="italic text-gray-400 dark:text-gray-500 text-sm">Belum ada materi untuk ditampilkan.</p>
								{:else if elearningTab === 'tersimpan'}
									<p class="italic text-gray-400 dark:text-gray-500 text-sm">Belum ada materi yang kamu simpan.</p>
								{:else if elearningTab === 'selesai'}
									<p class="italic text-gray-400 dark:text-gray-500 text-sm">Belum ada materi yang selesai.</p>
								{/if}
							</div>

							<div class="flex items-center justify-between">
								<button class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
									Sebelumnya
								</button>
								<button class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
									Selanjutnya
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
								</button>
							</div>
						</div>
					{:else if activeMenu === 'transaksi'}
						<!-- Riwayat Transaksi -->
						<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Riwayat Transaksi</h1>

						{#if ordersLoading}
							<div class="flex items-center gap-3 py-10">
								<svg class="animate-spin w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
								<span class="text-sm text-gray-500 dark:text-gray-400">Memuat transaksi...</span>
							</div>
						{:else if userOrders.length === 0}
							<div class="text-center py-16">
								<div class="text-4xl mb-3">📭</div>
								<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Belum ada transaksi.</p>
								<a href="/subscription" class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 orange-glow">
									Lihat Paket Subscription
								</a>
							</div>
						{:else}
							<div class="space-y-3">
								{#each userOrders as order}
									<div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
										<div class="flex items-center justify-between gap-4 mb-2">
											<span class="font-bold text-sm text-gray-900 dark:text-white">{order.packageTitle}</span>
											<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold {statusConfig[order.status]?.class || ''}">
												{statusConfig[order.status]?.label || order.status}
											</span>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-xs text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</span>
											<span class="font-bold text-sm text-primary-600">{formatCurrency(order.amount)}</span>
										</div>
										{#if order.status === 'rejected' && order.adminNote}
											<div class="mt-3 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-xs text-red-600 dark:text-red-400">
												<strong>Alasan:</strong> {order.adminNote}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					{:else}
						<!-- Placeholder for other menu items -->
						<div class="flex flex-col items-center justify-center py-20 text-center">
							<div class="text-5xl mb-4">🚧</div>
							<h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Segera Hadir</h2>
							<p class="text-sm text-gray-500 dark:text-gray-400">Fitur ini sedang dalam pengembangan.</p>
						</div>
					{/if}
				</main>
			</div>
		</div>
	</div>
{/if}
