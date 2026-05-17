<script lang="ts">
	const faqs = [
		{
			question: 'Apakah investasi crypto itu haram atau sama dengan judi?',
			answer: 'Tidak semua crypto haram. Layaknya saham, ada yang sesuai Syariah dan ada yang tidak. Di CryptoSharia Academy, kami fokus mengajarkan kriteria aset crypto yang didukung utilitas nyata (asset-backed), memiliki fundamental jelas, dan menghindari skema perjudian, margin trading, atau bunga (riba).'
		},
		{
			question: 'Saya sering dengar crypto banyak penipuan (scam). Apakah aman?',
			answer: 'Risiko scam memang nyata jika Anda masuk tanpa ilmu. Justru karena itulah akademi ini ada. Modul pertama kami akan mengajarkan Anda cara membedakan project crypto asli dengan scam, cara membaca smart contract dasar, dan menggunakan dompet digital (wallet) dengan aman.'
		},
		{
			question: 'Saya gaptek dan sama sekali tidak bisa coding, apakah bisa ikut?',
			answer: 'Tentu saja! Modul kami dirancang khusus untuk pemula mutlak (absolute beginner). 90% karir di Web3 (seperti Community Manager, Researcher, Marketing, Analyst) tidak membutuhkan keahlian coding sama sekali. Kami membimbing Anda dari nol.'
		},
		{
			question: 'Apakah setelah lulus dijamin mendapat pekerjaan?',
			answer: 'Meskipun kami tidak memberikan "jaminan pasti" (karena itu bergantung pada usaha setiap individu), kami menyediakan akses eksklusif ke Portal Karir Web3, sesi review CV, dan networking langsung dengan praktisi dari perusahaan terkemuka. Banyak alumni kami yang mendapatkan pekerjaan pertama mereka melalui koneksi komunitas ini.'
		},
		{
			question: 'Apakah ada komunitas atau mentoring setelah saya membeli akses?',
			answer: 'Ya! Berbeda dengan kursus online biasa, Anda akan mendapatkan akses seumur hidup (lifetime) ke komunitas VIP Discord kami. Di sana ada sesi diskusi mingguan, bedah token, dan interaksi langsung dengan instruktur maupun alumni yang sudah sukses.'
		}
	];

	let openIndex = $state<number | null>(null);

	function toggle(index: number) {
		openIndex = openIndex === index ? null : index;
	}
</script>

<section class="py-24 bg-white dark:bg-gray-950" id="faq">
	<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
				Keraguan Anda, <span class="text-primary-600">Terjawab</span>
			</h2>
			<p class="text-lg text-slate-500 dark:text-gray-400">
				Kami memahami bahwa dunia crypto memiliki reputasi yang kompleks. Berikut adalah jawaban jujur kami.
			</p>
		</div>

		<div class="space-y-4">
			{#each faqs as faq, i}
				<div class="rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden transition-all duration-300 {openIndex === i ? 'border-primary-300 dark:border-primary-700 shadow-md bg-primary-50/50 dark:bg-slate-900' : 'bg-white dark:bg-gray-900 hover:border-slate-300 dark:hover:border-gray-700'}">
					<button
						onclick={() => toggle(i)}
						class="w-full flex items-center justify-between px-6 py-6 text-left"
						aria-expanded={openIndex === i}
					>
						<span class="font-bold text-slate-900 dark:text-white text-base sm:text-lg pr-4">{faq.question}</span>
						<svg
							class="w-6 h-6 flex-shrink-0 text-slate-400 transition-transform duration-300 {openIndex === i ? 'rotate-180 text-primary-600' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if openIndex === i}
						<div class="px-6 pb-6">
							<p class="text-slate-600 dark:text-gray-300 text-base leading-relaxed border-t border-slate-100 dark:border-gray-800 pt-4 mt-2">{faq.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
