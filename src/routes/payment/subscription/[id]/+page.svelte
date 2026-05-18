<script lang="ts">
	import { page } from '$app/state';
	import { userAuth } from '$lib/auth.svelte';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	// Pick plan from URL param
	const planId = $derived(page.params.id);

	const plans: Record<string, { id: string; name: string; price: number; originalPrice: number; description: string; benefits: string[]; terms: string[] }> = {
		'12-bulan': {
			id: '12-month-subscription',
			name: 'Langganan 12 Bulan',
			price: 179000,
			originalPrice: 599000,
			description: 'Akses penuh seluruh konten selama 12 bulan. Paket paling hemat dengan harga Rp 14.900/bulan.',
			benefits: ['1400+ Materi Video', '500+ Modul Praktik Portfolio', 'Sertifikat di Tiap Materi', 'Grup Komunitas', 'FREE Q&A Webinar Series', 'Diskon untuk Bootcamp'],
			terms: ['Akses berlaku 12 bulan setelah pembayaran terkonfirmasi', 'Berlaku hanya untuk akun perorangan']
		},
		'6-bulan': {
			id: '6-month-subscription',
			name: 'Langganan 6 Bulan',
			price: 99000,
			originalPrice: 299000,
			description: 'Akses penuh seluruh konten selama 6 bulan dengan harga Rp 16.500/bulan.',
			benefits: ['1400+ Materi Video', '500+ Modul Praktik Portfolio', 'Sertifikat di Tiap Materi', 'Grup Komunitas', 'FREE Q&A Webinar Series', 'Diskon untuk Bootcamp'],
			terms: ['Akses berlaku 6 bulan setelah pembayaran terkonfirmasi', 'Berlaku hanya untuk akun perorangan']
		},
		'1-bulan': {
			id: '1-month-subscription',
			name: 'Langganan 1 Bulan',
			price: 29000,
			originalPrice: 149000,
			description: 'Coba akses semua konten selama 1 bulan penuh.',
			benefits: ['1400+ Materi Video', '500+ Modul Praktik Portfolio', 'Sertifikat di Tiap Materi', 'Grup Komunitas'],
			terms: ['Akses berlaku 30 hari setelah pembayaran terkonfirmasi', 'Berlaku hanya untuk akun perorangan']
		}
	};

	const packageData = $derived(plans[planId] || plans['1-bulan']);

	const bankInfo = { bank: 'BSI (Bank Syariah Indonesia)', accountNumber: '7189 2345 67', accountName: 'PT CryptoSharia Academy', logo: '🏦' };
	const adminWhatsApp = '6282186584279';

	let step = $state<'checkout' | 'submitting' | 'done'>('checkout');
	let isSubmitting = $state(false);
	let errorMsg = $state('');
	let orderId = $state('');
	let copied = $state(false);

	const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount).replace('Rp', 'Rp ');

	const savings = $derived(Math.round((1 - packageData.price / packageData.originalPrice) * 100));

	function copyAccountNumber() {
		navigator.clipboard.writeText(bankInfo.accountNumber.replace(/\s/g, ''));
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
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
				packageTitle: packageData.name,
				amount: packageData.price,
				type: 'subscription',
				planId: planId,
				status: 'pending',
				adminNote: '',
				createdAt: serverTimestamp()
			});
			orderId = orderRef.id;
			step = 'done';
			const waMessage = encodeURIComponent(
				`🔔 *Pembayaran Subscription CryptoSharia Academy*\n\n` +
				`👤 ${userAuth.user.displayName || userAuth.user.email}\n` +
				`📦 ${packageData.name}\n` +
				`💰 ${formatCurrency(packageData.price)}\n` +
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
	<title>Berlangganan {packageData.name} | CryptoSharia Academy</title>
</svelte:head>

<div class="bg-gray-50 dark:bg-gray-950 min-h-screen pt-24 pb-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

		{#if !userAuth.isLoggedIn && !userAuth.loading}
			<div class="max-w-md mx-auto text-center py-20">
				<div class="text-5xl mb-4">🔒</div>
				<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Login Diperlukan</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Silakan login terlebih dahulu untuk melanjutkan pembayaran.</p>
				<a href="/auth/login" class="inline-flex items-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700 orange-glow">Masuk Sekarang</a>
			</div>

		{:else if step === 'done'}
			<div class="max-w-lg mx-auto text-center py-16">
				<div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
					<svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
				</div>
				<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Pesanan Berhasil Dibuat!</h1>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Order ID: <span class="font-mono font-bold text-gray-700 dark:text-gray-300">{orderId}</span></p>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Kirimkan <strong>bukti transfer via WhatsApp</strong> ke admin. Admin akan mengkonfirmasi dalam 1x24 jam.</p>
				<div class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-8 text-left">
					<p class="text-xs text-amber-700 dark:text-amber-400"><strong>📱 Langkah selanjutnya:</strong> Jendela WhatsApp seharusnya sudah terbuka. Kirimkan foto bukti transfer Anda ke admin di chat tersebut.</p>
				</div>
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<a href="https://wa.me/{adminWhatsApp}" target="_blank" class="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.625-1.474A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.581-5.938-1.593l-.424-.253-2.744.875.859-2.66-.279-.443A9.772 9.772 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818S21.818 6.577 21.818 12s-4.395 9.818-9.818 9.818z"/></svg>
						Buka WhatsApp Admin
					</a>
					<a href="/profile" class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Lihat di Profil</a>
				</div>
			</div>

		{:else}
			<div class="grid lg:grid-cols-3 gap-8">
				<!-- Left Column -->
				<div class="lg:col-span-2 space-y-8">
					<div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 sm:p-12 shadow-lg">
						<div class="relative z-10 max-w-md">
							<span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold mb-4 uppercase tracking-wider">Subscription</span>
							<h1 class="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">Akses Semua Materi Tanpa Batas</h1>
							<p class="text-primary-100">Belajar dari praktisi industri Crypto Syariah kapan saja dan di mana saja.</p>
						</div>
						<div class="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
					</div>

					<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
						<span class="inline-block px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-[10px] font-bold rounded-md mb-4 uppercase tracking-widest">Paket Berlangganan</span>
						<h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{packageData.name}</h2>
						<div class="flex items-baseline gap-3 mb-8">
							<span class="text-2xl font-black text-primary-600">{formatCurrency(packageData.price)}</span>
							<span class="text-gray-400 line-through text-sm">{formatCurrency(packageData.originalPrice)}</span>
							<span class="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Hemat {savings}%</span>
						</div>
						<div class="space-y-6">
							<section>
								<h3 class="font-bold text-gray-900 dark:text-white mb-2">Deskripsi</h3>
								<p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{packageData.description}</p>
							</section>
							<section>
								<h3 class="font-bold text-gray-900 dark:text-white mb-3">Benefit</h3>
								<ul class="grid sm:grid-cols-2 gap-3">
									{#each packageData.benefits as benefit}
										<li class="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
											<div class="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center flex-shrink-0">
												<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
											</div>
											{benefit}
										</li>
									{/each}
								</ul>
							</section>
							<section>
								<h3 class="font-bold text-gray-900 dark:text-white mb-3">Ketentuan</h3>
								<ul class="space-y-3">
									{#each packageData.terms as term}
										<li class="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
											<div class="mt-0.5 w-4 h-4 text-orange-400 flex-shrink-0"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
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
					<div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
						<h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Transfer ke Rekening</h3>
						<div class="rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10 p-5 mb-6">
							<div class="flex items-center gap-3 mb-4">
								<div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xl">{bankInfo.logo}</div>
								<div>
									<div class="font-bold text-sm text-gray-900 dark:text-white">{bankInfo.bank}</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">a.n. {bankInfo.accountName}</div>
								</div>
							</div>
							<div class="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
								<span class="font-mono font-bold text-lg text-gray-900 dark:text-white tracking-wider">{bankInfo.accountNumber}</span>
								<button onclick={copyAccountNumber} class="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
									{copied ? '✓ Tersalin' : 'Salin'}
								</button>
							</div>
						</div>
						<div class="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700 mb-6">
							<div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
								<span>{packageData.name}</span>
								<span>{formatCurrency(packageData.price)}</span>
							</div>
							<div class="flex justify-between items-center pt-3 mt-2 border-t border-gray-100 dark:border-gray-700">
								<span class="font-bold text-gray-900 dark:text-white">Total Transfer</span>
								<span class="text-xl font-black text-primary-600">{formatCurrency(packageData.price)}</span>
							</div>
						</div>
						<div class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-6">
							<p class="text-xs text-amber-700 dark:text-amber-400 leading-relaxed"><strong>⚠️ Penting:</strong> Transfer <strong>tepat</strong> sesuai nominal. Setelah transfer, klik tombol di bawah lalu <strong>kirim bukti transfer via WhatsApp</strong>.</p>
						</div>
						{#if errorMsg}
							<div class="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">{errorMsg}</div>
						{/if}
						<button onclick={submitOrder} disabled={isSubmitting} class="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
							{#if isSubmitting}
								<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
								Memproses...
							{:else}
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.625-1.474A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.581-5.938-1.593l-.424-.253-2.744.875.859-2.66-.279-.443A9.772 9.772 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818S21.818 6.577 21.818 12s-4.395 9.818-9.818 9.818z"/></svg>
								Sudah Transfer — Kirim Bukti via WhatsApp
							{/if}
						</button>
						<div class="mt-4 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
							<span class="text-[10px] font-bold uppercase tracking-widest">Secure Payment SSL Encrypted</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
