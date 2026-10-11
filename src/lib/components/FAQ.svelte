<script lang="ts">
	const faqs = [
		{
			question: 'Apakah investasi crypto itu haram atau sama dengan judi?',
			answer:
				'Tidak semua crypto haram. Layaknya saham, ada yang sesuai Syariah dan ada yang tidak. Di CryptoSharia Academy, kami fokus mengajarkan kriteria aset crypto yang didukung utilitas nyata (asset-backed), memiliki fundamental jelas, dan menghindari skema perjudian, margin trading, atau bunga (riba).'
		},
		{
			question: 'Saya sering dengar crypto banyak penipuan (scam). Apakah aman?',
			answer:
				'Risiko scam memang nyata jika Anda masuk tanpa ilmu. Justru karena itulah akademi ini ada. Modul pertama kami akan mengajarkan Anda cara membedakan project crypto asli dengan scam, cara membaca smart contract dasar, dan menggunakan dompet digital (wallet) dengan aman.'
		},
		{
			question: 'Saya gaptek dan sama sekali tidak bisa coding, apakah bisa ikut?',
			answer:
				'Tentu saja! Modul kami dirancang khusus untuk pemula mutlak (absolute beginner). 90% karir di Web3 (seperti Community Manager, Researcher, Marketing, Analyst) tidak membutuhkan keahlian coding sama sekali. Kami membimbing Anda dari nol.'
		},
		{
			question: 'Apakah setelah lulus dijamin mendapat pekerjaan?',
			answer:
				'Meskipun kami tidak memberikan "jaminan pasti" (karena itu bergantung pada usaha setiap individu), kami menyediakan akses eksklusif ke Portal Karir Web3, sesi review CV, dan networking langsung dengan praktisi dari perusahaan terkemuka. Banyak alumni kami yang mendapatkan pekerjaan pertama mereka melalui koneksi komunitas ini.'
		},
		{
			question: 'Apakah ada komunitas atau mentoring setelah saya membeli akses?',
			answer:
				'Ya! Berbeda dengan kursus online biasa, Anda akan mendapatkan akses seumur hidup (lifetime) ke komunitas VIP Discord kami. Di sana ada sesi diskusi mingguan, bedah token, dan interaksi langsung dengan instruktur maupun alumni yang sudah sukses.'
		}
	];

	let openIndex = $state<number | null>(null);

	function toggle(index: number) {
		openIndex = openIndex === index ? null : index;
	}
</script>

<section class="bg-white py-24 dark:bg-gray-950" id="faq">
	<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2
				class="font-display mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white"
			>
				Keraguan Anda, <span class="text-primary-600">Terjawab</span>
			</h2>
			<p class="text-lg text-slate-500 dark:text-gray-400">
				Kami memahami bahwa dunia crypto memiliki reputasi yang kompleks. Berikut adalah jawaban
				jujur kami.
			</p>
		</div>

		<div class="space-y-4">
			{#each faqs as faq, i}
				<div
					class="overflow-hidden rounded-2xl border border-slate-200 transition-all duration-300 dark:border-gray-800 {openIndex ===
					i
						? 'border-primary-300 dark:border-primary-700 bg-primary-50/50 shadow-md dark:bg-slate-900'
						: 'bg-white hover:border-slate-300 dark:bg-gray-900 dark:hover:border-gray-700'}"
				>
					<button
						onclick={() => toggle(i)}
						class="flex w-full items-center justify-between px-6 py-6 text-left"
						aria-expanded={openIndex === i}
					>
						<span class="pr-4 text-base font-bold text-slate-900 sm:text-lg dark:text-white"
							>{faq.question}</span
						>
						<svg
							class="h-6 w-6 flex-shrink-0 text-slate-400 transition-transform duration-300 {openIndex ===
							i
								? 'text-primary-600 rotate-180'
								: ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{#if openIndex === i}
						<div class="px-6 pb-6">
							<p
								class="mt-2 border-t border-slate-100 pt-4 text-base leading-relaxed text-slate-600 dark:border-gray-800 dark:text-gray-300"
							>
								{faq.answer}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
