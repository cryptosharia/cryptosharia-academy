<script lang="ts">
	type Highlight = {
		symbol: string;
		performance: string;
	};

	type Feature = {
		title: string;
		description: string;
		label: string;
	};

	type ProofItem = {
		title: string;
		description: string;
		meta: string;
	};

	type Faq = {
		question: string;
		answer: string;
	};

	const whatsappUrl = `https://api.whatsapp.com/send?phone=6281234567890&text=${encodeURIComponent(
		'Assalamualaikum CryptoSharia, saya mau daftar Crypto Sharia Masterclass.'
	)}`;

	const assetHighlights: Highlight[] = [
		{ symbol: 'FHE', performance: '+400%' },
		{ symbol: 'UMBRA', performance: '+280%' },
		{ symbol: 'HUMANITY', performance: '+220%' },
		{ symbol: 'LIGHT', performance: '+200%' }
	];

	const communityActivities: ProofItem[] = [
		{
			title: 'QnA Session',
			description: 'Forum tanya jawab rutin untuk membahas market, portofolio, dan fiqih muamalah.',
			meta: 'Live mentoring'
		},
		{
			title: 'Nushafest',
			description:
				'Dokumentasi edukasi publik bersama komunitas yang tertarik pada aset digital halal.',
			meta: 'Community event'
		},
		{
			title: 'Halal Kulture Market',
			description: 'Aktivasi edukasi crypto syariah untuk memperluas literasi investor Muslim.',
			meta: 'Offline activity'
		},
		{
			title: 'Gathering Komunitas',
			description: 'Diskusi kecil dan networking antar member untuk memperkuat proses belajar.',
			meta: 'Member circle'
		}
	];

	const valueProps: Feature[] = [
		{
			label: '01',
			title: 'Strategi Cuan Halal di Crypto',
			description: 'Memahami strategi investasi crypto yang terukur dan sesuai prinsip syariah.'
		},
		{
			label: '02',
			title: 'Build Your Sharia Wealth',
			description:
				'Membangun aset dan kekayaan jangka panjang dengan pendekatan yang sehat dan berkelanjutan.'
		},
		{
			label: '03',
			title: 'Strategi Bertahan di Bear Market',
			description: 'Belajar menjaga portofolio dan mengambil peluang saat market sedang turun.'
		}
	];

	const testimonials: ProofItem[] = [
		{
			title: 'Thanks to you my mentor!',
			description:
				'Member membagikan hasil belajar, eksekusi strategi spot, dan progres portofolio di Discord Premium.',
			meta: 'Discord Community'
		},
		{
			title: 'Akhirnya lebih paham cara analisa market tanpa gambling.',
			description:
				'Pendekatan riset, manajemen risiko, dan screening syariah membantu member lebih disiplin.',
			meta: 'Member feedback'
		},
		{
			title: 'Profit tanpa leverage, tetap pakai rencana.',
			description:
				'Dokumentasi hasil member ditampilkan sebagai studi kasus edukasi, bukan janji keuntungan.',
			meta: 'Portfolio story'
		}
	];

	const uspItems: Feature[] = [
		{
			label: 'Practice',
			title: 'Tugas Praktek Langsung',
			description: 'Setiap materi dilengkapi penugasan agar peserta langsung mempraktekkan ilmunya.'
		},
		{
			label: 'Certificate',
			title: 'Sertifikat Kelulusan',
			description:
				'Peserta mendapatkan sertifikat setelah menyelesaikan evaluasi akhir sebagai bukti kompetensi.'
		},
		{
			label: 'Mentoring',
			title: 'FGD & Mentoring',
			description:
				'Diskusi kelompok kecil 5-10 orang bersama mentor untuk pendampingan yang lebih personal.'
		},
		{
			label: 'Sharia',
			title: 'Sharia Compliant',
			description: 'Belajar fiqih muamalah serta metode analisa crypto sesuai prinsip syariah.'
		},
		{
			label: 'Network',
			title: 'Komunitas Global',
			description:
				'Akses networking eksklusif bersama ratusan member dari berbagai industri dan profesi.'
		}
	];

	const curriculum: string[] = [
		'Peta Industri Crypto & Web3',
		'Financial Planning & Risk Management',
		'Analisa Fundamental & Narrative',
		'Analisa Teknikal',
		'Analisa Global Macro',
		'Analisa Koin Syariah',
		'Portfolio Building untuk Long Term Investment'
	];

	const faqs: Faq[] = [
		{
			question: 'Apakah program ini cocok untuk pemula?',
			answer:
				'Ya. Materi disusun dari dasar hingga advanced sehingga dapat diikuti oleh pemula maupun yang sudah berpengalaman.'
		},
		{
			question: 'Bagaimana jika tidak bisa hadir di salah satu sesi?',
			answer:
				'Peserta akan mendapatkan akses rekaman materi sehingga tetap dapat mengikuti pembelajaran.'
		},
		{
			question: 'Apa yang membedakan program ini dengan masterclass lain?',
			answer:
				'Program ini menggabungkan edukasi investasi crypto, manajemen risiko, komunitas, mentoring, serta pendekatan syariah secara komprehensif.'
		}
	];

	let openFaqIndex = $state<number | null>(0);

	function toggleFaq(index: number) {
		openFaqIndex = openFaqIndex === index ? null : index;
	}
</script>

<svelte:head>
	<title>Crypto Sharia Masterclass | Systematic Crypto Investing</title>
	<meta
		name="description"
		content="Learn systematic crypto investing aligned with Islamic values bersama praktisi tersertifikasi, mentoring, komunitas, dan kurikulum crypto syariah terstruktur."
	/>
</svelte:head>

<section class="relative isolate overflow-hidden bg-slate-950 pt-20 text-white">
	<div
		class="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(30,41,59,0.9)),linear-gradient(90deg,rgba(234,88,12,0.18)_0%,rgba(20,184,166,0.1)_48%,rgba(15,23,42,0)_100%)]"
	></div>
	<div
		class="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px] opacity-20"
	></div>

	<div
		class="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24"
	>
		<div class="flex max-w-3xl min-w-0 flex-col justify-center">
			<div
				class="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200"
			>
				<span class="h-2 w-2 rounded-full bg-orange-400"></span>
				Crypto Sharia Masterclass 2026
			</div>

			<h1
				class="font-display text-3xl leading-tight font-extrabold tracking-normal break-words sm:text-5xl lg:text-6xl"
			>
				Learn Systematic Crypto Investing Aligned with Islamic Values
			</h1>
			<p class="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
				Belajar langsung bersama para praktisi berpengalaman yang telah tersertifikasi standar BNSP
				& internasional dalam bidang investasi dan industri crypto.
			</p>
			<p class="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
				Terbukti membantu banyak member Premium Crypto Sharia membangun strategi profit di market
				crypto tanpa leverage dan tetap berpegang pada prinsip syariah.
			</p>

			<div class="mt-8 flex flex-col gap-3 sm:flex-row">
				<a
					href={whatsappUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-500 active:scale-95 sm:w-auto"
				>
					Join Now / Gabung Sekarang
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</a>
				<a
					href="#curriculum"
					class="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-6 py-4 text-sm font-bold text-slate-100 transition hover:border-orange-300 hover:bg-white/10 sm:w-auto"
				>
					Lihat Kurikulum
				</a>
			</div>
		</div>

		<div class="relative min-w-0">
			<div
				class="overflow-hidden rounded-lg border border-white/15 bg-slate-900 shadow-2xl shadow-black/30"
			>
				<div class="flex items-center gap-2 border-b border-white/10 bg-slate-950 px-4 py-3">
					<span class="h-3 w-3 rounded-full bg-red-400"></span>
					<span class="h-3 w-3 rounded-full bg-yellow-400"></span>
					<span class="h-3 w-3 rounded-full bg-green-400"></span>
					<span class="ml-2 text-xs font-semibold text-slate-400">intro-masterclass.mp4</span>
				</div>
				<div class="relative aspect-video bg-slate-900 p-6">
					<div
						class="absolute inset-0 [background-image:linear-gradient(120deg,rgba(249,115,22,0.26),transparent_42%),linear-gradient(45deg,rgba(20,184,166,0.2),transparent_56%)] opacity-40"
					></div>
					<div class="relative flex h-full flex-col items-center justify-center text-center">
						<div
							class="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10"
						>
							<svg
								class="ml-1 h-8 w-8 text-white"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path d="M8 5v14l11-7z" />
							</svg>
						</div>
						<p class="text-lg font-bold text-white">Video Perkenalan Program</p>
						<p class="mt-2 max-w-sm text-sm leading-6 text-slate-300">
							Placeholder upload-ready untuk memperkenalkan visi program dan mentor utama.
						</p>
					</div>
				</div>
			</div>

			<div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
				{#each assetHighlights as item}
					<div class="rounded-lg border border-white/10 bg-white/[0.06] p-4">
						<div class="text-xs font-semibold text-slate-400">{item.symbol}</div>
						<div class="mt-1 text-2xl font-black text-emerald-300">{item.performance}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="bg-white py-20 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
			<div>
				<p class="text-sm font-bold tracking-wider text-orange-600 uppercase">
					Otoritas & Kredibilitas
				</p>
				<h2 class="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
					Dibangun dari pengalaman edukasi dan komunitas nyata.
				</h2>
				<p class="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
					Program ini menggabungkan pengalaman praktisi, standar sertifikasi, dan proses belajar
					komunitas agar peserta memahami crypto secara sistematis, bukan sekadar mengikuti hype.
				</p>
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				{#each communityActivities as item}
					<div
						class="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
					>
						<div
							class="mb-4 flex aspect-video items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-xs font-bold tracking-wider text-slate-400 uppercase dark:border-slate-700 dark:bg-slate-950"
						>
							{item.meta}
						</div>
						<h3 class="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
						<p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
							{item.description}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			<div class="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
				<p class="text-xs font-bold tracking-wider text-slate-500 uppercase">Analisa Market</p>
				<p class="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
					Placeholder screenshot hasil analisa market dan thesis aset pilihan.
				</p>
			</div>
			<div class="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
				<p class="text-xs font-bold tracking-wider text-slate-500 uppercase">Pencapaian Member</p>
				<p class="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
					Placeholder dokumentasi pencapaian dan progres portofolio member.
				</p>
			</div>
			<div class="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
				<p class="text-xs font-bold tracking-wider text-slate-500 uppercase">Discord Community</p>
				<p class="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
					Placeholder testimoni profit, ucapan terima kasih, dan sharing pengalaman belajar.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="bg-slate-50 py-20 dark:bg-slate-900" id="program">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto mb-12 max-w-3xl text-center">
			<p class="text-sm font-bold tracking-wider text-orange-600 uppercase">Value Proposition</p>
			<h2 class="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
				Apa yang Akan Dipelajari?
			</h2>
		</div>

		<div class="grid gap-5 md:grid-cols-3">
			{#each valueProps as item}
				<div
					class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
				>
					<div class="mb-8 text-sm font-black text-orange-600">{item.label}</div>
					<h3 class="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
					<p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
						{item.description}
					</p>
				</div>
			{/each}
		</div>

		<div
			class="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
		>
			<div class="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
				<div class="p-6 sm:p-8">
					<p class="text-sm font-bold tracking-wider text-slate-500 uppercase">
						Dokumentasi Kegiatan
					</p>
					<h3 class="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
						Seminar, mentoring, QnA Session, dan aktivitas komunitas offline.
					</h3>
					<p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
						Area ini disiapkan untuk foto-foto kegiatan asli ketika materi campaign final tersedia.
					</p>
				</div>
				<div class="grid grid-cols-2 gap-3 bg-slate-100 p-4 dark:bg-slate-900">
					<div
						class="aspect-[4/3] rounded-md border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
					></div>
					<div
						class="aspect-[4/3] rounded-md border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
					></div>
					<div
						class="aspect-[4/3] rounded-md border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
					></div>
					<div
						class="aspect-[4/3] rounded-md border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
					></div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="bg-white py-20 dark:bg-gray-950" id="testimonials">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-12 max-w-3xl">
			<p class="text-sm font-bold tracking-wider text-orange-600 uppercase">
				Social Proof & Testimoni
			</p>
			<h2 class="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
				Member Premium Crypto Sharia yang Sudah Bertumbuh Bersama
			</h2>
			<p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
				Placeholder untuk screenshot testimoni Discord, ucapan terima kasih, dokumentasi profit
				member, dan sharing pengalaman belajar.
			</p>
		</div>

		<div class="grid gap-5 md:grid-cols-3">
			{#each testimonials as item}
				<div
					class="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"
				>
					<div
						class="mb-5 h-32 rounded-md border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
					>
						<div class="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800"></div>
						<div class="mt-4 h-3 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
						<div class="mt-3 h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
						<div class="mt-5 h-8 w-24 rounded bg-emerald-100 dark:bg-emerald-950"></div>
					</div>
					<p class="text-xs font-bold tracking-wider text-orange-600 uppercase">{item.meta}</p>
					<h3 class="mt-3 text-lg font-bold text-slate-900 dark:text-white">"{item.title}"</h3>
					<p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
						{item.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="bg-slate-950 py-20 text-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
			<div>
				<p class="text-sm font-bold tracking-wider text-orange-300 uppercase">
					Unique Selling Proposition
				</p>
				<h2 class="mt-3 text-3xl font-extrabold sm:text-4xl">
					Kenapa Harus Crypto Sharia Masterclass?
				</h2>
				<blockquote
					class="mt-8 border-l-4 border-orange-500 pl-5 text-lg leading-8 font-semibold text-slate-200"
				>
					"The best investment you can make is an investment in yourself." - Warren Buffett
				</blockquote>
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				{#each uspItems as item}
					<div class="rounded-lg border border-white/10 bg-white/[0.04] p-5">
						<p class="text-xs font-bold tracking-wider text-orange-300 uppercase">{item.label}</p>
						<h3 class="mt-3 text-lg font-bold text-white">{item.title}</h3>
						<p class="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="bg-white py-20 dark:bg-gray-950" id="pricing">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
			<div>
				<p class="text-sm font-bold tracking-wider text-orange-600 uppercase">
					Jadwal & Harga Program
				</p>
				<h2 class="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
					Gabung Programnya Sekarang
				</h2>
				<p class="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
					Pelaksanaan program direncanakan pada akhir Juni 2026 atau awal Juli 2026. Tanggal final
					akan diumumkan segera.
				</p>
				<div class="mt-8 grid gap-4 sm:grid-cols-2">
					<div class="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
						<p class="text-sm font-bold text-slate-500">Benefit Tambahan</p>
						<ul class="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
							<li class="flex gap-3">
								<span class="mt-1 h-2 w-2 rounded-full bg-orange-500"></span>
								Materi & rekaman kelas
							</li>
							<li class="flex gap-3">
								<span class="mt-1 h-2 w-2 rounded-full bg-orange-500"></span>
								Mentoring & networking komunitas
							</li>
						</ul>
					</div>
					<div class="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
						<p class="text-sm font-bold text-slate-500">Format Belajar</p>
						<ul class="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
							<li class="flex gap-3">
								<span class="mt-1 h-2 w-2 rounded-full bg-teal-500"></span>
								Kelas terstruktur bersama praktisi
							</li>
							<li class="flex gap-3">
								<span class="mt-1 h-2 w-2 rounded-full bg-teal-500"></span>
								FGD kecil untuk pendampingan intensif
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div
				class="rounded-lg border border-orange-200 bg-orange-50 p-6 shadow-xl shadow-orange-950/10 dark:border-orange-900/60 dark:bg-orange-950/20"
			>
				<p class="text-sm font-bold tracking-wider text-orange-700 uppercase dark:text-orange-300">
					Special Price
				</p>
				<div class="mt-5 flex items-end gap-3">
					<span class="text-lg font-bold text-slate-500 line-through">Rp3.000.000</span>
				</div>
				<div class="mt-2 text-5xl font-black text-slate-900 dark:text-white">Rp2.000.000</div>
				<p class="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
					Harga promo untuk peserta awal dengan kuota mentoring terbatas.
				</p>
				<a
					href={whatsappUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-orange-500 active:scale-95"
				>
					Gabung Sekarang
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>

<section class="bg-slate-50 py-20 dark:bg-slate-900" id="curriculum">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mx-auto mb-12 max-w-3xl text-center">
			<p class="text-sm font-bold tracking-wider text-orange-600 uppercase">Detail Kurikulum</p>
			<h2 class="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
				Materi Pembelajaran
			</h2>
		</div>

		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each curriculum as topic, index}
				<div
					class="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
				>
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-900 text-sm font-black text-white dark:bg-orange-600"
					>
						{index + 1}
					</div>
					<div>
						<h3 class="font-bold text-slate-900 dark:text-white">{topic}</h3>
						<p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
							Dipelajari melalui kerangka riset, studi kasus, dan diskusi penerapan.
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="bg-orange-600 py-16 text-white">
	<div
		class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8"
	>
		<div>
			<p class="text-sm font-black tracking-wider text-orange-100 uppercase">Urgency / Scarcity</p>
			<h2 class="mt-2 text-3xl font-extrabold sm:text-4xl">Special Price for 10 Pax Only</h2>
			<p class="mt-3 max-w-2xl text-sm leading-7 text-orange-50">
				Kuota terbatas untuk menjaga kualitas mentoring dan diskusi tetap optimal.
			</p>
		</div>
		<a
			href={whatsappUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-sm font-bold text-orange-700 transition hover:bg-orange-50 active:scale-95 sm:w-auto"
		>
			Daftar Sekarang
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2.5"
					d="M17 8l4 4m0 0l-4 4m4-4H3"
				/>
			</svg>
		</a>
	</div>
</section>

<section class="bg-white py-20 dark:bg-gray-950" id="faq">
	<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
		<div class="mb-10 text-center">
			<p class="text-sm font-bold tracking-wider text-orange-600 uppercase">
				Frequently Asked Questions
			</p>
			<h2 class="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
				Pertanyaan yang Sering Diajukan
			</h2>
		</div>

		<div class="space-y-3">
			{#each faqs as faq, index}
				<div class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
					<button
						type="button"
						onclick={() => toggleFaq(index)}
						class="flex w-full items-center justify-between gap-4 bg-slate-50 px-5 py-5 text-left transition hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
						aria-expanded={openFaqIndex === index}
					>
						<span class="font-bold text-slate-900 dark:text-white">{faq.question}</span>
						<svg
							class="h-5 w-5 shrink-0 text-slate-500 transition {openFaqIndex === index
								? 'rotate-180'
								: ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					{#if openFaqIndex === index}
						<div class="bg-white px-5 py-5 dark:bg-slate-950">
							<p class="text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="bg-slate-950 py-20 text-white">
	<div class="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
		<p class="text-sm font-bold tracking-wider text-orange-300 uppercase">
			Crypto Sharia Masterclass
		</p>
		<h2 class="mt-4 text-4xl leading-tight font-black sm:text-5xl">
			Ilmu Dulu. Cuan Kemudian. Berkah Selamanya.
		</h2>
		<p class="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
			Mulai dari ilmu yang benar, bangun strategi yang disiplin, dan tetap berpegang pada prinsip
			syariah.
		</p>
		<a
			href={whatsappUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-orange-500 active:scale-95"
		>
			Daftar Sekarang
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2.5"
					d="M17 8l4 4m0 0l-4 4m4-4H3"
				/>
			</svg>
		</a>
	</div>
</section>
