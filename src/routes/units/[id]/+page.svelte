<script lang="ts">
	import { page } from '$app/state';
	import { userAuth } from '$lib/auth.svelte';
	import {
		doc,
		getDoc,
		addDoc,
		collection,
		serverTimestamp,
		query,
		where,
		getDocs
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { onMount } from 'svelte';

	interface Lesson {
		title: string;
		videoUrl: string;
		type: string;
		duration: string;
	}
	interface Unit {
		id: string;
		title: string;
		description: string;
		topics: number;
		duration: string;
		category: string;
		image: string;
		lessons: Lesson[];
		price?: number;
		originalPrice?: number;
	}

	let unit = $state<Unit | null>(null);
	let isLoading = $state(true);
	let notFound = $state(false);
	let step = $state<'detail' | 'checkout' | 'done'>('detail');
	let isSubmitting = $state(false);
	let errorMsg = $state('');
	let orderId = $state('');
	let copied = $state(false);

	// Voucher state
	let voucherCode = $state('');
	let voucherLoading = $state(false);
	let voucherError = $state('');
	let appliedVoucher = $state<{ code: string; discount: number; type: 'percent' | 'fixed' } | null>(
		null
	);

	const bankInfo = {
		bank: 'BSI (Bank Syariah Indonesia)',
		accountNumber: '7189 2345 67',
		accountName: 'PT CryptoSharia Academy',
		logo: '🏦'
	};
	const adminWhatsApp = '6282186584279';

	const unitPrice = $derived(unit?.price ?? 49000);
	const originalPrice = $derived(unit?.originalPrice ?? 299000);
	const savings = $derived(Math.round((1 - unitPrice / originalPrice) * 100));

	// Final price after voucher
	const discountAmount = $derived(
		appliedVoucher
			? appliedVoucher.type === 'percent'
				? Math.round((unitPrice * appliedVoucher.discount) / 100)
				: appliedVoucher.discount
			: 0
	);
	const finalPrice = $derived(Math.max(0, unitPrice - discountAmount));

	const formatCurrency = (n: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
			.format(n)
			.replace('Rp', 'Rp ');

	onMount(async () => {
		const id = page.params.id;
		try {
			const snap = await getDoc(doc(db, 'elearning_courses', id));
			if (snap.exists()) {
				unit = { id: snap.id, price: 49000, originalPrice: 299000, ...snap.data() } as Unit;
				if (!unit.lessons) unit.lessons = [];
				if (!unit.description) unit.description = '';
			} else {
				notFound = true;
			}
		} catch (e) {
			notFound = true;
		} finally {
			isLoading = false;
		}
	});

	function copyAccountNumber() {
		navigator.clipboard.writeText(bankInfo.accountNumber.replace(/\s/g, ''));
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}

	async function applyVoucher() {
		if (!voucherCode.trim()) return;
		voucherLoading = true;
		voucherError = '';
		try {
			const q = query(
				collection(db, 'vouchers'),
				where('code', '==', voucherCode.trim().toUpperCase())
			);
			const snap = await getDocs(q);
			if (snap.empty) {
				voucherError = 'Kode voucher tidak ditemukan.';
				return;
			}
			const v = snap.docs[0].data();
			if (v.applicableTo && v.applicableTo !== 'all' && v.applicableTo !== 'units') {
				voucherError = 'Voucher ini tidak berlaku untuk pembelian satuan.';
				return;
			}
			if (v.expiryDate && new Date(v.expiryDate) < new Date()) {
				voucherError = 'Voucher sudah kedaluwarsa.';
				return;
			}
			if (v.maxUses && v.maxUses > 0 && (v.usedCount || 0) >= v.maxUses) {
				voucherError = 'Voucher sudah habis dipakai.';
				return;
			}
			appliedVoucher = { code: v.code, discount: v.discount, type: v.type };
		} catch (e) {
			voucherError = 'Gagal memvalidasi voucher.';
		} finally {
			voucherLoading = false;
		}
	}

	function removeVoucher() {
		appliedVoucher = null;
		voucherCode = '';
		voucherError = '';
	}

	async function submitOrder() {
		if (!userAuth.user || !unit) return;
		isSubmitting = true;
		errorMsg = '';
		try {
			const ref = await addDoc(collection(db, 'orders'), {
				userId: userAuth.user.uid,
				userEmail: userAuth.user.email,
				userName: userAuth.user.displayName || '',
				packageId: `unit-${unit.id}`,
				packageTitle: `[Unit] ${unit.title}`,
				amount: finalPrice,
				originalAmount: unitPrice,
				voucherCode: appliedVoucher?.code || '',
				voucherDiscount: discountAmount,
				type: 'unit',
				unitId: unit.id,
				status: 'pending',
				adminNote: '',
				createdAt: serverTimestamp()
			});
			orderId = ref.id;
			step = 'done';
			const msg = encodeURIComponent(
				`🔔 *Pembelian Materi Satuan CryptoSharia Academy*\n\n` +
					`👤 ${userAuth.user.displayName || userAuth.user.email}\n` +
					`📦 ${unit.title}\n` +
					`💰 ${formatCurrency(finalPrice)}${appliedVoucher ? ' (voucher: ' + appliedVoucher.code + ')' : ''}\n` +
					`📋 Order ID: ${ref.id}\n\n` +
					`Mohon kirimkan bukti transfer di chat ini. Admin akan mengkonfirmasi dalam 1x24 jam.`
			);
			window.open(`https://wa.me/${adminWhatsApp}?text=${msg}`, '_blank');
		} catch (e: any) {
			errorMsg = 'Gagal membuat pesanan: ' + (e.message || 'Coba lagi nanti.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>{unit?.title || 'Materi Satuan'} | CryptoSharia Academy</title>
</svelte:head>

{#if isLoading}
	<div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
		<svg class="h-8 w-8 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24"
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
	</div>
{:else if notFound || !unit}
	<div class="flex min-h-screen flex-col items-center justify-center px-4">
		<div class="mb-4 text-6xl">📭</div>
		<h1 class="mb-2 text-2xl font-extrabold text-gray-900 dark:text-white">
			Materi Tidak Ditemukan
		</h1>
		<a
			href="/units"
			class="mt-4 inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700"
			>← Kembali ke Units</a
		>
	</div>
{:else if step === 'done'}
	<div class="flex min-h-screen flex-col items-center justify-center px-4 py-20">
		<div
			class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
		>
			<svg class="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
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
			Order ID: <span class="font-mono font-bold">{orderId}</span>
		</p>
		<p class="mb-6 max-w-sm text-center text-sm text-gray-500 dark:text-gray-400">
			Kirimkan bukti transfer via WhatsApp ke admin. Akses materi akan aktif dalam 1x24 jam setelah
			terkonfirmasi.
		</p>
		<div class="flex flex-col gap-3 sm:flex-row">
			<a
				href="https://wa.me/{adminWhatsApp}"
				target="_blank"
				class="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700"
				>Buka WhatsApp Admin</a
			>
			<a
				href="/units"
				class="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
				>Kembali ke Units</a
			>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50 pt-24 pb-16 dark:bg-gray-950">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<!-- Breadcrumb -->
			<nav class="mb-8 flex items-center gap-2 text-xs text-gray-400">
				<a href="/units" class="transition-colors hover:text-emerald-500">Units</a>
				<span>›</span>
				<span>{unit.category}</span>
				<span>›</span>
				<span class="text-gray-600 dark:text-gray-300">{unit.title}</span>
			</nav>

			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Left: Course Info -->
				<div class="space-y-6 lg:col-span-2">
					<!-- Cover -->
					<div class="relative h-64 overflow-hidden rounded-2xl bg-gray-900 sm:h-80">
						<img
							src={unit.image || '/background-beranda.png'}
							alt={unit.title}
							class="h-full w-full object-cover opacity-70"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"
						></div>
						<div class="absolute right-0 bottom-0 left-0 p-6">
							<span
								class="mb-2 inline-block rounded-md bg-emerald-600 px-3 py-1 text-xs font-bold text-white"
								>💳 Materi Satuan</span
							>
							<h1 class="text-2xl font-extrabold text-white sm:text-3xl">{unit.title}</h1>
						</div>
					</div>

					<!-- Meta -->
					<div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
						<span class="flex items-center gap-1.5">📖 {unit.topics} Topik</span>
						<span class="flex items-center gap-1.5">⏱ {unit.duration}</span>
						<span class="flex items-center gap-1.5">🎬 {unit.lessons.length} Video</span>
						<span
							class="rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
							>{unit.category}</span
						>
					</div>

					<!-- Description -->
					{#if unit.description}
						<div
							class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
						>
							<h3 class="mb-3 font-bold text-gray-900 dark:text-white">Tentang Materi Ini</h3>
							<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
								{unit.description}
							</p>
						</div>
					{/if}

					<!-- Lesson List Preview -->
					{#if unit.lessons.length > 0}
						<div
							class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
						>
							<div class="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
								<h3 class="font-bold text-gray-900 dark:text-white">
									Daftar Materi ({unit.lessons.length} video)
								</h3>
							</div>
							<div class="divide-y divide-gray-100 dark:divide-gray-700">
								{#each unit.lessons.slice(0, 5) as lesson, i}
									<div class="flex items-center gap-3 px-6 py-3.5">
										<div
											class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500 dark:bg-gray-700"
										>
											{i + 1}
										</div>
										<span class="flex-1 text-sm text-gray-700 dark:text-gray-300"
											>{lesson.title}</span
										>
										<span class="text-xs text-gray-400">{lesson.duration}</span>
										<span class="text-gray-400">🔒</span>
									</div>
								{/each}
								{#if unit.lessons.length > 5}
									<div class="px-6 py-3 text-center text-xs text-gray-400">
										+{unit.lessons.length - 5} video lainnya setelah pembelian
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>

				<!-- Right: Checkout Sticky -->
				<div>
					<div
						class="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
					>
						<div class="mb-5">
							<div class="mb-1 text-2xl font-extrabold text-emerald-600">
								{formatCurrency(unitPrice)}
							</div>
							<div class="flex items-center gap-2">
								<span class="text-sm text-gray-400 line-through"
									>{formatCurrency(originalPrice)}</span
								>
								<span
									class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-600 dark:bg-green-900/30"
									>Hemat {savings}%</span
								>
							</div>
							<p class="mt-2 text-xs text-gray-400">
								✅ Akses selamanya · 📜 Sertifikat · 🔓 Setelah konfirmasi admin
							</p>
						</div>

						{#if step === 'detail'}
							{#if userAuth.isLoggedIn}
								<button
									onclick={() => (step = 'checkout')}
									class="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-95"
								>
									Beli Materi Ini
								</button>
							{:else}
								<a
									href="/auth/login"
									class="block w-full rounded-xl bg-emerald-600 py-3.5 text-center text-sm font-bold text-white transition-all hover:bg-emerald-700"
								>
									Login untuk Membeli
								</a>
							{/if}
							<div class="mt-4 border-t border-gray-100 pt-4 text-center dark:border-gray-700">
								<p class="mb-2 text-xs text-gray-400">Mau akses semua materi?</p>
								<a
									href="/subscription"
									class="text-primary-600 dark:text-primary-400 text-xs font-semibold hover:underline"
									>Lihat Paket Langganan →</a
								>
							</div>
						{:else}
							<!-- Checkout Step -->
							<div class="space-y-4">
								<h3 class="text-xs font-bold tracking-widest text-gray-400 uppercase">
									Transfer ke Rekening
								</h3>
								<div
									class="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-900/10"
								>
									<div class="mb-3 flex items-center gap-3">
										<span class="text-xl">{bankInfo.logo}</span>
										<div>
											<div class="text-sm font-bold text-gray-900 dark:text-white">
												{bankInfo.bank}
											</div>
											<div class="text-xs text-gray-500">a.n. {bankInfo.accountName}</div>
										</div>
									</div>
									<div
										class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
									>
										<span class="font-mono font-bold text-gray-900 dark:text-white"
											>{bankInfo.accountNumber}</span
										>
										<button onclick={copyAccountNumber} class="text-xs font-bold text-emerald-600"
											>{copied ? '✓ Tersalin' : 'Salin'}</button
										>
									</div>
								</div>
								<!-- Voucher Input -->
								<div class="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
									<label class="mb-2 block text-xs font-bold text-gray-500 dark:text-gray-400"
										>🏷️ Punya Kode Voucher?</label
									>
									{#if appliedVoucher}
										<div
											class="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20"
										>
											<span class="text-sm font-bold text-emerald-700 dark:text-emerald-400"
												>✅ {appliedVoucher.code} (-{appliedVoucher.type === 'percent'
													? appliedVoucher.discount + '%'
													: formatCurrency(appliedVoucher.discount)})</span
											>
											<button
												onclick={removeVoucher}
												class="text-xs font-bold text-red-500 hover:text-red-700">Hapus</button
											>
										</div>
									{:else}
										<div class="flex gap-2">
											<input
												type="text"
												bind:value={voucherCode}
												placeholder="Masukkan kode"
												class="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900"
											/>
											<button
												onclick={applyVoucher}
												disabled={voucherLoading || !voucherCode.trim()}
												class="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
											>
												{voucherLoading ? '...' : 'Pakai'}
											</button>
										</div>
										{#if voucherError}
											<p class="mt-1 text-xs text-red-500">{voucherError}</p>
										{/if}
									{/if}
								</div>

								<div class="space-y-2 border-t border-b border-gray-100 py-3 dark:border-gray-700">
									<div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
										<span>Harga materi</span>
										<span>{formatCurrency(unitPrice)}</span>
									</div>
									{#if appliedVoucher}
										<div class="flex justify-between text-sm text-emerald-600">
											<span>Diskon voucher</span>
											<span>-{formatCurrency(discountAmount)}</span>
										</div>
									{/if}
									<div
										class="flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-700"
									>
										<span class="text-sm font-bold text-gray-900 dark:text-white"
											>Total Transfer</span
										>
										<span class="text-lg font-extrabold text-emerald-600"
											>{formatCurrency(finalPrice)}</span
										>
									</div>
								</div>
								<div
									class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-700 dark:border-amber-800 dark:bg-amber-900/10 dark:text-amber-400"
								>
									<strong>⚠️ Penting:</strong> Transfer tepat sesuai nominal, lalu kirim bukti via WhatsApp.
								</div>
								{#if errorMsg}
									<div
										class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20"
									>
										{errorMsg}
									</div>
								{/if}
								<button
									onclick={submitOrder}
									disabled={isSubmitting}
									class="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50"
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
										Sudah Transfer — Kirim Bukti via WhatsApp
									{/if}
								</button>
								<button
									onclick={() => (step = 'detail')}
									class="w-full pt-1 text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
									>← Kembali</button
								>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
