<script lang="ts">
	import { goto } from '$app/navigation';
	import { userAuth } from '$lib/auth.svelte';
	import {
		collection,
		query,
		orderBy,
		onSnapshot,
		doc,
		updateDoc,
		serverTimestamp,
		Timestamp
	} from 'firebase/firestore';
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
				orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
				isLoading = false;
			});
			return unsub;
		}
	});

	const filteredOrders = $derived(
		filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus)
	);

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
				const existing = userSnap.exists() ? userSnap.data().purchasedUnits || [] : [];
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
	<title>Admin — Kelola Pembayaran | CryptoSharia Academy</title>
</svelte:head>

{#if userAuth.loading || isLoading}
	<div class="flex min-h-[60vh] items-center justify-center">
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
	</div>
{:else if isAdmin}
	<div class="min-h-screen bg-gray-50 pt-20 pb-16 dark:bg-gray-950">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Kelola Pembayaran</h1>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Total {orders.length} order · {orders.filter((o) => o.status === 'pending').length} menunggu
						konfirmasi
					</p>
				</div>
			</div>

			<!-- Filter tabs -->
			<div class="mb-6 flex gap-2 overflow-x-auto">
				{#each [{ id: 'pending', label: 'Menunggu' }, { id: 'approved', label: 'Disetujui' }, { id: 'rejected', label: 'Ditolak' }, { id: 'all', label: 'Semua' }] as tab}
					<button
						onclick={() => {
							filterStatus = tab.id;
						}}
						class="rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all {filterStatus ===
						tab.id
							? 'bg-primary-600 text-white shadow-sm'
							: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}"
					>
						{tab.label}
						{#if tab.id !== 'all'}
							<span class="ml-1 text-xs opacity-70"
								>({orders.filter((o) => o.status === tab.id).length})</span
							>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Orders list -->
			{#if filteredOrders.length === 0}
				<div class="py-16 text-center">
					<div class="mb-3 text-4xl">📭</div>
					<p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada order untuk ditampilkan.</p>
				</div>
			{:else}
				<div class="space-y-3">
					{#each filteredOrders as order}
						<button
							onclick={() => {
								selectedOrder = order;
								rejectNote = '';
							}}
							class="hover:border-primary-300 dark:hover:border-primary-700 w-full rounded-xl border border-gray-100 bg-white p-5 text-left transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
						>
							<div class="flex items-center justify-between gap-4">
								<div class="min-w-0 flex-1">
									<div class="mb-1 flex items-center gap-3">
										<span class="truncate text-sm font-bold text-gray-900 dark:text-white"
											>{order.userName || order.userEmail}</span
										>
										<span
											class="rounded-full px-2 py-0.5 text-[10px] font-bold {statusConfig[
												order.status
											]?.class || ''}"
										>
											{statusConfig[order.status]?.label || order.status}
										</span>
									</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">
										{order.packageTitle} · {formatDate(order.createdAt)}
									</div>
								</div>
								<span class="text-primary-600 font-bold whitespace-nowrap"
									>{formatCurrency(order.amount)}</span
								>
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
			<button
				onclick={() => {
					selectedOrder = null;
				}}
				class="absolute inset-0 bg-black/50 backdrop-blur-sm"
			></button>
			<div
				class="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
			>
				<button
					onclick={() => {
						selectedOrder = null;
					}}
					class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/></svg
					>
				</button>

				<h2 class="mb-4 text-lg font-extrabold text-gray-900 dark:text-white">Detail Order</h2>

				<div class="mb-6 space-y-3">
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Order ID</span>
						<span class="font-mono text-xs font-bold text-gray-900 dark:text-white"
							>{selectedOrder.id}</span
						>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">User</span>
						<span class="font-semibold text-gray-900 dark:text-white"
							>{selectedOrder.userName || '-'}</span
						>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Email</span>
						<span class="text-gray-900 dark:text-white">{selectedOrder.userEmail}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Paket</span>
						<span class="font-semibold text-gray-900 dark:text-white"
							>{selectedOrder.packageTitle}</span
						>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Total</span>
						<span class="text-primary-600 font-bold">{formatCurrency(selectedOrder.amount)}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Tanggal</span>
						<span class="text-gray-900 dark:text-white">{formatDate(selectedOrder.createdAt)}</span>
					</div>
					<div class="flex items-center justify-between text-sm">
						<span class="text-gray-500 dark:text-gray-400">Status</span>
						<span
							class="rounded-full px-2 py-0.5 text-xs font-bold {statusConfig[selectedOrder.status]
								?.class || ''}"
						>
							{statusConfig[selectedOrder.status]?.label || selectedOrder.status}
						</span>
					</div>
				</div>

				<!-- Bukti Transfer -->
				{#if selectedOrder.paymentProofURL}
					<div class="mb-6">
						<h3 class="mb-2 text-sm font-bold text-gray-900 dark:text-white">Bukti Transfer</h3>
						<a href={selectedOrder.paymentProofURL} target="_blank" rel="noopener">
							<img
								src={selectedOrder.paymentProofURL}
								alt="Bukti Transfer"
								class="max-h-64 w-full rounded-xl border border-gray-200 bg-gray-50 object-contain dark:border-gray-700 dark:bg-gray-900"
							/>
						</a>
					</div>
				{/if}

				<!-- Admin Actions -->
				{#if selectedOrder.status === 'pending'}
					<div class="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
						<button
							onclick={() => approveOrder(selectedOrder)}
							disabled={isProcessing}
							class="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50"
						>
							{isProcessing ? 'Memproses...' : '✓ Approve — Aktifkan Langganan'}
						</button>
						<div>
							<textarea
								bind:value={rejectNote}
								placeholder="Alasan penolakan (wajib diisi)..."
								rows="2"
								class="mb-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
							></textarea>
							<button
								onclick={() => rejectOrder(selectedOrder)}
								disabled={isProcessing || !rejectNote.trim()}
								class="w-full rounded-xl border border-red-200 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-50 disabled:opacity-40 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
							>
								✕ Reject Pembayaran
							</button>
						</div>
					</div>
				{:else if selectedOrder.status === 'rejected' && selectedOrder.adminNote}
					<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
						<p class="mb-1 text-xs font-bold text-red-600 dark:text-red-400">Alasan Penolakan:</p>
						<p class="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.adminNote}</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/if}
