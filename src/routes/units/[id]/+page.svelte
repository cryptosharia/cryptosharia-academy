<script lang="ts">
	import { page } from '$app/state';
	import { userAuth } from '$lib/auth.svelte';
	import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { onMount } from 'svelte';

	interface Lesson { title: string; videoUrl: string; type: string; duration: string; }
	interface Unit { id: string; title: string; description: string; topics: number; duration: string; category: string; image: string; lessons: Lesson[]; price?: number; originalPrice?: number; }

	let unit = $state<Unit | null>(null);
	let isLoading = $state(true);
	let notFound = $state(false);
	let step = $state<'detail' | 'checkout' | 'done'>('detail');
	let isSubmitting = $state(false);
	let errorMsg = $state('');
	let orderId = $state('');
	let copied = $state(false);

	const bankInfo = { bank: 'BSI (Bank Syariah Indonesia)', accountNumber: '7189 2345 67', accountName: 'PT CryptoSharia Academy', logo: '🏦' };
	const adminWhatsApp = '6282186584279';

	const unitPrice = $derived(unit?.price ?? 49000);
	const originalPrice = $derived(unit?.originalPrice ?? 299000);
	const savings = $derived(Math.round((1 - unitPrice / originalPrice) * 100));

	const formatCurrency = (n: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n).replace('Rp', 'Rp ');

	onMount(async () => {
		const id = page.params.id;
		try {
			const snap = await getDoc(doc(db, 'elearning_courses', id));
			if (snap.exists()) {
				unit = { id: snap.id, price: 49000, originalPrice: 299000, ...snap.data() } as Unit;
				if (!unit.lessons) unit.lessons = [];
				if (!unit.description) unit.description = '';
			} else { notFound = true; }
		} catch (e) { notFound = true; }
		finally { isLoading = false; }
	});

	function copyAccountNumber() {
		navigator.clipboard.writeText(bankInfo.accountNumber.replace(/\s/g, ''));
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}

	async function submitOrder() {
		if (!userAuth.user || !unit) return;
		isSubmitting = true; errorMsg = '';
		try {
			const ref = await addDoc(collection(db, 'orders'), {
				userId: userAuth.user.uid,
				userEmail: userAuth.user.email,
				userName: userAuth.user.displayName || '',
				packageId: `unit-${unit.id}`,
				packageTitle: `[Unit] ${unit.title}`,
				amount: unitPrice,
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
				`💰 ${formatCurrency(unitPrice)}\n` +
				`📋 Order ID: ${ref.id}\n\n` +
				`Mohon kirimkan bukti transfer di chat ini. Admin akan mengkonfirmasi dalam 1x24 jam.`
			);
			window.open(`https://wa.me/${adminWhatsApp}?text=${msg}`, '_blank');
		} catch (e: any) {
			errorMsg = 'Gagal membuat pesanan: ' + (e.message || 'Coba lagi nanti.');
		} finally { isSubmitting = false; }
	}
</script>

<svelte:head>
	<title>{unit?.title || 'Materi Satuan'} | CryptoSharia Academy</title>
</svelte:head>

{#if isLoading}
	<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
		<svg class="animate-spin w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
	</div>

{:else if notFound || !unit}
	<div class="min-h-screen flex flex-col items-center justify-center px-4">
		<div class="text-6xl mb-4">📭</div>
		<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Materi Tidak Ditemukan</h1>
		<a href="/units" class="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-all mt-4">← Kembali ke Units</a>
	</div>

{:else if step === 'done'}
	<div class="min-h-screen flex flex-col items-center justify-center px-4 py-20">
		<div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
			<svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
		</div>
		<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Pesanan Berhasil Dibuat!</h1>
		<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Order ID: <span class="font-mono font-bold">{orderId}</span></p>
		<p class="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">Kirimkan bukti transfer via WhatsApp ke admin. Akses materi akan aktif dalam 1x24 jam setelah terkonfirmasi.</p>
		<div class="flex flex-col sm:flex-row gap-3">
			<a href="https://wa.me/{adminWhatsApp}" target="_blank" class="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700">Buka WhatsApp Admin</a>
			<a href="/units" class="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Kembali ke Units</a>
		</div>
	</div>

{:else}
	<div class="bg-gray-50 dark:bg-gray-950 min-h-screen pt-24 pb-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

			<!-- Breadcrumb -->
			<nav class="flex items-center gap-2 text-xs text-gray-400 mb-8">
				<a href="/units" class="hover:text-emerald-500 transition-colors">Units</a>
				<span>›</span>
				<span>{unit.category}</span>
				<span>›</span>
				<span class="text-gray-600 dark:text-gray-300">{unit.title}</span>
			</nav>

			<div class="grid lg:grid-cols-3 gap-8">
				<!-- Left: Course Info -->
				<div class="lg:col-span-2 space-y-6">
					<!-- Cover -->
					<div class="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-gray-900">
						<img src={unit.image || '/background-beranda.png'} alt={unit.title} class="w-full h-full object-cover opacity-70" />
						<div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
						<div class="absolute bottom-0 left-0 right-0 p-6">
							<span class="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-md mb-2">💳 Materi Satuan</span>
							<h1 class="text-2xl sm:text-3xl font-extrabold text-white">{unit.title}</h1>
						</div>
					</div>

					<!-- Meta -->
					<div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
						<span class="flex items-center gap-1.5">📖 {unit.topics} Topik</span>
						<span class="flex items-center gap-1.5">⏱ {unit.duration}</span>
						<span class="flex items-center gap-1.5">🎬 {unit.lessons.length} Video</span>
						<span class="px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold">{unit.category}</span>
					</div>

					<!-- Description -->
					{#if unit.description}
						<div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
							<h3 class="font-bold text-gray-900 dark:text-white mb-3">Tentang Materi Ini</h3>
							<p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{unit.description}</p>
						</div>
					{/if}

					<!-- Lesson List Preview -->
					{#if unit.lessons.length > 0}
						<div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
							<div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
								<h3 class="font-bold text-gray-900 dark:text-white">Daftar Materi ({unit.lessons.length} video)</h3>
							</div>
							<div class="divide-y divide-gray-100 dark:divide-gray-700">
								{#each unit.lessons.slice(0, 5) as lesson, i}
									<div class="flex items-center gap-3 px-6 py-3.5">
										<div class="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">{i + 1}</div>
										<span class="text-sm text-gray-700 dark:text-gray-300 flex-1">{lesson.title}</span>
										<span class="text-xs text-gray-400">{lesson.duration}</span>
										<span class="text-gray-400">🔒</span>
									</div>
								{/each}
								{#if unit.lessons.length > 5}
									<div class="px-6 py-3 text-xs text-gray-400 text-center">+{unit.lessons.length - 5} video lainnya setelah pembelian</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>

				<!-- Right: Checkout Sticky -->
				<div>
					<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
						<div class="mb-5">
							<div class="text-2xl font-extrabold text-emerald-600 mb-1">{formatCurrency(unitPrice)}</div>
							<div class="flex items-center gap-2">
								<span class="text-sm text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
								<span class="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Hemat {savings}%</span>
							</div>
							<p class="text-xs text-gray-400 mt-2">✅ Akses selamanya · 📜 Sertifikat · 🔓 Setelah konfirmasi admin</p>
						</div>

						{#if step === 'detail'}
							{#if userAuth.isLoggedIn}
								<button onclick={() => step = 'checkout'} class="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 font-bold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
									Beli Materi Ini
								</button>
							{:else}
								<a href="/auth/login" class="block w-full text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 font-bold text-sm transition-all">
									Login untuk Membeli
								</a>
							{/if}
							<div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
								<p class="text-xs text-gray-400 mb-2">Mau akses semua materi?</p>
								<a href="/subscription" class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">Lihat Paket Langganan →</a>
							</div>

						{:else}
							<!-- Checkout Step -->
							<div class="space-y-4">
								<h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Transfer ke Rekening</h3>
								<div class="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 p-4">
									<div class="flex items-center gap-3 mb-3">
										<span class="text-xl">{bankInfo.logo}</span>
										<div>
											<div class="font-bold text-sm text-gray-900 dark:text-white">{bankInfo.bank}</div>
											<div class="text-xs text-gray-500">a.n. {bankInfo.accountName}</div>
										</div>
									</div>
									<div class="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 border border-gray-200 dark:border-gray-700">
										<span class="font-mono font-bold text-gray-900 dark:text-white">{bankInfo.accountNumber}</span>
										<button onclick={copyAccountNumber} class="text-xs font-bold text-emerald-600">{copied ? '✓ Tersalin' : 'Salin'}</button>
									</div>
								</div>
								<div class="flex justify-between items-center py-3 border-t border-b border-gray-100 dark:border-gray-700">
									<span class="font-bold text-gray-900 dark:text-white text-sm">Total Transfer</span>
									<span class="text-lg font-extrabold text-emerald-600">{formatCurrency(unitPrice)}</span>
								</div>
								<div class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
									<strong>⚠️ Penting:</strong> Transfer tepat sesuai nominal, lalu kirim bukti via WhatsApp.
								</div>
								{#if errorMsg}
									<div class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 px-4 py-3 text-sm text-red-600">{errorMsg}</div>
								{/if}
								<button onclick={submitOrder} disabled={isSubmitting} class="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3.5 font-bold text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
									{#if isSubmitting}
										<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
										Memproses...
									{:else}
										Sudah Transfer — Kirim Bukti via WhatsApp
									{/if}
								</button>
								<button onclick={() => step = 'detail'} class="w-full text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 pt-1">← Kembali</button>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
