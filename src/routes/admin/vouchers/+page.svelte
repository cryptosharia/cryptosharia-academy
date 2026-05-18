<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

  // voucher schema
  type Voucher = {
    id?: string;
    code: string;
    discount: number; // percent or nominal depending on type
    type: 'percent' | 'fixed';
    maxUses?: number;
    usedCount?: number;
    expiryDate?: string; // ISO string
    applicableTo?: 'all' | 'subscription' | 'units';
  };

  let vouchers: Voucher[] = [];
  let isLoading = false;
  let isModalOpen = false;
  let modalMode: 'add' | 'edit' = 'add';
  let formData = $state<Voucher>({
    code: '',
    discount: 0,
    type: 'percent',
    maxUses: 0,
    usedCount: 0,
    expiryDate: '',
    applicableTo: 'all'
  });
  let editingId: string | null = null;

  async function fetchVouchers() {
    isLoading = true;
    try {
      const snap = await getDocs(collection(db, 'vouchers'));
      vouchers = snap.docs.map(d => ({ id: d.id, ...d.data() } as Voucher));
    } catch (e) {
      console.error('Failed to fetch vouchers', e);
    } finally {
      isLoading = false;
    }
  }

  function openModal(mode: 'add' | 'edit', voucher: Voucher | null = null) {
    modalMode = mode;
    if (mode === 'edit' && voucher) {
      editingId = voucher.id!;
      formData = { ...voucher };
    } else {
      editingId = null;
      formData = {
        code: '',
        discount: 0,
        type: 'percent',
        maxUses: 0,
        usedCount: 0,
        expiryDate: '',
        applicableTo: 'all'
      };
    }
    isModalOpen = true;
  }

  async function saveVoucher() {
    if (!formData.code) return;
    isLoading = true;
    try {
      if (modalMode === 'add') {
        await addDoc(collection(db, 'vouchers'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      } else if (editingId) {
        await updateDoc(doc(db, 'vouchers', editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      }
      await fetchVouchers();
      isModalOpen = false;
    } catch (e) {
      console.error('Error saving voucher', e);
    } finally {
      isLoading = false;
    }
  }

  async function deleteVoucher(id: string) {
    if (!confirm('Hapus voucher ini?')) return;
    isLoading = true;
    try {
      await deleteDoc(doc(db, 'vouchers', id));
      await fetchVouchers();
    } catch (e) {
      console.error('Failed to delete', e);
    } finally {
      isLoading = false;
    }
  }

  onMount(fetchVouchers);
</script>

<style>
  /* Simple dark‑mode friendly styling */
  .modal-bg {background: rgba(0,0,0,0.6);}
</style>

<div class="p-6">
  <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Manajemen Voucher</h1>
  <button class="px-4 py-2 bg-primary-600 text-white rounded-lg" on:click={() => openModal('add')}>Tambah Voucher</button>

  {#if isLoading}
    <p class="mt-4 text-gray-500 dark:text-gray-400">Memuat voucher…</p>
  {:else}
    <table class="min-w-full mt-4 border-collapse">
      <thead class="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th class="p-2 text-left">Kode</th>
          <th class="p-2 text-left">Diskon</th>
          <th class="p-2 text-left">Tipe</th>
          <th class="p-2 text-left">Maks Pemakaian</th>
          <th class="p-2 text-left">Berakhir</th>
          <th class="p-2 text-left">Target</th>
          <th class="p-2 text-left">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each vouchers as v}
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <td class="p-2">{v.code}</td>
            <td class="p-2">{v.discount}{v.type === 'percent' ? '%' : ' Rp'}</td>
            <td class="p-2 capitalize">{v.type}</td>
            <td class="p-2">{v.maxUses ?? '∞'}</td>
            <td class="p-2">{v.expiryDate ? new Date(v.expiryDate).toLocaleDateString() : '–'}</td>
            <td class="p-2">{v.applicableTo}</td>
            <td class="p-2 space-x-2">
              <button class="text-primary-600" on:click={() => openModal('edit', v)}>Edit</button>
              <button class="text-red-600" on:click={() => deleteVoucher(v.id!)}>Hapus</button>
            </td>
          </tr>
        {/each}
        {#if vouchers.length === 0}
          <tr><td colspan="7" class="p-4 text-center text-gray-500 dark:text-gray-400">Tidak ada voucher.</td></tr>
        {/if}
      </tbody>
    </table>
  {/if}
</div>

{#if isModalOpen}
  <div class="fixed inset-0 flex items-center justify-center modal-bg">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg p-6">
      <h2 class="text-xl font-bold mb-4">{modalMode === 'add' ? 'Tambah' : 'Edit'} Voucher</h2>
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-medium">Kode Voucher</label>
          <input type="text" bind:value={formData.code} class="mt-1 w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm font-medium">Diskon</label>
            <input type="number" bind:value={formData.discount} min="0" class="mt-1 w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2" />
          </div>
          <div>
            <label class="block text-sm font-medium">Tipe</label>
            <select bind:value={formData.type} class="mt-1 w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2">
              <option value="percent">Persen (%)</option>
              <option value="fixed">Nominal (Rp)</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm font-medium">Maks Pemakaian</label>
            <input type="number" bind:value={formData.maxUses} min="0" class="mt-1 w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2" placeholder="0 = tak terbatas" />
          </div>
          <div>
            <label class="block text-sm font-medium">Berakhir (YYYY‑MM‑DD)</label>
            <input type="date" bind:value={formData.expiryDate} class="mt-1 w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium">Target Pembelian</label>
          <select bind:value={formData.applicableTo} class="mt-1 w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2">
            <option value="all">Semua</option>
            <option value="subscription">Subscription</option>
            <option value="units">Units</option>
          </select>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <button class="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded" on:click={() => (isModalOpen = false)}>Batal</button>
          <button class="px-4 py-2 bg-primary-600 text-white rounded" on:click={saveVoucher} disabled={isLoading}>Simpan</button>
        </div>
      </div>
    </div>
  </div>
{/if}
