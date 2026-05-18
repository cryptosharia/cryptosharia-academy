<script lang="ts">
	import { goto } from '$app/navigation';
	import { userAuth } from '$lib/auth.svelte';
	import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	const ADMIN_EMAILS = ['admin@cryptosharia.id'];

	let orders = $state<any[]>([]);
	let isLoading = $state(true);
	let filterStatus = $state('pending');
	let selectedOrder = $state<any | null>(null);
	let isProcessing = $state(false);
	let rejectNote = $state('');

	const isAdmin = $derived(
		userAuth.isLoggedIn && userAuth.user?.email && ADMIN_EMAILS.includes(userAuth.user.email)
	);

	$effect(() => {
		if (!userAuth.loading && !isAdmin) {
			goto('/');
			return;
		}
		if (isAdmin) {
			const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
			const unsub = onSnapshot(q, (snap) => {
				orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
				isLoading = false;
			});
			return unsub;
		}
	});

	const filteredOrders = $derived(
		filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus)
	);

	function formatDate(ts: any): string {
		if (!ts) return '-';
		const d = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
		return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount).replace('Rp', 'Rp ');
	}

	async function approveOrder(order: any) {
		isProcessing = true;
		try {
			// Update order status
			await updateDoc(doc(db, 'orders', order.id), {
				status: 'approved',
				approvedAt: serverTimestamp(),
				approvedBy: userAuth.user?.email
			});

			if (order.type === 'unit') {
				// Unit purchase: grant access to specific unit
				const userSnap = await import('firebase/firestore').then(({ getDoc }) =>
					getDoc(doc(db, 'users', order.userId))
				);
				const existing = userSnap.exists() ? (userSnap.data().purchasedUnits || []) : [];
				await updateDoc(doc(db, 'users', order.userId), {
					purchasedUnits: [...new Set([...existing, order.unitId])]
				});
			} else {
				// Subscription: set expiry based on plan
				const expiry = new Date();
				const planId = order.planId || '1-bulan';
				if (planId === '12-bulan') expiry.setDate(expiry.getDate() + 365);
				else if (planId === '6-bulan') expiry.setDate(expiry.getDate() + 180);
				else expiry.setDate(expiry.getDate() + 30);

				await updateDoc(doc(db, 'users', order.userId), {
					subscriptionStatus: 'active',
					subscriptionExpiry: Timestamp.fromDate(expiry),
					subscriptionPackage: order.packageId
				});
			}

			selectedOrder = null;
		} catch (e) {
			console.error('Failed to approve:', e);
		} finally {
			isProcessing = false;
		}
	}

	async function rejectOrder(order: any) {
		if (!rejectNote.trim()) return;
		isProcessing = true;
		try {
			await updateDoc(doc(db, 'orders', order.id), {
				status: 'rejected',
				adminNote: rejectNote,
				rejectedAt: serverTimestamp(),
				rejectedBy: userAuth.user?.email
			});
			selectedOrder = null;
			rejectNote = '';
		} catch (e) {
			console.error('Failed to reject:', e);
		} finally {
			isProcessing = false;
		}
	}

	const statusConfig: Record<string, { label: string; class: string }> = {
		pending: { label: 'Menunggu', class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
		approved: { label: 'Disetujui', class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
		rejected: { label: 'Ditolak', class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' }
	};
</script>

<svelte:head>
	<title>Admin — Kelola Pembayaran | CryptoSharia Academy</title>
</svelte:head>

{#if userAuth.loading || isLoading}
	<div class="min-h-[60vh] flex items-center justify-center">
		<svg class="animate-spin w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
	</div>
{:else if isAdmin}
	<div class="pt-20 pb-16 bg-gray-50 dark:bg-gray-950 min-h-screen">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
				<div>
					<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Kelola Pembayaran</h1>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Total {orders.length} order · {orders.filter(o => o.status === 'pending').length} menunggu konfirmasi</p>
				</div>
			</div>

			<!-- Filter tabs -->
			<div class="flex gap-2 mb-6 overflow-x-auto">
				{#each [{ id: 'pending', label: 'Menunggu' }, { id: 'approved', label: 'Disetujui' }, { id: 'rejected', label: 'Ditolak' }, { id: 'all', label: 'Semua' }] as tab}
					<button
						onclick={() => { filterStatus = tab.id; }}
						class="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap {filterStatus === tab.id ? 'bg-primary-600 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}"
					>
						{tab.label}
						{#if tab.id !== 'all'}
							<span class="ml-1 text-xs opacity-70">({orders.filter(o => o.status === tab.id).length})</span>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Orders list -->
			{#if filteredOrders.length === 0}
				<div class="text-center py-16">
					<div class="text-4xl mb-3">📭</div>
					<p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada order untuk ditampilkan.</p>
				</div>
			{:else}
				<div class="space-y-3">
					{#each filteredOrders as order}
						<button
							onclick={() => { selectedOrder = order; rejectNote = ''; }}
							class="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
						>
							<div class="flex items-center justify-between gap-4">
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-3 mb-1">
										<span class="font-bold text-sm text-gray-900 dark:text-white truncate">{order.userName || order.userEmail}</span>
										<span class="px-2 py-0.5 rounded-full text-[10px] font-bold {statusConfig[order.status]?.class || ''}">
											{statusConfig[order.status]?.label || order.status}
										</span>
									</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">{order.packageTitle} · {formatDate(order.createdAt)}</div>
								</div>
								<span class="font-bold text-primary-600 whitespace-nowrap">{formatCurrency(order.amount)}</span>
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Order Detail Modal -->
	{#if selectedOrder}
		<div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
			<button onclick={() => { selectedOrder = null; }} class="absolute inset-0 bg-black/50 backdrop-blur-sm"></button>
			<div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
				<button onclick={() => { selectedOrder = null; }} class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
				</button>

				<h2 class="text-lg font-extrabold text-gray-900 dark:text-white mb-4">Detail Order</h2>

				<div class="space-y-3 mb-6">
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Order ID</span>
						<span class="font-mono font-bold text-gray-900 dark:text-white text-xs">{selectedOrder.id}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">User</span>
						<span class="font-semibold text-gray-900 dark:text-white">{selectedOrder.userName || '-'}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Email</span>
						<span class="text-gray-900 dark:text-white">{selectedOrder.userEmail}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Paket</span>
						<span class="font-semibold text-gray-900 dark:text-white">{selectedOrder.packageTitle}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Total</span>
						<span class="font-bold text-primary-600">{formatCurrency(selectedOrder.amount)}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Tanggal</span>
						<span class="text-gray-900 dark:text-white">{formatDate(selectedOrder.createdAt)}</span>
					</div>
					<div class="flex justify-between text-sm items-center">
						<span class="text-gray-500 dark:text-gray-400">Status</span>
						<span class="px-2 py-0.5 rounded-full text-xs font-bold {statusConfig[selectedOrder.status]?.class || ''}">
							{statusConfig[selectedOrder.status]?.label || selectedOrder.status}
						</span>
					</div>
				</div>

				<!-- Bukti Transfer -->
				{#if selectedOrder.paymentProofURL}
					<div class="mb-6">
						<h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2">Bukti Transfer</h3>
						<a href={selectedOrder.paymentProofURL} target="_blank" rel="noopener">
							<img src={selectedOrder.paymentProofURL} alt="Bukti Transfer" class="rounded-xl border border-gray-200 dark:border-gray-700 max-h-64 w-full object-contain bg-gray-50 dark:bg-gray-900" />
						</a>
					</div>
				{/if}

				<!-- Admin Actions -->
				{#if selectedOrder.status === 'pending'}
					<div class="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
						<button
							onclick={() => approveOrder(selectedOrder)}
							disabled={isProcessing}
							class="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
						>
							{isProcessing ? 'Memproses...' : '✓ Approve — Aktifkan Langganan'}
						</button>
						<div>
							<textarea
								bind:value={rejectNote}
								placeholder="Alasan penolakan (wajib diisi)..."
								rows="2"
								class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-red-500 mb-2"
							></textarea>
							<button
								onclick={() => rejectOrder(selectedOrder)}
								disabled={isProcessing || !rejectNote.trim()}
								class="w-full rounded-xl border border-red-200 dark:border-red-800 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-40"
							>
								✕ Reject Pembayaran
							</button>
						</div>
					</div>
				{:else if selectedOrder.status === 'rejected' && selectedOrder.adminNote}
					<div class="pt-4 border-t border-gray-100 dark:border-gray-700">
						<p class="text-xs font-bold text-red-600 dark:text-red-400 mb-1">Alasan Penolakan:</p>
						<p class="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.adminNote}</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/if}
