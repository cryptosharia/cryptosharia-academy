<script lang="ts">
	const footerLinks = {
		'CryptoSharia': [
			{ label: 'Tentang', href: '#' },
			{ label: 'Karir', href: '#' },
			{ label: 'Kerja Sama', href: '#' },
			{ label: 'Blog', href: '#' }
		],
		'Produk': [
			{ label: 'E-learning', href: '/e-learning' },
			{ label: 'Bootcamp & Program', href: '/bootcamp' }
		],
		'Lainnya': [
			{ label: 'FAQ', href: '#' },
			{ label: 'Syarat & Ketentuan', href: '#' },
			{ label: 'Ketentuan Privasi', href: '#' }
		]
	};

	const paymentMethods = ['BCA', 'BNI', 'BSI', 'Mandiri', 'GoPay', 'OVO', 'DANA', 'QRIS', 'Visa', 'MC'];

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
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
			<div>
				<h2 class="text-2xl font-bold text-white mb-2">Siap Memulai Perjalananmu?</h2>
				<p class="text-slate-400">Bergabung dengan ribuan orang lainnya di CryptoSharia Academy.</p>
			</div>
			<div class="flex items-center gap-4">
				<a href="/e-learning" class="rounded-full bg-primary-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-primary-700 transition-all hover:-translate-y-0.5">
					Mulai Belajar Sekarang
				</a>
			</div>
		</div>
	</div>

	<!-- Main footer -->
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-10">
			<!-- Brand column -->
			<div class="col-span-2 md:col-span-1">
				<a href="/" class="flex items-center gap-2.5 mb-4">
				<img src="/logo.png" alt="CryptoSharia" class="h-9 w-9 rounded-full" />
				<span class="font-sans text-lg font-extrabold text-white">
					Crypto<span class="text-primary-400">Sharia</span>
				</span>
			</a>
				<p class="text-sm text-slate-400 leading-relaxed mb-5">
					Rintis Karir Impian Bersama CryptoSharia Academy
				</p>
				<p class="text-xs text-slate-500 mb-4">PT Kripto Syariah Indonesia</p>

				<!-- Social links -->
				<div class="flex items-center gap-2">
					{#each socialLinks as social}
						<a
							href={social.href}
							class="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold hover:bg-primary-600 hover:text-white transition-all duration-200"
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
					<h3 class="font-semibold text-white text-sm mb-4 uppercase tracking-wider">{title}</h3>
					<ul class="space-y-2.5">
						{#each links as link}
							<li>
								<a href={link.href} class="text-sm text-slate-400 hover:text-primary-400 transition-colors">
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
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
			<p class="text-xs text-slate-500 mb-3 font-medium">Metode Pembayaran</p>
			<div class="flex flex-wrap items-center gap-2">
				{#each paymentMethods as method}
					<div class="flex items-center justify-center px-3 py-1.5 rounded-md bg-slate-800 text-xs font-semibold text-slate-400">
						{method}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Copyright -->
	<div class="border-t border-slate-800">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
			<p class="text-xs text-slate-500">© 2024 - {new Date().getFullYear()} CryptoSharia Academy. All rights reserved.</p>
			<div class="flex items-center gap-1 text-xs text-slate-500">
				<span>Terdaftar di</span>
				<span class="font-semibold text-slate-400">Kominfo PSE</span>
			</div>
		</div>
	</div>

	<!-- WhatsApp FAB -->
	<div class="fixed bottom-6 right-6 z-50 transition-all duration-500 {scrollY > 500 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}">
		<a
			href="https://api.whatsapp.com/send?phone=6281234567890&text=Hai%20CryptoSharia!%20Saya%20mau%20tanya%20tentang%20Academy"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2 rounded-full bg-green-500 p-3 sm:px-5 sm:py-3 text-sm font-semibold text-white shadow-xl shadow-green-500/30 transition-all hover:bg-green-600 hover:shadow-2xl hover:shadow-green-500/40 hover:scale-105 active:scale-95"
			aria-label="Chat WhatsApp"
		>
			<svg class="w-6 h-6 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
			</svg>
			<span class="hidden sm:inline">WhatsApp</span>
		</a>
	</div>
</footer>
