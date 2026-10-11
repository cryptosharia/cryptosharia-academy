<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { userAuth } from '$lib/auth.svelte';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	const packageData = {
		id: '1-month-access',
		title: 'Paket Video E-Learning 1 Bulan',
		price: 29000,
		originalPrice: 350000,
		description:
			'Belajar kapan saja, di mana saja dan dapatkan sertifikat tiap menyelesaikan satu video materi.',
		benefits: [
			'1400+ Materi Video',
			'1400+ Modul Praktik Portfolio',
			'Sertifikat di Tiap Materi',
			'Grup Komunitas'
		],
		terms: [
			'Video dapat dinikmati hingga jangka waktu 1 bulan setelah pembayaran terkonfirmasi oleh admin',
			'Pembelian video hanya untuk perorangan. Sertifikat disesuaikan dengan nama dan email akun CryptoSharia'
		]
	};

	const bankInfo = {
		bank: 'BSI (Bank Syariah Indonesia)',
		accountNumber: '7189 2345 67',
		accountName: 'PT CryptoSharia Academy',
		logo: '🏦'
	};
	const adminWhatsApp = '6282186584279';

	let step = $state<'checkout' | 'submitting' | 'done'>('checkout');
	let isSubmitting = $state(false);
	let errorMsg = $state('');
	let orderId = $state('');
	let copied = $state(false);
	const total = packageData.price;

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
			.format(amount)
			.replace('Rp', 'Rp ');

	function copyAccountNumber() {
		navigator.clipboard.writeText(bankInfo.accountNumber.replace(/\s/g, ''));
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}

	async function submitOrder() {
		if (!userAuth.user) return;
		isSubmitting = true;
		errorMsg = '';
		try {
			const orderRef = await addDoc(collection(db, 'orders'), {
				userId: userAuth.user.uid,
				userEmail: userAuth.user.email,
				userName: userAuth.user.displayName || '',
				packageId: packageData.id,
				packageTitle: packageData.title,
				amount: total,
				status: 'pending',
				adminNote: '',
				createdAt: serverTimestamp()
			});
			orderId = orderRef.id;
			step = 'done';

			const waMessage = encodeURIComponent(
				`🔔 *Pembayaran Baru CryptoSharia Academy*\n\n` +
					`👤 ${userAuth.user.displayName || userAuth.user.email}\n` +
					`📦 ${packageData.title}\n` +
					`💰 ${formatCurrency(total)}\n` +
					`📋 Order ID: ${orderRef.id}\n\n` +
					`Mohon kirimkan bukti transfer di chat ini. Admin akan mengkonfirmasi dalam 1x24 jam.`
			);
			window.open(`https://wa.me/${adminWhatsApp}?text=${waMessage}`, '_blank');
		} catch (e: any) {
			console.error('Failed to submit order:', e);
			errorMsg = 'Gagal membuat pesanan: ' + (e.message || 'Coba lagi nanti.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Pembayaran | CryptoSharia Academy</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 pt-24 pb-12 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		{#if !userAuth.isLoggedIn && !userAuth.loading}
			<div class="mx-auto max-w-md py-20 text-center">
				<div class="mb-4 text-5xl">🔒</div>
				<h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Login Diperlukan</h2>
				<p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
					Silakan login terlebih dahulu untuk melanjutkan pembayaran.
				</p>
				<a
					href="/auth/login"
					class="bg-primary-600 hover:bg-primary-700 orange-glow inline-flex items-center rounded-xl px-6 py-3 text-sm font-bold text-white"
					>Masuk Sekarang</a
				>
			</div>
		{:else if step === 'done'}
			<div class="mx-auto max-w-lg py-16 text-center">
				<div
					class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
				>
					<svg
						class="h-10 w-10 text-green-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/></svg
					>
				</div>
				<h1 class="mb-3 text-2xl font-extrabold text-gray-900 dark:text-white">
					Pesanan Berhasil Dibuat!
				</h1>
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
					Order ID: <span class="font-mono font-bold text-gray-700 dark:text-gray-300"
						>{orderId}</span
					>
				</p>
				<p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
					Kirimkan <strong>bukti transfer via WhatsApp</strong> ke admin. Admin akan mengkonfirmasi pembayaranmu
					dalam 1x24 jam.
				</p>
				<div
					class="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left dark:border-amber-800 dark:bg-amber-900/10"
				>
					<p class="text-xs text-amber-700 dark:text-amber-400">
						<strong>📱 Langkah selanjutnya:</strong> Jendela WhatsApp seharusnya sudah terbuka. Kirimkan
						foto bukti transfer Anda ke admin di chat tersebut.
					</p>
				</div>
				<div class="flex flex-col justify-center gap-3 sm:flex-row">
					<a
						href="https://wa.me/{adminWhatsApp}"
						target="_blank"
						class="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700"
					>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
							/><path
								d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.625-1.474A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.581-5.938-1.593l-.424-.253-2.744.875.859-2.66-.279-.443A9.772 9.772 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818S21.818 6.577 21.818 12s-4.395 9.818-9.818 9.818z"
							/></svg
						>
						Buka WhatsApp Admin
					</a>
					<a
						href="/profile"
						class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
						>Lihat di Profil</a
					>
				</div>
			</div>
		{:else}
			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Left Column -->
				<div class="space-y-8 lg:col-span-2">
					<div
						class="from-primary-600 to-primary-700 relative overflow-hidden rounded-3xl bg-gradient-to-r p-8 text-white shadow-lg sm:p-12"
					>
						<div class="relative z-10 max-w-md">
							<span
								class="mb-4 inline-block rounded-lg bg-white/20 px-3 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur-sm"
								>eLearning</span
							>
							<h1 class="mb-4 text-3xl leading-tight font-extrabold sm:text-4xl">
								Pelajari Ratusan Skill Bersertifikat Sekali Bayar.
							</h1>
							<p class="text-primary-100">
								Fleksibel & Praktikal. Belajar langsung dari praktisi industri Crypto Syariah.
							</p>
						</div>
						<div
							class="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-3xl"
						></div>
					</div>

					<div
						class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
					>
						<span
							class="mb-4 inline-block rounded-md bg-gray-900 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase dark:bg-gray-700"
							>Berlangganan E-learning</span
						>
						<h2 class="mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
							{packageData.title}
						</h2>
						<div class="mb-8 flex items-baseline gap-3">
							<span class="text-primary-600 text-2xl font-black"
								>{formatCurrency(packageData.price)}</span
							>
							<span class="text-sm text-gray-400 line-through"
								>{formatCurrency(packageData.originalPrice)}</span
							>
							<span
								class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-600 dark:bg-green-900/30"
								>Hemat 92%</span
							>
						</div>
						<div class="space-y-6">
							<section>
								<h3 class="mb-2 font-bold text-gray-900 dark:text-white">Deskripsi</h3>
								<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
									{packageData.description}
								</p>
							</section>
							<section>
								<h3 class="mb-3 font-bold text-gray-900 dark:text-white">Benefit</h3>
								<ul class="grid gap-3 sm:grid-cols-2">
									{#each packageData.benefits as benefit}
										<li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
											<div
												class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30"
											>
												<svg
													class="h-3.5 w-3.5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													><path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="3"
														d="M5 13l4 4L19 7"
													/></svg
												>
											</div>
											{benefit}
										</li>
									{/each}
								</ul>
							</section>
							<section>
								<h3 class="mb-3 font-bold text-gray-900 dark:text-white">Ketentuan</h3>
								<ul class="space-y-3">
									{#each packageData.terms as term}
										<li
											class="flex items-start gap-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400"
										>
											<div class="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400">
												<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"
													><path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
													/></svg
												>
											</div>
											{term}
										</li>
									{/each}
								</ul>
							</section>
						</div>
					</div>
				</div>

				<!-- Right Column: Checkout -->
				<div class="space-y-6">
					<div
						class="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
					>
						<h3 class="mb-5 text-xs font-bold tracking-widest text-gray-400 uppercase">
							Transfer ke Rekening
						</h3>

						<div
							class="border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10 mb-6 rounded-xl border p-5"
						>
							<div class="mb-4 flex items-center gap-3">
								<div
									class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg text-xl"
								>
									{bankInfo.logo}
								</div>
								<div>
									<div class="text-sm font-bold text-gray-900 dark:text-white">{bankInfo.bank}</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">
										a.n. {bankInfo.accountName}
									</div>
								</div>
							</div>
							<div
								class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
							>
								<span
									class="font-mono text-lg font-bold tracking-wider text-gray-900 dark:text-white"
									>{bankInfo.accountNumber}</span
								>
								<button
									onclick={copyAccountNumber}
									class="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-xs font-bold transition-colors"
								>
									{copied ? '✓ Tersalin' : 'Salin'}
								</button>
							</div>
						</div>

						<div class="mb-6 space-y-2 border-t border-gray-100 pt-4 dark:border-gray-700">
							<div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
								<span>{packageData.title}</span>
								<span>{formatCurrency(packageData.price)}</span>
							</div>
							<div
								class="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700"
							>
								<span class="font-bold text-gray-900 dark:text-white">Total Transfer</span>
								<span class="text-primary-600 text-xl font-black">{formatCurrency(total)}</span>
							</div>
						</div>

						<div
							class="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-900/10"
						>
							<p class="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
								<strong>⚠️ Penting:</strong> Transfer <strong>tepat</strong> sesuai nominal. Setelah
								transfer, klik tombol di bawah lalu
								<strong>kirim bukti transfer via WhatsApp</strong>.
							</p>
						</div>

						{#if errorMsg}
							<div
								class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
							>
								{errorMsg}
							</div>
						{/if}

						<button
							onclick={submitOrder}
							disabled={isSubmitting}
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50"
						>
							{#if isSubmitting}
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
								Memproses...
							{:else}
								<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
									><path
										d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
									/><path
										d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.625-1.474A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.581-5.938-1.593l-.424-.253-2.744.875.859-2.66-.279-.443A9.772 9.772 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818S21.818 6.577 21.818 12s-4.395 9.818-9.818 9.818z"
									/></svg
								>
								Sudah Transfer — Kirim Bukti via WhatsApp
							{/if}
						</button>
					</div>

					<div class="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"
							><path
								fill-rule="evenodd"
								d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
								clip-rule="evenodd"
							/></svg
						>
						<span class="text-[10px] font-bold tracking-widest uppercase"
							>Secure Payment SSL Encrypted</span
						>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
