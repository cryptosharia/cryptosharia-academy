<script lang="ts">
	import { page } from '$app/state';
	
	// Mock data for the selected package - in real app, fetch based on $page.params.id
	const packageData = {
		id: '1-month-access',
		title: 'Paket Video E-Learning 1 Bulan',
		price: 29000,
		originalPrice: 350000,
		discount: 0.25, // 25% discount from promo code
		description: 'Belajar kapan saja, di mana saja dan dapatkan sertifikat tiap menyelesaikan satu video materi.',
		benefits: [
			'1400+ Materi Video',
			'1400+ Modul Praktik Portfolio',
			'Sertifikat di Tiap Materi',
			'Grup Komunitas'
		],
		terms: [
			'Video dapat dinikmati hingga jangka waktu 1 bulan setelah kamu melakukan pembayaran dan terkonfirmasi oleh sistem kami',
			'Pembelian video hanya untuk perorangan. Sertifikat yang diberikan disesuaikan dengan nama dan email dari akun di CryptoSharia'
		]
	};

	let promoCode = $state('CRYPTO25');
	let isPromoApplied = $state(true);

	const subtotal = packageData.price;
	const discountAmount = isPromoApplied ? Math.floor(subtotal * packageData.discount) : 0;
	const tax = Math.floor((subtotal - discountAmount) * 0.11);
	const transactionFee = 362;
	const total = subtotal - discountAmount + tax + transactionFee;

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount).replace('Rp', 'Rp ');
	};
</script>

<svelte:head>
	<title>Pembayaran | CryptoSharia Academy</title>
</svelte:head>

<div class="bg-gray-50 min-h-screen pt-24 pb-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid lg:grid-cols-3 gap-8">
			
			<!-- Left Column: Details -->
			<div class="lg:col-span-2 space-y-8">
				
				<!-- Banner -->
				<div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 sm:p-12 shadow-lg">
					<div class="relative z-10 max-w-md">
						<span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold mb-4 uppercase tracking-wider">eLearning</span>
						<h1 class="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
							Pelajari Ratusan Skill Bersertifikat Sekali Bayar.
						</h1>
						<p class="text-primary-100 mb-6">Fleksibel & Praktikal. Belajar langsung dari praktisi industri Crypto Syariah.</p>
						<button class="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-full transition-all active:scale-95 shadow-md">
							Selengkapnya
						</button>
					</div>
					<!-- Decorative elements -->
					<div class="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
						<svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
							<path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grad1)" />
							<defs>
								<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" style="stop-color:white;stop-opacity:1" />
									<stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<div class="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
				</div>

				<!-- Testimonials -->
				<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
					<div class="flex flex-wrap items-center gap-4 mb-6">
						<div class="flex items-center gap-2">
							<span class="font-bold text-lg">4.9</span>
							<div class="flex text-yellow-400">
								{#each Array(5) as _}
									<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
								{/each}
							</div>
							<span class="text-sm text-gray-500">rating di Course Report</span>
						</div>
						<div class="h-4 w-px bg-gray-200"></div>
						<div class="flex -space-x-2">
							{#each Array(4) as _, i}
								<div class="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
									<img src="https://i.pravatar.cc/100?u={i}" alt="User" />
								</div>
							{/each}
						</div>
						<span class="text-sm text-gray-500 font-medium">> 1.5 Juta Member</span>
					</div>

					<div class="grid sm:grid-cols-2 gap-4">
						<div class="p-4 rounded-xl border border-gray-100 bg-gray-50 flex gap-3">
							<div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
								<img src="https://i.pravatar.cc/100?u=12" alt="Alumni" />
							</div>
							<div>
								<div class="font-bold text-sm">Paksi Cahyo Baskoro</div>
								<p class="text-xs text-gray-500 leading-tight">Diterima sebagai Copywriter di DBS Bank Indonesia.</p>
							</div>
						</div>
						<div class="p-4 rounded-xl border border-gray-100 bg-gray-50 flex gap-3">
							<div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
								<img src="https://i.pravatar.cc/100?u=15" alt="Alumni" />
							</div>
							<div>
								<div class="font-bold text-sm">M. Arkhan Doohan</div>
								<p class="text-xs text-gray-500 leading-tight">Diterima sebagai Data Analyst di United Tractors.</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Package Info -->
				<div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
					<span class="inline-block px-3 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-md mb-4 uppercase tracking-widest">Berlangganan E-learning</span>
					<h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{packageData.title}</h2>
					<div class="flex items-baseline gap-3 mb-8">
						<span class="text-2xl font-black text-primary-600">{formatCurrency(packageData.price)}</span>
						<span class="text-gray-400 line-through text-sm">{formatCurrency(packageData.originalPrice)}</span>
					</div>

					<div class="space-y-6">
						<section>
							<h3 class="font-bold text-gray-900 mb-2">Deskripsi</h3>
							<p class="text-gray-600 text-sm leading-relaxed">{packageData.description}</p>
						</section>

						<section>
							<h3 class="font-bold text-gray-900 mb-3">Benefit</h3>
							<ul class="grid sm:grid-cols-2 gap-3">
								{#each packageData.benefits as benefit}
									<li class="flex items-center gap-3 text-sm text-gray-700">
										<div class="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
											<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
										</div>
										{benefit}
									</li>
								{/each}
							</ul>
						</section>

						<section>
							<h3 class="font-bold text-gray-900 mb-3">Ketentuan</h3>
							<ul class="space-y-3">
								{#each packageData.terms as term}
									<li class="flex items-start gap-3 text-xs text-gray-500 leading-relaxed">
										<div class="mt-0.5 w-4 h-4 text-orange-400 flex-shrink-0">
											<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
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
				
				<!-- Checkout Summary Card -->
				<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
					<h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Ringkasan Product</h3>
					<div class="mb-6">
						<div class="font-bold text-gray-900">{packageData.title}</div>
						<div class="text-sm text-gray-500">{formatCurrency(packageData.price)}</div>
					</div>

					<!-- Promo Code -->
					<div class="mb-6">
						<label for="promo" class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Kode Promo/Kupon</label>
						<div class="relative">
							<input 
								type="text" 
								id="promo" 
								bind:value={promoCode}
								class="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
								placeholder="Masukkan kode promo"
							/>
							{#if isPromoApplied}
								<div class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
								</div>
							{/if}
						</div>
					</div>

					<button class="w-full flex items-center justify-center gap-2 border-2 border-primary-100 rounded-xl py-2.5 text-xs font-bold text-primary-600 hover:bg-primary-50 transition-all mb-6">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
						Lihat Promo Hari Ini
					</button>

					<div class="space-y-4 mb-6">
						<button class="w-full flex items-center justify-between bg-primary-600 text-white rounded-xl py-3 px-4 text-sm font-bold shadow-md orange-glow hover:bg-primary-700 transition-all">
							Ganti Metode Pembayaran
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
						</button>
						<div class="flex items-center gap-3 px-1">
							<div class="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">QRIS</div>
							<span class="text-sm font-bold text-gray-700">QRIS / ShopeePay / GoPay</span>
						</div>
					</div>

					<!-- Price Breakdown -->
					<div class="space-y-2 pt-6 border-t border-gray-100 mb-6">
						<div class="flex justify-between text-sm text-gray-500">
							<span>Subtotal</span>
							<span>{formatCurrency(subtotal)}</span>
						</div>
						{#if isPromoApplied}
							<div class="flex justify-between text-sm text-green-600 font-medium">
								<span>Diskon (25%)</span>
								<span>- {formatCurrency(discountAmount)}</span>
							</div>
						{/if}
						<div class="flex justify-between text-sm text-gray-500">
							<span>PPN (11%)</span>
							<span>{formatCurrency(tax)}</span>
						</div>
						<div class="flex justify-between text-sm text-gray-500">
							<span>Biaya Transaksi</span>
							<span>{formatCurrency(transactionFee)}</span>
						</div>
						<div class="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
							<span class="font-bold text-gray-900">Total</span>
							<span class="text-xl font-black text-primary-600">{formatCurrency(total)}</span>
						</div>
						<div class="text-[10px] text-gray-400 text-right">+ kode unik ⓘ</div>
					</div>

					<button class="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl py-4 font-bold shadow-lg transition-all active:scale-95">
						Lanjut Ke Pembayaran
					</button>
				</div>

				<!-- Secure payment badge -->
				<div class="flex items-center justify-center gap-2 text-gray-400">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
					<span class="text-[10px] font-bold uppercase tracking-widest">Secure Payment SSL Encrypted</span>
				</div>
			</div>

		</div>
	</div>
</div>
