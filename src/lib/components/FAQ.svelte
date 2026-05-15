<script lang="ts">
	const faqs = [
		{
			question: 'Apa itu CryptoSharia Academy?',
			answer: 'CryptoSharia Academy adalah platform edukasi crypto berbasis Syariah terbesar di Indonesia. Kami menyediakan e-learning, bootcamp, dan corporate training untuk membantu Anda memahami dan berkarir di ekosistem kripto halal.'
		},
		{
			question: 'Apa saja fitur di CryptoSharia Academy?',
			answer: 'Fitur utama kami meliputi: E-learning dengan ratusan materi video, Bootcamp intensive live class, Screening Token Syariah, Review CV AI, sertifikat resmi, komunitas diskusi lifetime, dan akses ke job portal crypto Syariah.'
		},
		{
			question: 'Apakah CryptoSharia Academy berbayar?',
			answer: 'Kami menyediakan beberapa kelas gratis untuk pemula. Untuk akses penuh ke seluruh materi e-learning, cukup bayar sekali untuk akses lifetime. Bootcamp memiliki harga terpisah sesuai program yang dipilih.'
		},
		{
			question: 'Platform pembayaran apa saja yang digunakan?',
			answer: 'Kami menerima pembayaran melalui transfer bank (BCA, BNI, BSI, Mandiri), e-wallet (GoPay, OVO, DANA, ShopeePay), kartu kredit/debit (Visa, Mastercard), dan QRIS.'
		},
		{
			question: 'Bagaimana cara mendapatkan sertifikat?',
			answer: 'Sertifikat diberikan setelah Anda menyelesaikan seluruh materi dan lulus quiz di setiap topik. Sertifikat bersifat digital dan dapat diverifikasi secara online, serta bisa ditambahkan ke LinkedIn profile Anda.'
		}
	];

	let openIndex = $state<number | null>(null);

	function toggle(index: number) {
		openIndex = openIndex === index ? null : index;
	}
</script>

<section class="py-16 bg-white">
	<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-12">
			Yang Sering Ditanyakan
		</h2>

		<div class="space-y-3">
			{#each faqs as faq, i}
				<div class="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 {openIndex === i ? 'border-primary-200 shadow-sm bg-primary-50/30' : 'bg-white hover:border-slate-300'}">
					<button
						onclick={() => toggle(i)}
						class="w-full flex items-center justify-between px-6 py-5 text-left"
						aria-expanded={openIndex === i}
					>
						<span class="font-semibold text-slate-900 text-sm sm:text-base pr-4">{faq.question}</span>
						<svg
							class="w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-300 {openIndex === i ? 'rotate-180 text-primary-600' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if openIndex === i}
						<div class="px-6 pb-5">
							<p class="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
