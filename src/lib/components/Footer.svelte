<script lang="ts">
	const whatsappUrl = `https://api.whatsapp.com/send?phone=6281234567890&text=${encodeURIComponent(
		'Assalamualaikum CryptoSharia, saya mau daftar Crypto Sharia Masterclass.'
	)}`;

	const footerLinks = {
		CryptoSharia: [
			{ label: 'Tentang', href: '#' },
			{ label: 'Karir', href: '#' },
			{ label: 'Kerja Sama', href: '#' },
			{ label: 'Blog', href: '#' }
		],
		Produk: [
			{ label: 'E-learning', href: '/e-learning' },
			{ label: 'Bootcamp & Program', href: '/bootcamp' }
		],
		Lainnya: [
			{ label: 'FAQ', href: '#faq' },
			{ label: 'Terms & Conditions', href: '#' },
			{ label: 'Privacy & Policy', href: '#' },
			{ label: 'Hubungi Kami', href: 'mailto:admin@cryptosharia.id' }
		]
	};

	const paymentMethods = [
		'BCA',
		'BNI',
		'BSI',
		'Mandiri',
		'GoPay',
		'OVO',
		'DANA',
		'QRIS',
		'Visa',
		'MC'
	];

	const socialLinks = [
		{ label: 'Instagram', icon: 'IG', href: '#' },
		{ label: 'Twitter', icon: '𝕏', href: '#' },
		{ label: 'LinkedIn', icon: 'in', href: '#' },
		{ label: 'YouTube', icon: 'YT', href: '#' },
		{ label: 'TikTok', icon: 'TT', href: '#' }
	];

	let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />

<footer class="bg-slate-900 text-slate-300">
	<!-- CTA Section -->
	<div class="border-b border-slate-800 bg-slate-800/50">
		<div
			class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row lg:px-8"
		>
			<div>
				<h2 class="mb-2 text-2xl font-bold text-white">Ilmu Dulu. Cuan Kemudian.</h2>
				<p class="text-slate-400">
					Gabung Crypto Sharia Masterclass dan belajar investasi crypto secara sistematis.
				</p>
			</div>
			<div class="flex items-center gap-4">
				<a
					href={whatsappUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="bg-primary-600 hover:bg-primary-700 rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
				>
					Daftar Masterclass
				</a>
			</div>
		</div>
	</div>

	<!-- Main footer -->
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<div class="grid grid-cols-2 gap-10 md:grid-cols-4">
			<!-- Brand column -->
			<div class="col-span-2 md:col-span-1">
				<a href="/" class="mb-4 flex items-center gap-2.5">
					<img src="/logo.png" alt="CryptoSharia" class="h-9 w-9 rounded-full" />
					<span class="font-sans text-lg font-extrabold text-white">
						Crypto<span class="text-primary-400">Sharia</span>
					</span>
				</a>
				<p class="mb-5 text-sm leading-relaxed text-slate-400">
					Rintis Karir Impian Bersama CryptoSharia Academy
				</p>
				<p class="mb-4 text-xs text-slate-500">PT Kripto Syariah Indonesia</p>

				<!-- Social links -->
				<div class="flex items-center gap-2">
					{#each socialLinks as social}
						<a
							href={social.href}
							class="hover:bg-primary-600 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-400 transition-all duration-200 hover:text-white"
							aria-label={social.label}
						>
							{social.icon}
						</a>
					{/each}
				</div>
			</div>

			<!-- Link columns -->
			{#each Object.entries(footerLinks) as [title, links]}
				<div>
					<h3 class="mb-4 text-sm font-semibold tracking-wider text-white uppercase">{title}</h3>
					<ul class="space-y-2.5">
						{#each links as link}
							<li>
								<a
									href={link.href}
									class="hover:text-primary-400 text-sm text-slate-400 transition-colors"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<!-- Payment methods -->
	<div class="border-t border-slate-800">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<p class="mb-3 text-xs font-medium text-slate-500">Metode Pembayaran</p>
			<div class="flex flex-wrap items-center gap-2">
				{#each paymentMethods as method}
					<div
						class="flex items-center justify-center rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-400"
					>
						{method}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Disclaimer & Copyright -->
	<div class="border-t border-slate-800">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-6 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
				<p class="text-justify text-[10px] leading-relaxed text-slate-500 sm:text-xs">
					<strong class="text-slate-400">Disclaimer Risiko Kripto:</strong> Perdagangan dan investasi
					aset kripto merupakan aktivitas berisiko tinggi (high-risk). Nilai aset kripto sangat fluktuatif
					dan dapat berubah secara signifikan dalam waktu singkat. CryptoSharia Academy adalah platform
					edukasi murni dan tidak menyediakan saran keuangan profesional, layanan penasihat investasi,
					manajemen portofolio, pialang, atau pertukaran aset (exchange). Semua materi, analisa, dan studi
					kasus yang disampaikan bertujuan semata-mata untuk pembelajaran. Keputusan investasi sepenuhnya
					merupakan tanggung jawab pribadi masing-masing individu. Selalu lakukan riset mandiri (DYOR)
					dan pastikan untuk hanya mengalokasikan dana yang Anda siap untuk kehilangan.
				</p>
			</div>

			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<p class="text-xs font-medium text-slate-500">
					Copyright © Crypto Sharia Masterclass 2026. All Rights Reserved.
				</p>
				<div class="flex items-center gap-1 text-xs text-slate-500">
					<span>Terdaftar Resmi di</span>
					<span class="font-bold text-slate-400">Kominfo PSE</span>
				</div>
			</div>
		</div>
	</div>

	<!-- WhatsApp FAB -->
	<div
		class="fixed right-6 bottom-6 z-50 transition-all duration-500 {scrollY > 500
			? 'translate-y-0 opacity-100'
			: 'pointer-events-none translate-y-20 opacity-0'}"
	>
		<a
			href={whatsappUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2 rounded-full bg-green-500 p-3 text-sm font-semibold text-white shadow-xl shadow-green-500/30 transition-all hover:scale-105 hover:bg-green-600 hover:shadow-2xl hover:shadow-green-500/40 active:scale-95 sm:px-5 sm:py-3"
			aria-label="Chat WhatsApp"
		>
			<svg class="h-6 w-6 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
				<path
					d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
				/>
			</svg>
			<span class="hidden sm:inline">WhatsApp</span>
		</a>
	</div>
</footer>
