import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '$lib/firebase';

/**
 * Editable landing page content model.
 *
 * The landing page (`/`) renders entirely from this structure, with sane
 * defaults baked in. Admins edit it through `/admin/landing` and the changes
 * are persisted to Firestore at `site_content/landing`.
 */

export type SectionId =
	| 'hero'
	| 'authority'
	| 'valueProps'
	| 'testimonials'
	| 'usp'
	| 'curriculum'
	| 'instructors'
	| 'pricing'
	| 'urgency'
	| 'faq'
	| 'finalCta';

export type Highlight = { symbol: string; performance: string };
export type Feature = { label: string; title: string; description: string };
export type ProofItem = { meta: string; title: string; description: string; image?: string };
export type Activity = { meta: string; title: string; description: string; image: string };
export type Faq = { question: string; answer: string };
export type Cta = { label: string; href: string };
export type BenefitCard = { title: string; items: string[] };
export type LayoutEntry = { id: SectionId; visible: boolean };
export type PricingPackage = {
	code: string;
	title: string;
	description: string;
	image: string;
	lessons: string[];
	price: string;
	sessionPrice: string;
	ctaMessage: string;
};
export type CurriculumSession = {
	title: string;
	price: string;
	topics: string[];
	speaker: string;
};
export type CurriculumDay = {
	stage: string;
	date: string;
	time?: string;
	description: string;
	sessions: CurriculumSession[];
	packagePrice: string;
	outcome: string;
};
export type Instructor = {
	badge: string;
	name: string;
	credentials: string;
	role: string;
	highlights: string[];
	description: string;
	photo: string;
};

export type LandingContent = {
	/** Order + visibility of sections (acts like a simple page builder). */
	layout: LayoutEntry[];

	/** Shared WhatsApp CTA used by several buttons. */
	whatsapp: { phone: string; message: string };

	seo: { title: string; description: string };

	hero: {
		badge: string;
		title: string;
		subtitle: string;
		description: string;
		primaryCtaLabel: string;
		secondaryCta: Cta;
		videoUrl: string;
		videoLabel: string;
		videoTitle: string;
		videoDescription: string;
		highlights: Highlight[];
	};

	authority: {
		eyebrow: string;
		title: string;
		description: string;
		activities: Activity[];
		cards: { label: string; description: string }[];
	};

	valueProps: {
		eyebrow: string;
		title: string;
		items: Feature[];
		docEyebrow: string;
		docTitle: string;
		docDescription: string;
		docImages: string[];
	};

	testimonials: {
		eyebrow: string;
		title: string;
		description: string;
		items: ProofItem[];
	};

	usp: {
		eyebrow: string;
		title: string;
		description: string;
		quote: string;
		quoteNote: string;
		items: Feature[];
	};

	curriculum: {
		eyebrow: string;
		title: string;
		description: string;
		schedule: CurriculumDay[];
		investmentSummary: {
			sessionPrice: string;
			packagePrice: string;
			totalPrice: string;
		};
		topics: string[];
		outcomes: string[];
		disclaimer: string;
		ctaTitle: string;
		ctaDescription: string;
		primaryCta: Cta;
		secondaryCta: Cta;
	};

	instructors: {
		eyebrow: string;
		title: string;
		description: string;
		closing: string;
		ctaTitle: string;
		ctaDescription: string;
		primaryCta: Cta;
		secondaryCta: Cta;
		items: Instructor[];
	};

	pricing: {
		eyebrow: string;
		title: string;
		description: string;
		dateCard: { label: string; date: string; time?: string };
		packages: PricingPackage[];
		packageBenefits: string[];
		programIncludes: string[];
		benefitCards?: BenefitCard[];
		priceBadge: string;
		originalPrice: string;
		price: string;
		note: string;
		ctaLabel: string;
	};

	urgency: {
		eyebrow: string;
		title: string;
		description: string;
		ctaLabel: string;
	};

	faq: {
		eyebrow: string;
		title: string;
		items: Faq[];
	};

	finalCta: {
		eyebrow: string;
		title: string;
		description: string;
		ctaLabel: string;
	};
};

export const SECTION_LABELS: Record<SectionId, string> = {
	hero: 'Hero / Banner Utama',
	authority: 'Kredibilitas',
	valueProps: 'Manfaat Utama',
	testimonials: 'Testimoni',
	usp: 'Keunggulan Program',
	curriculum: 'Kurikulum',
	instructors: 'Pemateri',
	pricing: 'Harga & Jadwal',
	urgency: 'Urgensi & Kuota',
	faq: 'FAQ',
	finalCta: 'Penutup / CTA Akhir'
};

export const defaultLandingContent: LandingContent = {
	layout: [
		{ id: 'hero', visible: true },
		{ id: 'testimonials', visible: true },
		{ id: 'usp', visible: true },
		{ id: 'curriculum', visible: true },
		{ id: 'valueProps', visible: true },
		{ id: 'instructors', visible: true },
		{ id: 'pricing', visible: true },
		{ id: 'authority', visible: true },
		{ id: 'urgency', visible: true },
		{ id: 'faq', visible: true },
		{ id: 'finalCta', visible: true }
	],
	whatsapp: {
		phone: '6282186584279',
		message: 'Halo admin, saya tertarik mau join Crypto Sharia Masterclass….'
	},
	seo: {
		title: 'Crypto Sharia Masterclass | Bootcamp Crypto Syariah 4 Hari',
		description:
			'Bootcamp crypto syariah 4 hari bersama founder Crypto Sharia, founder Qualifin, dan pakar fiqih muamalah untuk belajar market, risk, technical, dan portofolio.'
	},
	hero: {
		badge: 'Crypto Sharia Masterclass 2026',
		title:
			'Masterclass 4 hari untuk memahami crypto dari sisi industri, analisis pasar, manajemen risiko, dan prinsip syariah agar tidak sekadar ikut tren.',
		subtitle:
			'Belajar crypto secara lebih terarah melalui pendekatan industri, keuangan, dan fiqih muamalah bersama pemateri kredibel.',
		description:
			'Belajar langsung bersama founder Crypto Sharia, founder Qualifin, dan pakar fiqih muamalah dengan pendekatan sistematis, praktis, dan sesuai prinsip syariah.',
		primaryCtaLabel: 'Daftar Sekarang',
		secondaryCta: { label: 'Lihat Kurikulum', href: '#curriculum' },
		videoUrl: '',
		videoLabel: 'intro-masterclass.mp4',
		videoTitle: 'Video Perkenalan Program',
		videoDescription:
			'Placeholder upload-ready untuk memperkenalkan visi program dan mentor utama.',
		highlights: [
			{ symbol: 'FHE', performance: '+400%' },
			{ symbol: 'UMBRA', performance: '+280%' },
			{ symbol: 'HUMANITY', performance: '+220%' },
			{ symbol: 'LIGHT', performance: '+200%' }
		]
	},
	authority: {
		eyebrow: '',
		title: 'Dibangun dari pengalaman edukasi dan komunitas nyata.',
		description:
			'Materi masterclass ini disusun dari pengalaman edukasi, diskusi komunitas, dan kebutuhan nyata peserta dalam memahami crypto secara lebih terarah dan sesuai prinsip syariah. Berbasis pengalaman edukasi bersama 4.000+ member komunitas CryptoSharia.',
		activities: [
			{
				meta: 'Event 2025',
				title: 'Nushafest 2025',
				description:
					'Dokumentasi edukasi publik bersama komunitas yang tertarik pada aset digital halal.',
				image: '/events/nushafest.png'
			},
			{
				meta: 'Event 2025',
				title: 'Halal Kulture Market 2025',
				description: 'Aktivasi edukasi crypto syariah untuk memperluas literasi investor Muslim.',
				image: '/events/halalkulture.png'
			},
			{
				meta: 'Event 2025',
				title: 'Bootcamp Crypto Sharia 2025',
				description:
					'Workshop intensif dan praktik langsung untuk peserta yang ingin memahami crypto secara mendalam.',
				image: '/events/bootcamp.png'
			},
			{
				meta: 'Event 2025',
				title: 'Kopdar Crypto Sharia 2025',
				description: 'Diskusi kecil dan networking antar member untuk memperkuat proses belajar.',
				image: '/events/kopdar.png'
			}
		],
		cards: [
			{
				label: 'Edukasi Komunitas',
				description: 'Materi disusun dari kebutuhan belajar komunitas CryptoSharia.'
			},
			{
				label: 'Diskusi Nyata',
				description: 'Forum tanya jawab dan diskusi komunitas menjadi sumber konteks belajar.'
			},
			{
				label: 'Materi Berbasis Pengalaman',
				description: 'Pembelajaran dibangun dari pengalaman edukasi, market, dan mentoring.'
			},
			{
				label: 'Dokumentasi Event',
				description: 'Aktivitas komunitas dan event menjadi bukti track record edukasi.'
			}
		]
	},
	valueProps: {
		eyebrow:
			'Tiga fokus utama untuk memahami crypto dari sisi peluang, risiko, dan prinsip syariah.',
		title: '3 Pilar Pembelajaran Utama',
		items: [
			{
				label: '',
				title: 'Crypto Sesuai Prinsip Syariah',
				description:
					'Memahami cara menilai aset crypto dari sisi utilitas, risiko, dan prinsip fiqih muamalah.'
			},
			{
				label: '',
				title: 'Wealth Plan yang Lebih Terarah',
				description:
					'Menyusun tujuan, alokasi, dan batas risiko sebelum mengambil keputusan investasi.'
			},
			{
				label: '',
				title: 'Strategi Menghadapi Market Volatil',
				description:
					'Membaca kondisi market dan menjaga disiplin agar tidak mudah terbawa FOMO atau kepanikan.'
			}
		],
		docEyebrow: '',
		docTitle: 'Seminar, mentoring, QnA Session, dan aktivitas komunitas offline.',
		docDescription:
			'Area ini disiapkan untuk foto-foto kegiatan asli ketika materi campaign final tersedia.',
		docImages: []
	},
	testimonials: {
		eyebrow: '',
		title: 'Member Premium Crypto Sharia yang Sudah Bertumbuh Bersama',
		description:
			'Mereka telah membuktikan bahwa berinvestasi di dunia crypto bisa dilakukan dengan ilmu, risiko terukur, dan tetap sesuai prinsip syariah.',
		items: [
			{
				meta: 'Antii, Finance',
				title: 'Diskusi soal halal-haram crypto dibahas dengan bijak.',
				description:
					'Happy rasanya bisa bergabung dikomunitas ini. Diskusi soal halal-haram crypto dibahas dengan bijak oleh ustadz² ,di-lead baik sama ketumnya dan saling mengingatkan antar admin dan member, diskusi terarah tidak langsung menghakimi. Banyak insight juga dr temen² yg udah duluan trading baik itu outlook atau bagi² sygnal lainnya. Smg cryptosharia makin besar dan Istiqomah mengedukasi trading sesuai syariat. Barakallahu fiikum'
			},
			{
				meta: 'Muhamad Cholid, Staff Marketing',
				title: 'Sangat membantu untuk kita yang belajar crypto.',
				description:
					'Manfaat yang di dapatkan dari Crypto Sharia : Alhamdulillah bermanfaat sekali semenjak bergabung dengan CryptoSharia ini, banyak ilmu yang di dapat. Dari ilmu di wa sampai discord, apalagi adanya Chat Kumpulan Fatwa & Rekaman Webinar sangat membantu untuk kita yang belajar crypto. Harapannya semoga CrytoSharia semakin besar dan jadi manfaat untuk banyak orang. Doa terbaiknya saemoga CrytoSharia jadi komunitas utama bagi Muslim Indonesia. Jazaakumullahu khairan wa baarakallahu fiikum 🙏'
			},
			{
				meta: 'Rainsha Sinna, Freelancer',
				title: 'Alhamdulillah ortu ana udah profit lebih dari 10%.',
				description:
					'Kalo kebermanfaatan komunitas ini buat ana pribadi masih di level ilmu ya, kalau level investasi itu ortu ana. Jadi ana ngebantuin ortu yg lagi invest di crypto, setelah kami sama2 mulai terbuka bahwa crypto itu gak mutlak haram. Terus komunitas CryptoSharia nongol di feed IG. Dari sana ana banyak belajar dari webinar, grup WA & Discord komunitas ini, dan diskusi ana dgn ortu seputar crypto juga ya ttg apa yg ana dapetin dari komunitas. Alhamdulillah biidznillah ortu ana udah mulai "memetik buahnya", lebih dari 10% profitnya dan sempat TP sebagian. Semoga komunitas CryptoSharia bisa terus berkembang dan jadi jalan bagi kaum muslimin...'
			},
			{
				meta: 'Aizul, Programmer',
				title: 'Memberikan saya banyak manfaat, apalagi sebagai pemula.',
				description:
					'Bergabung dengan komunitas Crypto Sharia memberikan saya banyak manfaat, apalagi sebagai pemula. Di sini saya belajar mulai dari pengertian dasar, istilah penting, strategi investasi, hingga aspek hukum kripto menurut syariat Islam. Saya berharap Crypto Sharia bisa menjadi pelopor utama di Indonesia dalam menyebarkan edukasi dan informasi bermanfaat bagi umat Muslim tentang dunia investasi kripto yang halal dan sesuai syariah.'
			},
			{
				meta: 'Ibrahim, Karyawan Swasta',
				title: 'Jadi pede investasi ke Crypto karena sesuai Syariat.',
				description:
					'Alhamdulillah seneng sekali pas lihat Instagram ternyata ada komunitas Crypto Sharia, dan jadi pede untuk Investasi ke Crypto karena ada fatwa2 dari Ulama bahwa hukumnya Halal / Mubah (Tergantung koinnya juga) . Lalu juga di Komunitas ini saya jadi belajar bahwa Investasi di Cryptocurrency harus disertai dengan ilmunya. Halal kah koin tsb, seperti apa fundamental nya, lalu update ekonomi makro nya seperti apa dll. Harapan nya agar Crypto Sharia bisa benar2 menjadi wadah untuk kaum muslimin yg mau Investasi di Crypto dengan Halal & sesuai syariat Agama Islam. Barakallahufiikum..'
			}
		]
	},
	usp: {
		eyebrow: '',
		title: 'Kenapa Harus Crypto Sharia Masterclass?',
		description:
			'Program ini tidak hanya membahas teori crypto, tetapi dirancang agar peserta belajar secara lebih terarah melalui praktik, mentoring, evaluasi, dan pendekatan sesuai prinsip syariah.',
		quote: '"The best investment you can make is an investment in yourself." — Warren Buffett',
		quoteNote:
			'Sebelum masuk ke market yang volatile, peserta perlu membangun ilmu, cara berpikir, dan manajemen risiko yang lebih matang.',
		items: [
			{
				label: '',
				title: 'Materi Terstruktur',
				description:
					'Alur belajar disusun bertahap dari dasar industri crypto, analisis pasar, prinsip syariah, hingga strategi portfolio.'
			},
			{
				label: '',
				title: 'Sharia Compliant',
				description: 'Belajar fiqih muamalah dan metode analisis crypto sesuai prinsip syariah.'
			},
			{
				label: '',
				title: 'Tugas Praktik Langsung',
				description:
					'Setiap materi dilengkapi penugasan agar peserta langsung mempraktikkan ilmu yang dipelajari.'
			},
			{
				label: '',
				title: 'FGD & Mentoring',
				description:
					'Diskusi kelompok kecil bersama mentor untuk membantu peserta memahami materi secara lebih personal.'
			},
			{
				label: '',
				title: 'Komunitas Global',
				description: 'Akses networking bersama member dari berbagai industri dan profesi.'
			},
			{
				label: '',
				title: 'Sertifikat Kelulusan',
				description:
					'Peserta mendapatkan sertifikat setelah menyelesaikan evaluasi akhir sebagai bukti kompetensi.'
			}
		]
	},
	pricing: {
		eyebrow: '',
		title: 'Amankan Kursi Crypto Sharia Masterclass 2026',
		description:
			'Program intensif untuk memahami crypto dari sudut pandang syariah, praktik, dan risiko secara lebih terarah.',
		dateCard: {
			label: 'Jadwal Pelaksanaan',
			date: '4–12 Juli 2026',
			time: '08.30 - 12.00 WIB (2 Sesi/Hari)'
		},
		packages: [
			{
				code: 'Paket A',
				title: 'Pondasi Crypto & Financial Planning',
				description:
					'Bangun fondasi yang solid untuk memahami crypto, Web3, perencanaan keuangan, dan manajemen risiko sebelum mulai berinvestasi.',
				image: '/images/packages/paket-a-fundamental.jpeg',
				lessons: [
					'Pengenalan blockchain dan cryptocurrency',
					'Ekosistem Web3 dan aplikasinya',
					'Peran dan keamanan aset digital',
					'Strategi perencanaan keuangan personal',
					'Manajemen risiko investasi crypto',
					'Strategi membangun portfolio jangka panjang'
				],
				price: 'Rp750.000',
				sessionPrice: 'Harga per sesi: Rp500.000',
				ctaMessage:
					"Assalamu'alaikum admin, saya tertarik ikut Paket A Pondasi Crypto & Financial Planning."
			},
			{
				code: 'Paket B',
				title: 'Analisis Fundamental & Global Macro',
				description:
					'Tingkatkan kualitas keputusan investasi dengan analisis proyek crypto dan sinyal makroekonomi global yang berbasis data.',
				image: '/images/packages/paket-b-market-analysis.jpeg',
				lessons: [
					'Evaluasi whitepaper dan tim proyek',
					'Analisis utility token dan use case',
					'Penilaian sustainabilitas proyek jangka panjang',
					'Dampak kebijakan ekonomi global pada crypto',
					'Membaca indikator makroekonomi untuk timing pasar',
					'Analisis sentimen dan tren pasar crypto'
				],
				price: 'Rp750.000',
				sessionPrice: 'Harga per sesi: Rp500.000',
				ctaMessage:
					"Assalamu'alaikum admin, saya tertarik ikut Paket B Analisis Fundamental & Global Macro."
			},
			{
				code: 'Paket C',
				title: 'Analisis Teknikal',
				description:
					'Pelajari price action, pola grafik, indikator teknikal, dan eksekusi trading dengan manajemen risiko yang solid.',
				image: '/images/packages/paket-c-technical-analysis.jpeg',
				lessons: [
					'Pengenalan analisis teknikal dan anatomi grafik',
					'Chart pattern untuk membaca struktur besar grafik',
					'Candlestick pattern untuk navigasi jangka pendek dan timing',
					'Technical indicator analysis sebagai alat bantu konfirmasi matematis',
					'Market cycle, struktur, dan prospect sebagai sintesis peta besar',
					'Praktik penggunaan jurnal trading untuk mengukur progress'
				],
				price: 'Rp750.000',
				sessionPrice: 'Harga per sesi: Rp500.000',
				ctaMessage: "Assalamu'alaikum admin, saya tertarik ikut Paket C Analisis Teknikal."
			},
			{
				code: 'Paket D',
				title: 'Analisis Syariah & Screening Koin',
				description:
					'Pahami fikih muamalah, fatwa crypto, screening aset halal, dan pengelolaan zakat untuk investasi yang sesuai prinsip Islam.',
				image: '/images/packages/paket-d-sharia-screening.jpeg',
				lessons: [
					'Landasan fikih muamalah dalam transaksi digital',
					'Fatwa dan pandangan ulama tentang cryptocurrency',
					'Zakat aset crypto dan pengelolaan kewajiban',
					'Framework screening aset crypto yang halal',
					'Studi kasus evaluasi berbagai cryptocurrency',
					'Praktik membuat keputusan investasi sesuai syariah'
				],
				price: 'Rp750.000',
				sessionPrice: 'Harga per sesi: Rp500.000',
				ctaMessage:
					"Assalamu'alaikum admin, saya tertarik ikut Paket D Analisis Syariah & Screening Koin."
			}
		],
		packageBenefits: [
			'Materi terstruktur dari dasar hingga praktik',
			'FGD & mentoring bersama mentor berpengalaman',
			'Penugasan untuk memperkuat pemahaman',
			'Sertifikat penyelesaian program'
		],
		programIncludes: [
			'4 sesi live masterclass terstruktur',
			'Akses materi dan rekaman kelas',
			'Tugas praktik untuk memahami konsep',
			'Evaluasi akhir sebagai ukuran progres',
			'FGD dan mentoring bersama mentor',
			'Networking komunitas CryptoSharia',
			'Sertifikat kelulusan program'
		],
		priceBadge: 'PAKET LENGKAP 4 HARI',
		originalPrice: 'Rp5.000.000',
		price: 'Rp3.000.000',
		note: 'Ambil empat paket sekaligus dan hemat Rp1.000.000 dibandingkan pembelian per sesi.',
		ctaLabel: 'Amankan Kursi Sekarang'
	},
	curriculum: {
		eyebrow: 'Masterclass Crypto Sharia',
		title: 'Jadwal & Pembagian Materi',
		description:
			'Empat paket pembelajaran intensif dari pondasi crypto hingga screening aset sesuai prinsip syariah.',
		schedule: [
			{
				stage: 'Pondasi Crypto & Financial Planning',
				date: 'Sabtu, 4 Juli 2026',
				time: '08.30 - 12.00 WIB',
				description:
					'Bangun fondasi yang solid untuk memulai perjalanan crypto dengan percaya diri. Setelah modul ini, kamu akan memahami cara kerja blockchain, mengidentifikasi peluang di ekosistem Web3, dan membuat rencana investasi yang terstruktur sesuai profil risiko kamu—sehingga siap untuk langkah investasi berikutnya dengan strategi yang jelas.',
				sessions: [
					{
						title: 'Crypto & Web3 Industry Map',
						price: 'Rp500k per sesi',
						topics: [
							'Pengenalan blockchain dan cryptocurrency',
							'Ekosistem Web3 dan aplikasinya',
							'Peran dan keamanan aset digital'
						],
						speaker: 'Sholahuddin Al Ayyubi'
					},
					{
						title: 'Financial Planning & Risk Management',
						price: 'Rp500k per sesi',
						topics: [
							'Strategi perencanaan keuangan personal',
							'Manajemen risiko investasi crypto',
							'Strategi building long-term portfolio'
						],
						speaker: 'Muhammad Ghithrif Gustomo Putra'
					}
				],
				packagePrice: 'Rp750k',
				outcome:
					'Peserta memahami gambaran besar industri crypto serta cara mengelola risiko sebelum mengambil keputusan investasi.'
			},
			{
				stage: 'Analisis Fundamental & Global Macro',
				date: 'Minggu, 5 Juli 2026',
				time: '08.30 - 12.00 WIB',
				description:
					'Tingkatkan keputusan investasi kamu dari speculative menjadi data-driven. Dengan modul ini, kamu dapat menganalisis proyek crypto secara mendalam, membaca sinyal makroekonomi global, dan mengidentifikasi aset terbaik di tengah volatilitas pasar—sehingga meningkatkan akurasi entry point dan confidence level saat bertransaksi.',
				sessions: [
					{
						title: 'Analisis Fundamental Crypto',
						price: 'Rp500k per sesi',
						topics: [
							'Evaluasi whitepaper dan tim proyek',
							'Analisis utility token dan use case',
							'Penilaian sustainabilitas proyek jangka panjang'
						],
						speaker: 'Muhammad Ghithrif Gustomo Putra'
					},
					{
						title: 'Analisis Makro Global',
						price: 'Rp500k per sesi',
						topics: [
							'Dampak kebijakan ekonomi global pada crypto',
							'Membaca indikator makroekonomi untuk timing pasar',
							'Analisis sentimen dan tren pasar crypto'
						],
						speaker: 'Muhammad Ghithrif Gustomo Putra'
					}
				],
				packagePrice: 'Rp750k',
				outcome:
					'Peserta belajar membaca kualitas aset, narasi pasar, dan pengaruh kondisi makro terhadap pergerakan crypto.'
			},
			{
				stage: 'Analisis Teknikal',
				date: 'Sabtu, 11 Juli 2026',
				time: '08.30 - 12.00 WIB',
				description:
					'Kuasai timing yang tepat untuk entry dan exit dengan presisi tinggi. Modul ini mengajari kamu membaca price action seperti seorang profesional trader, mengenali pola-pola yang berulang, dan menggunakan indikator teknikal sebagai tools konfirmasi—sehingga kamu bisa mengambil keuntungan maksimal dari setiap pergerakan pasar dan meminimalkan kerugian dengan risk management yang solid.',
				sessions: [
					{
						title: 'Fondasi & Pattern Grafik',
						price: 'Rp500k per sesi',
						topics: [
							'Pengenalan analisis teknikal & anatomi grafik',
							'Chart pattern (membaca struktur besar grafik)',
							'Candlestick pattern (navigasi jangka pendek & timing)'
						],
						speaker: 'Muhammad Ghithrif Gustomo Putra'
					},
					{
						title: 'Indikator & Eksekusi Trading',
						price: 'Rp500k per sesi',
						topics: [
							'Technical indicator analysis (alat bantu konfirmasi matematis)',
							'Market cycle, struktur & prospect (sintesis peta besar)',
							'Praktik penggunaan jurnal trading untuk mengukur progress'
						],
						speaker: 'Muhammad Ghithrif Gustomo Putra'
					}
				],
				packagePrice: 'Rp750k',
				outcome:
					'Peserta memahami cara membaca chart, menggunakan indikator, dan menyusun eksekusi trading dengan risiko terukur.'
			},
			{
				stage: 'Analisis Syariah & Screening Koin',
				date: 'Minggu, 12 Juli 2026',
				time: '08.30 - 12.00 WIB',
				description:
					'Investasi crypto dengan full confidence dan ketenangan hati sesuai prinsip Islam. Modul ini memberikan kamu framework lengkap untuk screening aset halal, memahami hukum syariah dalam crypto, dan mengelola zakat dengan benar—sehingga kamu bisa berkembang finansial tanpa khawatir dan sepenuh hati yakin bahwa setiap langkah investasi sesuai dengan nilai-nilai Islam yang kamu anut.',
				sessions: [
					{
						title: 'Fikih Muamalah & Fatwa Crypto',
						price: 'Rp500k per sesi',
						topics: [
							'Landasan fikih muamalah dalam transaksi digital',
							'Fatwa dan pandangan ulama tentang cryptocurrency',
							'Zakat aset crypto dan pengelolaan kewajiban'
						],
						speaker: 'Devin Halim'
					},
					{
						title: 'Screening Koin & Bedah Kasus',
						price: 'Rp500k per sesi',
						topics: [
							'Framework screening aset crypto yang halal',
							'Studi kasus evaluasi berbagai cryptocurrency',
							'Praktik membuat keputusan investasi sesuai syariah'
						],
						speaker: 'Sholahuddin Al Ayyubi'
					}
				],
				packagePrice: 'Rp750k',
				outcome:
					'Peserta memahami prinsip fikih muamalah dan mampu mempraktikkan screening aset crypto sesuai syariah.'
			}
		],
		investmentSummary: {
			sessionPrice: 'Rp500k',
			packagePrice: 'Rp750k',
			totalPrice: 'Rp3.000.000'
		},
		topics: [
			'Crypto & Web3 Industry Map',
			'Financial Planning & Risk Management',
			'Analisis Fundamental Crypto',
			'Analisis Makro Global',
			'Fondasi & Pattern Grafik',
			'Indikator & Eksekusi Trading',
			'Fikih Muamalah & Fatwa Crypto',
			'Screening Koin & Bedah Kasus'
		],
		outcomes: [
			'Memahami peta besar industri crypto dan Web3.',
			'Membaca risiko sebelum mengambil keputusan investasi.',
			'Memahami analisis fundamental, narasi pasar, dan makro global.',
			'Menggunakan dasar analisis teknikal secara lebih terarah.',
			'Memahami prinsip dasar analisis coin dari sisi syariah.',
			'Menyusun portfolio crypto jangka panjang dengan risk management.'
		],
		disclaimer:
			'Materi bootcamp bersifat edukasi dan bukan merupakan ajakan membeli atau menjual aset crypto tertentu. Peserta tetap perlu memahami risiko dan mengambil keputusan secara mandiri.',
		ctaTitle: 'Siap memahami crypto syariah secara lebih terstruktur?',
		ctaDescription:
			'Ikuti alur belajar 4 hari dari peta industri, analisis pasar, prinsip syariah, hingga portfolio jangka panjang.',
		primaryCta: { label: 'Daftar Sekarang', href: '' },
		secondaryCta: { label: 'Tanya Program', href: '' }
	},
	instructors: {
		eyebrow: '',
		title: 'Tiga Perspektif Kredibel dalam Satu Bootcamp',
		description:
			'Crypto syariah tidak cukup dipahami hanya dari sisi peluang aset digital. Di bootcamp ini, peserta akan belajar dari tiga perspektif penting: industri crypto, strategi keuangan, dan prinsip fiqih muamalah.',
		closing: '',
		ctaTitle: 'Siap memahami crypto syariah secara lebih utuh?',
		ctaDescription:
			'Belajar dari tiga perspektif: industri crypto, strategi keuangan, dan prinsip fiqih muamalah.',
		primaryCta: { label: 'Lihat Kurikulum', href: '#curriculum' },
		secondaryCta: { label: 'Diskusi via WhatsApp', href: '' },
		items: [
			{
				badge: 'Founder of Crypto Sharia',
				name: 'Sholahuddin Al Ayyubi',
				credentials: 'B.B.A. · WMI · AWP',
				role: 'Founder of Crypto Sharia',
				highlights: [
					'B.B.A. dari LIPIA Jakarta',
					'Certified WMI, Wakil Manajer Investasi standar nasional BNSP',
					'Certified AWP, Associate Wealth Planner standar internasional',
					'Certified International Business Coach dari ICF'
				],
				description:
					'Membawakan perspektif industri crypto, Web3, analisis koin syariah, dan strategi investasi yang sesuai dengan prinsip syariah.',
				photo: '/instructors/sholahuddin-al-ayyubi.jpeg'
			},
			{
				badge: 'Founder of Qualifin',
				name: 'Muhammad Ghithrif Gustomo Putra',
				credentials: 'S.E. · CFA · CFP · CSA · CTA',
				role: 'VP Marketing (Ex. Ajaib Kripto)',
				highlights: [
					'CFA, kredensial global bergengsi di bidang investasi',
					'CFP, sertifikasi profesional perencanaan keuangan',
					'CSA & CTA di bidang analisis pasar',
					'Berpengalaman di risk management, fundamental, & macro analysis'
				],
				description:
					'Membantu peserta memahami cara membaca risiko, fundamental aset, narasi pasar, dan pengaruh kondisi makro terhadap keputusan investasi.',
				photo: '/instructors/muhammad-ghithrif.jpeg'
			},
			{
				badge: 'Pakar Fiqih Muamalah',
				name: 'Devin Halim',
				credentials: 'B.B.A, M.Sc · AAOIFI · DPS MUI',
				role: 'Pakar Fiqih Muamalah',
				highlights: [
					'Latar belakang akademik S1 dan S2',
					'Sedang menempuh program S3',
					'Tersertifikasi AAOIFI di bidang Islamic Finance',
					'Tersertifikasi Dewan Pengawas Syariah MUI'
				],
				description:
					'Membawakan perspektif fiqih muamalah untuk membantu peserta memahami prinsip syariah, batasan transaksi, dan kehati-hatian dalam memilih serta menggunakan aset crypto.',
				photo: '/instructors/devin-halim.jpeg'
			}
		]
	},
	urgency: {
		eyebrow: '',
		title: 'Harga Spesial untuk 10 Peserta Pertama',
		description: 'Kuota terbatas untuk menjaga kualitas mentoring dan diskusi tetap optimal.',
		ctaLabel: 'Daftar Sekarang'
	},
	faq: {
		eyebrow: '',
		title: 'Frequently Asked Questions',
		items: [
			{
				question: 'Apakah bootcamp ini memberikan rekomendasi beli coin tertentu?',
				answer:
					'Tidak. Materi bersifat edukasi dan membantu peserta memahami cara menganalisis aset, risiko, dan prinsip syariah. Keputusan investasi tetap menjadi tanggung jawab masing-masing peserta.'
			},
			{
				question: 'Apakah kelas ini cocok untuk pemula yang belum pernah beli crypto?',
				answer:
					'Sangat cocok. Hari pertama difokuskan untuk membangun fondasi industri crypto dan blockchain agar pemula tidak tertinggal saat masuk ke materi analisis yang lebih teknis.'
			},
			{
				question: 'Apa yang membedakan program ini dengan masterclass lain?',
				answer:
					'Program ini menggabungkan edukasi investasi crypto, manajemen risiko, komunitas, mentoring, serta pendekatan syariah secara komprehensif.'
			},
			{
				question: 'Apakah kelas dilakukan live atau rekaman?',
				answer:
					'Bootcamp dirancang sebagai kelas live terstruktur agar peserta bisa mengikuti penjelasan, diskusi, dan tanya jawab secara langsung.'
			},
			{
				question: 'Bagaimana jika tidak bisa hadir di salah satu sesi?',
				answer:
					'Peserta akan mendapatkan akses rekaman materi sehingga tetap dapat mengikuti pembelajaran.'
			},
			{
				question: 'Apakah peserta mendapatkan sertifikat?',
				answer:
					'Ya. Peserta mendapatkan sertifikat setelah mengikuti rangkaian bootcamp dan menyelesaikan ketentuan program.'
			},
			{
				question: 'Apakah ada grup komunitas setelah kelas?',
				answer:
					'Ya. Peserta mendapatkan akses komunitas untuk diskusi, networking, dan pendampingan lanjutan sesuai format program.'
			},
			{
				question: 'Apakah materi membahas coin halal dan haram?',
				answer:
					'Materi membahas prinsip dasar analisis aset crypto dari perspektif bisnis, utilitas, risiko, dan syariah agar peserta memiliki kerangka penilaian yang lebih terarah.'
			},
			{
				question: 'Apakah ada praktik analisis?',
				answer:
					'Ya. Peserta akan diarahkan memahami praktik analisis fundamental, narasi pasar, teknikal dasar, manajemen risiko, dan penyusunan portfolio.'
			},
			{
				question: 'Apakah cocok untuk yang belum pernah investasi crypto?',
				answer:
					'Cocok, selama peserta siap belajar dari dasar dan memahami bahwa aset crypto memiliki risiko tinggi serta membutuhkan manajemen risiko yang disiplin.'
			},
			{
				question: 'Apakah pembayaran bisa transfer?',
				answer:
					'Bisa. Detail pembayaran dan konfirmasi pendaftaran dapat dikonsultasikan melalui WhatsApp admin CryptoSharia.'
			},
			{
				question: 'Bagaimana cara konfirmasi pendaftaran?',
				answer:
					'Setelah menghubungi admin melalui WhatsApp, peserta akan dibantu untuk mendapatkan detail pembayaran dan konfirmasi kuota program.'
			}
		]
	},
	finalCta: {
		eyebrow: '',
		title: 'Pahami Ilmunya. Kelola Risikonya. Jaga Prinsipnya.',
		description:
			'Mulai dari ilmu yang benar, bangun strategi yang disiplin, dan tetap berpegang pada prinsip syariah.',
		ctaLabel: 'Daftar Sekarang'
	}
};

const CONTENT_REF = () => doc(db, 'site_content', 'landing');

/** Build the WhatsApp deep link from configurable phone + message. */
export function buildWhatsappUrl(whatsapp: { phone: string; message: string }): string {
	return `https://api.whatsapp.com/send?phone=${whatsapp.phone}&text=${encodeURIComponent(
		whatsapp.message
	)}`;
}

export type VideoEmbed =
	| { kind: 'iframe'; src: string }
	| { kind: 'file'; src: string }
	| { kind: 'none' };

/**
 * Normalize a user-provided video link into something the page can render.
 * Supports YouTube (watch, youtu.be, shorts, embed), Vimeo, and direct video
 * files (mp4/webm/ogg). Unknown links fall back to an iframe.
 */
export function resolveVideoEmbed(url: string): VideoEmbed {
	const raw = (url ?? '').trim();
	if (!raw) return { kind: 'none' };

	// Direct video file
	if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(raw)) {
		return { kind: 'file', src: raw };
	}

	// YouTube
	const yt = raw.match(
		/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i
	);
	if (yt) {
		return { kind: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}` };
	}

	// Vimeo
	const vimeo = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
	if (vimeo) {
		return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` };
	}

	// Fallback: assume it is already an embeddable URL
	return { kind: 'iframe', src: raw };
}

/**
 * Deep-merge stored content over the defaults so any missing/new field always
 * falls back to a sensible value. Arrays are replaced wholesale when present.
 */
export function mergeContent(stored: Partial<LandingContent> | null | undefined): LandingContent {
	const base: LandingContent = structuredClone(defaultLandingContent);
	if (!stored) return normalizeContent(base);

	const merge = (
		target: Record<string, unknown>,
		source: Record<string, unknown>
	): Record<string, unknown> => {
		for (const key of Object.keys(source)) {
			const value = source[key];
			if (value === undefined || value === null) continue;
			if (Array.isArray(value)) {
				target[key] = value;
			} else if (isRecord(value)) {
				const current = isRecord(target[key]) ? target[key] : {};
				target[key] = merge(current, value);
			} else {
				target[key] = value;
			}
		}
		return target;
	};

	return normalizeContent(
		merge(
			base as unknown as Record<string, unknown>,
			stored as unknown as Record<string, unknown>
		) as unknown as LandingContent
	);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeContent(content: LandingContent): LandingContent {
	content.layout = normalizeLayout(content.layout);
	content.hero = normalizeHero(content.hero);
	content.authority = normalizeAuthority(content.authority);
	content.valueProps = normalizeValueProps(content.valueProps);
	content.testimonials = normalizeTestimonials(content.testimonials);
	content.usp = normalizeUsp(content.usp);
	content.curriculum = normalizeCurriculum(content.curriculum);
	content.instructors = normalizeInstructors(content.instructors);
	content.pricing = normalizePricing(content.pricing);
	content.urgency = normalizeUrgency(content.urgency);
	content.faq = normalizeFaq(content.faq);
	content.finalCta = normalizeFinalCta(content.finalCta);
	return content;
}

function normalizeHero(hero: LandingContent['hero']): LandingContent['hero'] {
	const defaults = defaultLandingContent.hero;
	const oldBadges = new Set(['Crypto Sharia Masterclass Learning', 'Crypto Sharia Masterclass']);
	const oldTitles = new Set([
		'Belajar Crypto dengan Ilmu, Risiko yang Terukur, dan Prinsip Syariah'
	]);
	const oldSubtitles = new Set([
		'Bootcamp intensif 4 hari untuk memahami industri crypto, manajemen risiko, analisis market, screening syariah, dan portfolio building.',
		'Bootcamp intensif 4 hari untuk memahami industri crypto, manajemen risiko, analisa market, screening syariah, dan portfolio building.',
		'Masterclass 4 hari untuk memahami peta industri crypto, analisis market, sharia screening, dan strategi portfolio jangka panjang.'
	]);
	const oldCtas = new Set(['Join Now / Gabung Sekarang', 'Join Now / Daftar sekarang']);

	if (!hero.badge?.trim() || oldBadges.has(hero.badge.trim())) hero.badge = defaults.badge;
	if (!hero.title?.trim() || oldTitles.has(hero.title.trim())) hero.title = defaults.title;
	if (!hero.subtitle?.trim() || oldSubtitles.has(hero.subtitle.trim())) {
		hero.subtitle = defaults.subtitle;
	}
	if (!hero.primaryCtaLabel?.trim() || oldCtas.has(hero.primaryCtaLabel.trim())) {
		hero.primaryCtaLabel = defaults.primaryCtaLabel;
	}

	return hero;
}

function normalizeAuthority(authority: LandingContent['authority']): LandingContent['authority'] {
	const defaults = defaultLandingContent.authority;
	const oldDescriptions = new Set([
		'Program ini menggabungkan pengalaman praktisi, standar sertifikasi, dan proses belajar komunitas agar peserta memahami crypto secara sistematis, bukan sekadar mengikuti hype.'
	]);
	const oldProofLabels = new Set([
		'Analisa Market',
		'Analisis Market',
		'Pencapaian Member',
		'Discord Community'
	]);

	if (!authority.description?.trim() || oldDescriptions.has(authority.description.trim())) {
		authority.description = defaults.description;
	}
	if (
		!Array.isArray(authority.cards) ||
		authority.cards.length === 0 ||
		authority.cards.every((card) => oldProofLabels.has(card.label?.trim() ?? ''))
	) {
		authority.cards = defaults.cards;
	}
	authority.activities = normalizeAuthorityActivities(authority.activities, defaults.activities);

	return authority;
}

function normalizeAuthorityActivities(
	activities: LandingContent['authority']['activities'] | undefined,
	fallback: LandingContent['authority']['activities']
): LandingContent['authority']['activities'] {
	const source = Array.isArray(activities) && activities.length > 0 ? activities : fallback;

	return source.map((activity, index) => {
		const fallbackActivity = fallback[index] ?? fallback[0];
		return {
			meta: activity.meta?.trim() || fallbackActivity.meta,
			title: activity.title?.trim() || fallbackActivity.title,
			description: activity.description?.trim() || fallbackActivity.description,
			image: activity.image?.trim() || fallbackActivity.image
		};
	});
}

function normalizeUrgency(urgency: LandingContent['urgency']): LandingContent['urgency'] {
	const defaults = defaultLandingContent.urgency;
	const oldTitles = new Set(['Special Price for 10 Pax Only']);

	if (!urgency.title?.trim() || oldTitles.has(urgency.title.trim())) {
		urgency.title = defaults.title;
	}
	if (!urgency.ctaLabel?.trim()) urgency.ctaLabel = defaults.ctaLabel;

	return urgency;
}

function normalizeValueProps(
	valueProps: LandingContent['valueProps']
): LandingContent['valueProps'] {
	const defaults = defaultLandingContent.valueProps;
	const oldSectionTitles = new Set(['Apa yang Akan Dipelajari?']);
	const oldTitles = new Map([
		['Strategi Cuan Halal di Crypto', defaults.items[0].title],
		['Strategi Investasi Crypto Sesuai Prinsip Syariah', defaults.items[0].title],
		['Memahami Crypto Sesuai Prinsip Syariah', defaults.items[0].title],
		['Build Your Sharia Wealth', defaults.items[1].title],
		['Membangun Wealth Plan yang Lebih Terarah', defaults.items[1].title],
		['Strategi Bertahan di Bear Market', defaults.items[2].title],
		['Strategi Bertahan di Market Volatil', defaults.items[2].title]
	]);
	const stalePillarCopy = valueProps.items?.some((item) => {
		const title = item.title?.trim() ?? '';
		const description = item.description?.trim() ?? '';
		return (
			oldTitles.has(title) ||
			description.includes('aset dan kekayaan') ||
			description.includes('market sedang turun') ||
			description.toLowerCase().includes('cuan')
		);
	});

	if (!valueProps.title?.trim() || oldSectionTitles.has(valueProps.title.trim())) {
		valueProps.title = defaults.title;
	}
	valueProps.items = stalePillarCopy
		? structuredClone(defaults.items)
		: normalizeFeatures(valueProps.items, defaults.items, oldTitles);
	if (!valueProps.docTitle?.trim()) valueProps.docTitle = defaults.docTitle;
	if (!valueProps.docDescription?.trim()) valueProps.docDescription = defaults.docDescription;

	return valueProps;
}

function normalizeFeatures(
	items: Feature[] | undefined,
	fallback: Feature[],
	oldTitles: Map<string, string>
): Feature[] {
	const sourceItems = Array.isArray(items) && items.length > 0 ? items : fallback;

	return sourceItems.map((item, index) => {
		const fallbackItem = fallback[index] ?? fallback[0];
		const title = item.title?.trim() ?? '';
		return {
			label: item.label?.trim() || fallbackItem.label,
			title: (oldTitles.get(title) ?? title) || fallbackItem.title,
			description: item.description?.trim() || fallbackItem.description
		};
	});
}

function normalizeBakuCopy(value: string): string {
	return value
		.replace(new RegExp(`\\b${'Prak' + 'tek'}\\b`, 'g'), 'Praktik')
		.replace(new RegExp(`\\b${'prak' + 'tek'}\\b`, 'g'), 'praktik')
		.replace(new RegExp(`\\b${'mem' + 'prak' + 'tekkan'}\\b`, 'g'), 'mempraktikkan')
		.replace(new RegExp(`\\b${'Anal' + 'isa'}\\b`, 'g'), 'Analisis')
		.replace(new RegExp(`\\b${'anal' + 'isa'}\\b`, 'g'), 'analisis');
}

function normalizeUsp(usp: LandingContent['usp']): LandingContent['usp'] {
	const defaults = defaultLandingContent.usp;
	const oldTitles = new Map([
		['Komunitas Pembelajar', 'Komunitas Global'],
		['Akses Komunitas CryptoSharia', 'Komunitas Global'],
		['Networking Komunitas', 'Komunitas Global']
	]);
	const oldDescriptions = new Map([
		[
			'Setiap materi dilengkapi penugasan agar peserta langsung mempraktikkan ilmunya.',
			'Setiap materi dilengkapi penugasan agar peserta langsung mempraktikkan ilmu yang dipelajari.'
		],
		[
			'Diskusi kelompok kecil 5-10 orang bersama mentor untuk pendampingan yang lebih personal.',
			'Diskusi kelompok kecil bersama mentor untuk membantu peserta memahami materi secara lebih personal.'
		],
		[
			'Belajar fiqih muamalah serta metode analisis crypto sesuai prinsip syariah.',
			'Belajar fiqih muamalah dan metode analisis crypto sesuai prinsip syariah.'
		],
		[
			'Akses networking eksklusif bersama ratusan member dari berbagai industri dan profesi.',
			'Akses networking bersama member dari berbagai industri dan profesi.'
		]
	]);
	const oldQuotes = new Set([
		'"The best investment you can make is an investment in yourself." - Warren Buffett'
	]);

	if (!usp.title?.trim()) usp.title = defaults.title;
	if (!usp.description?.trim()) usp.description = defaults.description;
	if (!usp.quote?.trim() || oldQuotes.has(usp.quote.trim())) usp.quote = defaults.quote;
	if (!usp.quoteNote?.trim()) usp.quoteNote = defaults.quoteNote;
	usp.items = normalizeUspItems(usp.items, defaults.items, oldTitles, oldDescriptions);

	return usp;
}

function normalizeUspItems(
	items: Feature[] | undefined,
	fallback: Feature[],
	oldTitles: Map<string, string>,
	oldDescriptions: Map<string, string>
): Feature[] {
	const sourceItems = Array.isArray(items) && items.length > 0 ? items : fallback;
	const normalized = sourceItems.map((item, index) => {
		const fallbackItem = fallback[index] ?? fallback[0];
		const title = normalizeBakuCopy(item.title?.trim() ?? '');
		const description = normalizeBakuCopy(item.description?.trim() ?? '');
		return {
			label: item.label?.trim() || fallbackItem.label,
			title: (oldTitles.get(title) ?? title) || fallbackItem.title,
			description: (oldDescriptions.get(description) ?? description) || fallbackItem.description
		};
	});
	const existingTitles = new Set(normalized.map((item) => item.title));

	for (const fallbackItem of fallback) {
		if (!existingTitles.has(fallbackItem.title)) {
			normalized.push({ ...fallbackItem });
		}
	}

	return sortUspItems(normalized);
}

function sortUspItems(items: Feature[]): Feature[] {
	const priority = [
		'Materi Terstruktur',
		'Sharia Compliant',
		'Tugas Praktik Langsung',
		'FGD & Mentoring',
		'Komunitas Global',
		'Sertifikat Kelulusan'
	];
	const rank = (title: string) => {
		const index = priority.findIndex((item) => item === title);
		return index === -1 ? priority.length : index;
	};

	return [...items].sort((a, b) => rank(a.title) - rank(b.title));
}

function normalizeCurriculum(
	curriculum: LandingContent['curriculum']
): LandingContent['curriculum'] {
	const defaults = defaultLandingContent.curriculum;
	const oldTitles = new Set([
		'Jadwal & Materi Bootcamp',
		'Materi Pembelajaran',
		'Detail Kurikulum',
		'Kurikulum 4 Hari: Dari Dasar Crypto hingga Portfolio Syariah'
	]);
	const oldEyebrows = new Set(['Detail Kurikulum', 'Kurikulum Bootcamp']);
	const oldDescriptions = new Set([
		'Peserta akan belajar memahami crypto dari peta industri, manajemen risiko, analisis pasar, prinsip syariah, hingga penyusunan portfolio jangka panjang yang lebih terarah.',
		'Peserta akan memahami crypto dari peta industri, manajemen risiko, analisis pasar, prinsip syariah, hingga penyusunan portfolio jangka panjang yang lebih terarah.'
	]);
	const oldCtaTitles = new Set(['Siap mengikuti alur belajar 4 hari ini?']);
	const oldCtaDescriptions = new Set([
		'Lihat detail benefit peserta atau konsultasikan kebutuhan belajar Anda sebelum mendaftar.'
	]);

	if (!curriculum.eyebrow?.trim() || oldEyebrows.has(curriculum.eyebrow.trim())) {
		curriculum.eyebrow = defaults.eyebrow;
	}
	if (!curriculum.title?.trim() || oldTitles.has(curriculum.title.trim())) {
		curriculum.title = defaults.title;
	}
	if (!curriculum.description?.trim() || oldDescriptions.has(curriculum.description.trim())) {
		curriculum.description = defaults.description;
	}
	curriculum.schedule = normalizeCurriculumSchedule(curriculum.schedule);
	curriculum.investmentSummary = normalizeInvestmentSummary(curriculum.investmentSummary);
	curriculum.topics = normalizeCurriculumTopics(curriculum.topics);
	curriculum.outcomes = normalizeStringList(curriculum.outcomes, defaults.outcomes);
	if (!curriculum.disclaimer?.trim()) curriculum.disclaimer = defaults.disclaimer;
	if (!curriculum.ctaTitle?.trim() || oldCtaTitles.has(curriculum.ctaTitle.trim())) {
		curriculum.ctaTitle = defaults.ctaTitle;
	}
	if (
		!curriculum.ctaDescription?.trim() ||
		oldCtaDescriptions.has(curriculum.ctaDescription.trim())
	) {
		curriculum.ctaDescription = defaults.ctaDescription;
	}
	curriculum.primaryCta = { ...defaults.primaryCta, ...(curriculum.primaryCta ?? {}) };
	curriculum.secondaryCta = { ...defaults.secondaryCta, ...(curriculum.secondaryCta ?? {}) };
	if ((curriculum.primaryCta.label ?? '').trim() === 'Daftar Bootcamp') {
		curriculum.primaryCta.label = defaults.primaryCta.label;
	}

	return curriculum;
}

function normalizeInvestmentSummary(
	summary: Partial<LandingContent['curriculum']['investmentSummary']> | undefined
): LandingContent['curriculum']['investmentSummary'] {
	const fallback = defaultLandingContent.curriculum.investmentSummary;
	const legacyValues = new Set(['Rp400k', 'Rp400.000']);
	const sessionPrice = summary?.sessionPrice?.trim() ?? '';

	return {
		sessionPrice:
			!sessionPrice || legacyValues.has(sessionPrice) ? fallback.sessionPrice : sessionPrice,
		packagePrice: summary?.packagePrice?.trim() || fallback.packagePrice,
		totalPrice: summary?.totalPrice?.trim() || fallback.totalPrice
	};
}

function normalizeCurriculumSchedule(schedule: unknown): CurriculumDay[] {
	const sourceDays = Array.isArray(schedule) ? schedule : [];
	if (sourceDays.length === 0 || isStaleCurriculumSchedule(sourceDays)) {
		return structuredClone(defaultLandingContent.curriculum.schedule);
	}

	return sourceDays.map((day, index) => normalizeCurriculumDay(day, index));
}

function isStaleCurriculumSchedule(schedule: unknown[]): boolean {
	const staleStages = new Set([
		'Foundation',
		'Market Analysis',
		'Technical & Sharia Screening',
		'Strategy & Portfolio'
	]);

	return schedule.some((value) => {
		if (!isRecord(value)) return true;
		const date = typeof value.date === 'string' ? value.date : '';
		const stage = typeof value.stage === 'string' ? value.stage : '';
		return /27 Juni|28 Juni/.test(date) || staleStages.has(stage);
	});
}

function normalizeCurriculumDay(dayValue: unknown, index: number): CurriculumDay {
	const fallback =
		defaultLandingContent.curriculum.schedule[index] ??
		defaultLandingContent.curriculum.schedule[0];
	const day = isRecord(dayValue) ? dayValue : {};
	const speakers = Array.isArray(day.sessionSpeakers) ? day.sessionSpeakers : [];
	const sessions = normalizeCurriculumSessions(day.sessions, fallback.sessions, speakers);
	const stage = typeof day.stage === 'string' ? day.stage.trim() : '';
	const date = typeof day.date === 'string' ? day.date.trim() : '';
	const time = typeof day.time === 'string' ? day.time.trim() : '';
	const description = typeof day.description === 'string' ? day.description.trim() : '';
	const packagePrice = typeof day.packagePrice === 'string' ? day.packagePrice.trim() : '';
	const outcome = typeof day.outcome === 'string' ? day.outcome : undefined;

	return {
		stage: stage || fallback.stage,
		date: date || fallback.date,
		time: time || fallback.time,
		description: description || fallback.description,
		sessions,
		packagePrice: packagePrice || fallback.packagePrice,
		outcome: normalizeCurriculumOutcome(outcome, fallback.outcome)
	};
}

function normalizeCurriculumOutcome(outcome: string | undefined, fallback: string): string {
	const oldCopy = new Map([
		[
			'Peserta mulai memahami dasar membaca chart dan prinsip menilai aset crypto dari perspektif syariah.',
			'Peserta memahami dasar membaca chart dan prinsip menilai aset crypto dari perspektif syariah.'
		]
	]);
	const value = outcome?.trim() ?? '';
	const normalized = oldCopy.get(value) ?? value;

	return normalized || fallback;
}

function normalizeCurriculumSessions(
	sessionsValue: unknown,
	fallback: CurriculumSession[],
	legacySpeakers: unknown[]
): CurriculumSession[] {
	const oldCopy = new Map([
		['Crypto Industry Map & Web3', 'Crypto & Web3 Industry Map'],
		['Peta Industri Crypto & Web3', 'Crypto & Web3 Industry Map'],
		['Financial Planning & Manajemen Risiko', 'Financial Planning & Risk Management'],
		['Fundamental & Narrative Analysis', 'Analisis Fundamental Crypto'],
		['Analisis Fundamental & Narasi Pasar', 'Analisis Fundamental Crypto'],
		['Global Macro Analysis', 'Analisis Makro Global'],
		['Technical Analysis (Session 1)', 'Fondasi & Pattern Grafik'],
		['Analisis Teknikal Dasar', 'Fondasi & Pattern Grafik'],
		['Technical Analysis (Session 2)', 'Indikator & Eksekusi Trading'],
		['Analisis Teknikal Lanjutan', 'Indikator & Eksekusi Trading'],
		['Sharia Coin Analysis', 'Screening Koin & Bedah Kasus'],
		['Analisis Coin Syariah', 'Screening Koin & Bedah Kasus']
	]);
	const sessions = Array.isArray(sessionsValue) ? sessionsValue : [];
	const normalized = sessions
		.map((session, sessionIndex): CurriculumSession | null => {
			const fallbackSession = fallback[sessionIndex] ?? fallback[0];
			if (typeof session === 'string') {
				const title = oldCopy.get(session.trim()) ?? session.trim();
				const legacySpeaker = legacySpeakers[sessionIndex];
				return title
					? {
							title,
							price: fallbackSession.price,
							topics: [...fallbackSession.topics],
							speaker:
								typeof legacySpeaker === 'string' && legacySpeaker.trim()
									? legacySpeaker.trim()
									: fallbackSession.speaker
						}
					: null;
			}
			if (!isRecord(session)) return null;

			const rawTitle = typeof session.title === 'string' ? session.title.trim() : '';
			const rawPrice = typeof session.price === 'string' ? session.price.trim() : '';
			const rawSpeaker = typeof session.speaker === 'string' ? session.speaker.trim() : '';
			return {
				title: (oldCopy.get(rawTitle) ?? rawTitle) || fallbackSession.title,
				price: /400k|400\.000/i.test(rawPrice)
					? fallbackSession.price
					: rawPrice || fallbackSession.price,
				topics: normalizeStringList(
					Array.isArray(session.topics)
						? session.topics.filter((topic): topic is string => typeof topic === 'string')
						: undefined,
					fallbackSession.topics
				),
				speaker: rawSpeaker || fallbackSession.speaker
			};
		})
		.filter((session): session is CurriculumSession => session !== null);

	return normalized.length > 0 ? normalized : structuredClone(fallback);
}

function normalizeCurriculumTopics(topics: string[] | undefined): string[] {
	const staleTopics = new Set([
		'Peta Industri Crypto & Web3',
		'Financial Planning & Manajemen Risiko',
		'Analisis Fundamental & Narasi Pasar',
		'Analisis Teknikal Dasar dan Lanjutan',
		'Analisis Coin Syariah',
		'Strategi Portfolio Jangka Panjang'
	]);
	if (topics?.some((topic) => staleTopics.has(topic.trim()))) {
		return structuredClone(defaultLandingContent.curriculum.topics);
	}

	const oldCopy = new Map([
		['Crypto Industry Map & Web3', 'Crypto & Web3 Industry Map'],
		['Peta Industri Crypto & Web3', 'Crypto & Web3 Industry Map'],
		['Financial Planning & Manajemen Risiko', 'Financial Planning & Risk Management'],
		['Fundamental & Narrative Analysis', 'Analisis Fundamental Crypto'],
		['Analisis Fundamental & Narasi Pasar', 'Analisis Fundamental Crypto'],
		['Global Macro Analysis', 'Analisis Makro Global'],
		['Technical Analysis', 'Fondasi & Pattern Grafik'],
		['Analisis Teknikal Dasar dan Lanjutan', 'Fondasi & Pattern Grafik'],
		['Sharia Coin Analysis', 'Screening Koin & Bedah Kasus'],
		['Analisis Coin Syariah', 'Screening Koin & Bedah Kasus']
	]);
	const values = Array.isArray(topics)
		? topics
				.map((topic) => oldCopy.get(topic.trim()) ?? topic.trim())
				.filter((topic) => topic.length > 0)
		: [];

	return values.length > 0 ? values : [...defaultLandingContent.curriculum.topics];
}

function normalizeStringList(values: string[] | undefined, fallback: string[]): string[] {
	const cleaned = Array.isArray(values)
		? values.map((value) => value.trim()).filter((value) => value.length > 0)
		: [];

	return cleaned.length > 0 ? cleaned : [...fallback];
}

function normalizePricingPackages(
	packages: PricingPackage[] | undefined,
	fallback: PricingPackage[]
): PricingPackage[] {
	const values = Array.isArray(packages) ? packages : [];
	const normalized = values
		.map((pkg, index) => {
			const defaultPackage = fallback[index] ?? fallback[0];
			return {
				code: pkg.code?.trim() || defaultPackage.code,
				title: pkg.title?.trim() || defaultPackage.title,
				description: pkg.description?.trim() || defaultPackage.description,
				image: pkg.image?.trim() || defaultPackage.image,
				lessons: normalizeStringList(pkg.lessons, defaultPackage.lessons),
				price: pkg.price?.trim() || defaultPackage.price,
				sessionPrice: pkg.sessionPrice?.trim() || defaultPackage.sessionPrice,
				ctaMessage: pkg.ctaMessage?.trim() || defaultPackage.ctaMessage
			};
		})
		.filter((pkg) => pkg.code && pkg.title);

	return normalized.length > 0 ? normalized : structuredClone(fallback);
}

function normalizeInstructors(
	instructors: LandingContent['instructors']
): LandingContent['instructors'] {
	const defaults = defaultLandingContent.instructors;
	const oldTitle = 'Pemateri Bootcamp';
	const oldDescriptions = new Set([
		'Belajar bersama tiga pemateri utama dari perspektif investasi crypto, financial planning, dan fiqih muamalah.',
		'Crypto syariah tidak cukup dipahami hanya dari sisi peluang aset digital. Di bootcamp ini, peserta akan memahami industri crypto, strategi keuangan, dan prinsip fiqih muamalah dari pemateri dengan kredensial yang relevan di bidangnya.'
	]);
	const oldCtaTitle = 'Siap belajar crypto syariah dari tiga perspektif utama?';
	const oldCtaDescriptions = new Set([
		'Lihat kurikulum bootcamp atau konsultasikan kebutuhan belajar Anda melalui WhatsApp.'
	]);
	const oldClosing =
		'Dengan kombinasi tiga perspektif ini, peserta tidak hanya belajar melihat peluang crypto, tetapi juga memahami risiko dan batasan syariahnya secara lebih matang.';

	if (!instructors.eyebrow?.trim()) instructors.eyebrow = defaults.eyebrow;
	if (!instructors.title?.trim() || instructors.title.trim() === oldTitle) {
		instructors.title = defaults.title;
	}
	if (!instructors.description?.trim() || oldDescriptions.has(instructors.description.trim())) {
		instructors.description = defaults.description;
	}
	if (!instructors.closing?.trim() || instructors.closing.trim() === oldClosing)
		instructors.closing = defaults.closing;
	if (!instructors.ctaTitle?.trim() || instructors.ctaTitle.trim() === oldCtaTitle) {
		instructors.ctaTitle = defaults.ctaTitle;
	}
	if (
		!instructors.ctaDescription?.trim() ||
		oldCtaDescriptions.has(instructors.ctaDescription.trim())
	) {
		instructors.ctaDescription = defaults.ctaDescription;
	}
	instructors.primaryCta = { ...defaults.primaryCta, ...(instructors.primaryCta ?? {}) };
	instructors.secondaryCta = { ...defaults.secondaryCta, ...(instructors.secondaryCta ?? {}) };
	if ((instructors.primaryCta.label ?? '').trim() === 'Lihat Kurikulum Bootcamp') {
		instructors.primaryCta.label = defaults.primaryCta.label;
	}
	if ((instructors.secondaryCta.label ?? '').trim() === 'Konsultasi via WhatsApp') {
		instructors.secondaryCta.label = defaults.secondaryCta.label;
	}

	const sourceItems = Array.isArray(instructors.items) ? instructors.items : [];
	instructors.items = sourceItems.map((item, index) => normalizeInstructor(item, index));

	return instructors;
}

function normalizeInstructor(item: Partial<Instructor>, index: number): Instructor {
	const defaults = defaultLandingContent.instructors.items;
	const fallback = findInstructorFallback(item, index);
	const rawName = item.name?.trim() ?? '';
	const knownDefaultName = defaults.some((instructor) =>
		rawName.toLowerCase().includes(instructor.name.toLowerCase())
	);

	return {
		badge: item.badge?.trim() || fallback.badge,
		name: knownDefaultName || !rawName ? fallback.name : rawName,
		credentials: item.credentials?.trim() || fallback.credentials,
		role: item.role?.trim() || fallback.role,
		highlights: normalizeInstructorHighlights(item.highlights, fallback),
		description: normalizeInstructorDescription(item.description, fallback),
		photo: item.photo?.trim() || fallback.photo
	};
}

function normalizeInstructorHighlights(
	highlights: string[] | undefined,
	fallback: Instructor
): string[] {
	const values = Array.isArray(highlights)
		? highlights.map((highlight) => highlight.trim()).filter((highlight) => highlight.length > 0)
		: [];
	const oldHighlightText = new Set([
		'CSA dan CTA di bidang analisis pasar dan investasi',
		'Berpengalaman dalam financial planning, risk management, fundamental analysis, narrative analysis, dan global macro analysis',
		'CFP, sertifikasi profesional di bidang perencanaan keuangan',
		'CSA dan CTA di bidang analisis pasar',
		'Berpengalaman dalam financial planning, risk management, dan macro analysis'
	]);

	if (values.length === 0 || values.some((highlight) => oldHighlightText.has(highlight))) {
		return [...fallback.highlights];
	}

	return values;
}

function normalizeInstructorDescription(
	description: string | undefined,
	fallback: Instructor
): string {
	const value = normalizeBakuCopy(description?.trim() ?? '');
	const oldDescriptions = new Set([
		'Membawakan perspektif industri crypto, Web3, analisis koin syariah, dan strategi investasi yang sesuai prinsip syariah.',
		'Membawakan financial planning, risk management, fundamental analysis, narrative analysis, dan global macro analysis.',
		'Membantu peserta mengelola risiko, membaca fundamental aset, mengenali narasi pasar, dan melihat pengaruh kondisi makro global terhadap keputusan investasi.',
		'Membantu peserta memahami cara mengelola risiko, membaca fundamental aset, mengenali narasi pasar, dan melihat pengaruh kondisi makro global terhadap keputusan investasi.',
		'Membawakan perspektif fiqih muamalah untuk membantu peserta memahami batasan dan prinsip syariah dalam aset crypto.'
	]);

	return !value || oldDescriptions.has(value) ? fallback.description : value;
}

function findInstructorFallback(item: Partial<Instructor>, index: number): Instructor {
	const defaultItems = defaultLandingContent.instructors.items;
	const rawName = item.name?.toLowerCase() ?? '';
	const match = defaultItems.find((instructor) => {
		const firstName = instructor.name.split(' ')[0].toLowerCase();
		return rawName.includes(firstName);
	});

	return match ?? defaultItems[index] ?? defaultItems[0];
}

function normalizePricing(pricing: LandingContent['pricing']): LandingContent['pricing'] {
	const defaults = defaultLandingContent.pricing;
	const oldTitles = new Set([
		'Gabung Programnya Sekarang',
		'Biaya Program Crypto Sharia Masterclass',
		'Gabung Crypto Sharia Masterclass 2026'
	]);

	const oldDescriptions = new Set([
		'Bootcamp berlangsung 4 hari pada 27-28 Juni 2026 dan 4-5 Juli 2026 dengan dua sesi materi di setiap hari belajar.',
		'Program ini akan dilaksanakan pada tanggal 27 Juni - 5 Juli 2026'
	]);
	const hasStalePackages = pricing.packages?.some((pkg) => {
		return (
			/400k|400\.000/i.test(pkg.sessionPrice ?? '') ||
			['Fundamental', 'Market Analysis', 'Technical Analysis', 'Sharia Coin Screening'].includes(
				pkg.title?.trim() ?? ''
			)
		);
	});

	const firstValueStack = pricing.programIncludes?.length
		? pricing.programIncludes
		: (pricing.benefitCards?.[0]?.items ?? []);

	const hasOldValueStack = firstValueStack.some((item) =>
		[
			'Materi terstruktur & tugas praktik',
			'Akses komunitas eksklusif',
			'Tugas praktik & evaluasi akhir',
			'Mentoring & networking komunitas'
		].includes(item.trim())
	);
	const incompleteValueStack =
		firstValueStack.length < defaultLandingContent.pricing.programIncludes.length ||
		!firstValueStack.includes('4 hari live masterclass') ||
		!firstValueStack.includes('Sertifikat kelulusan');

	if (!pricing.title?.trim() || oldTitles.has(pricing.title.trim())) {
		pricing.title = defaults.title;
	}
	if (!pricing.description?.trim() || oldDescriptions.has(pricing.description.trim())) {
		pricing.description = defaults.description;
	}
	if (!pricing.dateCard) {
		pricing.dateCard = defaults.dateCard;
	} else {
		if (
			pricing.dateCard.label === 'Tanggal Program' ||
			/27 Juni|28 Juni/.test(pricing.dateCard.date ?? '')
		) {
			pricing.dateCard = structuredClone(defaults.dateCard);
		} else if (!pricing.dateCard.time) {
			pricing.dateCard.time = defaults.dateCard.time;
		}
	}
	if (!pricing.priceBadge?.trim() || pricing.priceBadge === 'PROMO 10 PESERTA AWAL') {
		pricing.priceBadge = defaults.priceBadge;
	}
	if (!pricing.originalPrice?.trim() || pricing.originalPrice === 'Rp5.000.000') {
		pricing.originalPrice = defaults.originalPrice;
	}
	if (!pricing.price?.trim()) pricing.price = defaults.price;
	if (
		!pricing.note?.trim() ||
		pricing.note.includes('10 peserta awal') ||
		pricing.note.includes('Kuota mentoring dibatasi')
	) {
		pricing.note = defaults.note;
	}
	if (!pricing.ctaLabel?.trim()) pricing.ctaLabel = defaults.ctaLabel;
	pricing.packages = hasStalePackages
		? structuredClone(defaults.packages)
		: normalizePricingPackages(pricing.packages, defaults.packages);
	pricing.packageBenefits = normalizeStringList(pricing.packageBenefits, defaults.packageBenefits);

	pricing.programIncludes =
		firstValueStack.length > 0 && !hasOldValueStack && !incompleteValueStack
			? firstValueStack
			: defaults.programIncludes;

	delete pricing.benefitCards;

	return pricing;
}

function normalizeFaq(faq: LandingContent['faq']): LandingContent['faq'] {
	const defaults = defaultLandingContent.faq;
	const oldDefaultQuestions = new Set([
		'Apakah program ini cocok untuk pemula?',
		'Bagaimana jika tidak bisa hadir di salah satu sesi?',
		'Apa yang membedakan program ini dengan masterclass lain?'
	]);
	const hasOldDuplicateQuestion = faq.items?.some(
		(item) => item.question === 'Apakah bootcamp ini berisi rekomendasi beli coin tertentu?'
	);

	if (!faq.title?.trim()) faq.title = defaults.title;
	if (
		!Array.isArray(faq.items) ||
		faq.items.length === 0 ||
		hasOldDuplicateQuestion ||
		(faq.items.length <= 3 && faq.items.every((item) => oldDefaultQuestions.has(item.question)))
	) {
		faq.items = defaults.items;
	}

	return faq;
}

function normalizeFinalCta(finalCta: LandingContent['finalCta']): LandingContent['finalCta'] {
	const defaults = defaultLandingContent.finalCta;
	const oldTitles = new Set([
		'Ilmu Dulu. Cuan Kemudian. Berkah Selamanya.',
		'Ilmu Dulu. Strategi Kemudian. Berkah Selamanya.',
		'Belajar Dulu. Kelola Risiko. Jaga Prinsip Syariah.'
	]);

	if (!finalCta.title?.trim() || oldTitles.has(finalCta.title.trim())) {
		finalCta.title = defaults.title;
	}
	if (!finalCta.description?.trim()) finalCta.description = defaults.description;
	if (!finalCta.ctaLabel?.trim()) finalCta.ctaLabel = defaults.ctaLabel;

	return finalCta;
}

function normalizeTestimonials(
	testimonials: LandingContent['testimonials'] | undefined
): LandingContent['testimonials'] {
	const defaults = defaultLandingContent.testimonials;
	if (!testimonials) return structuredClone(defaults);

	if (!testimonials.title?.trim()) testimonials.title = defaults.title;

	const oldDescriptions = new Set([
		'Placeholder untuk screenshot testimoni Discord, ucapan terima kasih, dokumentasi profit member, dan sharing pengalaman belajar.'
	]);
	if (!testimonials?.description?.trim() || oldDescriptions.has(testimonials.description.trim())) {
		testimonials.description = defaults.description;
	}

	// Detect old/stale testimonial data from Firestore and replace with new defaults
	const oldMetas = new Set([
		'Discord Community',
		'Member feedback',
		'Portfolio story',
		'Arief Adjie, Web Developer'
	]);
	const oldTitles = new Set([
		'Alhamdulillah portofilio BTC sudah +12,5%.',
		'Komunitas yang bergerak berdasarkan landasan ilmu.',
		'Jadi pede investasi ke Crypto karena sesuai Syariat.'
	]);
	const hasStaleItems =
		!Array.isArray(testimonials.items) ||
		testimonials.items.length === 0 ||
		testimonials.items.some((i) => oldMetas.has(i.meta) || oldTitles.has(i.title));

	if (hasStaleItems) {
		testimonials.items = defaults.items;
	}

	return testimonials;
}

function normalizeLayout(layout: LayoutEntry[]): LayoutEntry[] {
	const defaultEntries = defaultLandingContent.layout;
	const defaultIds = new Set(defaultEntries.map((entry) => entry.id));
	const seen = new Set<SectionId>();
	const normalized: LayoutEntry[] = [];

	for (const entry of Array.isArray(layout) ? layout : []) {
		if (!entry || typeof entry.id !== 'string') continue;
		const id = entry.id as SectionId;
		if (!defaultIds.has(id) || seen.has(id)) continue;
		const forceVisible: Set<SectionId> = new Set(['testimonials', 'authority', 'usp']);
		let vis = entry.visible !== false;
		if (forceVisible.has(id)) vis = true;
		normalized.push({ id, visible: vis });
		seen.add(id);
	}

	defaultEntries.forEach((entry, defaultIndex) => {
		if (seen.has(entry.id)) return;
		const insertAt = findDefaultInsertIndex(normalized, defaultEntries, defaultIndex);
		normalized.splice(insertAt, 0, { ...entry });
		seen.add(entry.id);
	});

	// Force testimonials to be positioned right before 'usp'
	const testimonialsIdx = normalized.findIndex((e) => e.id === 'testimonials');
	const uspIdx = normalized.findIndex((e) => e.id === 'usp');
	if (testimonialsIdx !== -1 && uspIdx !== -1 && testimonialsIdx > uspIdx) {
		const [entry] = normalized.splice(testimonialsIdx, 1);
		const newUspIdx = normalized.findIndex((e) => e.id === 'usp');
		normalized.splice(newUspIdx, 0, entry);
	}

	const result = reorderLayoutForConversion(normalized, defaultEntries);

	// Final pass: force visibility regardless of stored or reordered state
	const forceVisibleFinal: Set<SectionId> = new Set(['testimonials', 'authority', 'usp']);
	for (const entry of result) {
		if (forceVisibleFinal.has(entry.id)) entry.visible = true;
	}

	return result;
}

function reorderLayoutForConversion(
	layout: LayoutEntry[],
	defaultEntries: LayoutEntry[]
): LayoutEntry[] {
	if (!shouldUseConversionOrder(layout)) return layout;

	const visibility = new Map(layout.map((entry) => [entry.id, entry.visible]));
	const useDefaultVisibility = new Set<SectionId>(['valueProps']);
	const forceVisible: Set<SectionId> = new Set(['testimonials', 'authority', 'usp']);
	return defaultEntries.map((entry) => {
		let vis = useDefaultVisibility.has(entry.id)
			? entry.visible
			: (visibility.get(entry.id) ?? entry.visible);
		if (forceVisible.has(entry.id)) vis = true;
		return { id: entry.id, visible: vis };
	});
}

function shouldUseConversionOrder(layout: LayoutEntry[]): boolean {
	const order = layout.map((entry) => entry.id);
	const legacyOrders: SectionId[][] = [
		[
			'hero',
			'authority',
			'testimonials',
			'usp',
			'valueProps',
			'instructors',
			'curriculum',
			'pricing',
			'urgency',
			'faq',
			'finalCta'
		],
		[
			'hero',
			'authority',
			'usp',
			'valueProps',
			'instructors',
			'curriculum',
			'pricing',
			'urgency',
			'faq',
			'finalCta',
			'testimonials'
		]
	];

	return legacyOrders.some((legacyOrder) => isSameSectionOrder(order, legacyOrder));
}

function isSameSectionOrder(order: SectionId[], expected: SectionId[]): boolean {
	return order.length === expected.length && order.every((id, index) => id === expected[index]);
}

function findDefaultInsertIndex(
	layout: LayoutEntry[],
	defaultEntries: LayoutEntry[],
	defaultIndex: number
): number {
	const previousIds = new Set(defaultEntries.slice(0, defaultIndex).map((entry) => entry.id));
	for (let i = layout.length - 1; i >= 0; i -= 1) {
		if (previousIds.has(layout[i].id)) return i + 1;
	}

	const nextIds = new Set(defaultEntries.slice(defaultIndex + 1).map((entry) => entry.id));
	const nextIndex = layout.findIndex((entry) => nextIds.has(entry.id));
	return nextIndex === -1 ? layout.length : nextIndex;
}

/** One-shot fetch (used as initial load fallback). */
export async function fetchLandingContent(): Promise<LandingContent> {
	try {
		const snap = await getDoc(CONTENT_REF());
		return mergeContent(snap.exists() ? (snap.data() as Partial<LandingContent>) : null);
	} catch (e) {
		console.error('Failed to fetch landing content:', e);
		return structuredClone(defaultLandingContent);
	}
}

/** Live subscription. Returns an unsubscribe function. */
export function subscribeLandingContent(cb: (content: LandingContent) => void): () => void {
	return onSnapshot(
		CONTENT_REF(),
		(snap) => {
			cb(mergeContent(snap.exists() ? (snap.data() as Partial<LandingContent>) : null));
		},
		(err) => {
			console.error('Landing content subscription error:', err);
			cb(structuredClone(defaultLandingContent));
		}
	);
}

/** Persist the full content document (admin only). */
export async function saveLandingContent(content: LandingContent): Promise<void> {
	await setDoc(CONTENT_REF(), { ...content, updatedAt: serverTimestamp() }, { merge: false });
}

// ---------------------------------------------------------------------------
// Editor helpers — used by the admin UI to show status/completeness badges.
// ---------------------------------------------------------------------------

function allFilled(values: (string | undefined)[]): boolean {
	return values.every((v) => typeof v === 'string' && v.trim().length > 0);
}

/**
 * Returns the completeness of a section as filled/total field counts.
 * "Filled" means a non-empty string for the section's key text fields.
 */
export function sectionCompleteness(
	content: LandingContent,
	id: SectionId
): { filled: number; total: number } {
	switch (id) {
		case 'hero': {
			const c = content.hero;
			const fields = [c.badge, c.subtitle, c.description, c.primaryCtaLabel];
			const arr = c.highlights.map((h) => (allFilled([h.symbol, h.performance]) ? 'x' : ''));
			return countFields([...fields, c.highlights.length ? arr.join('') : '']);
		}
		case 'authority': {
			const c = content.authority;
			return countFields([
				c.title,
				c.description,
				c.activities.length ? 'x' : '',
				c.cards.length ? 'x' : ''
			]);
		}
		case 'valueProps': {
			const c = content.valueProps;
			return countFields([c.title, c.items.length ? 'x' : '', c.docTitle]);
		}
		case 'testimonials': {
			const c = content.testimonials;
			return countFields([c.title, c.description, c.items.length ? 'x' : '']);
		}
		case 'usp': {
			const c = content.usp;
			return countFields([c.title, c.description, c.quote, c.quoteNote, c.items.length ? 'x' : '']);
		}
		case 'pricing': {
			const c = content.pricing;
			return countFields([
				c.title,
				c.price,
				c.ctaLabel,
				c.packages.length ? 'x' : '',
				c.packageBenefits.length ? 'x' : '',
				c.programIncludes.length ? 'x' : '',
				c.dateCard?.date
			]);
		}
		case 'curriculum': {
			const c = content.curriculum;
			return countFields([
				c.title,
				c.description,
				c.schedule.length ? 'x' : '',
				c.outcomes.length ? 'x' : '',
				c.disclaimer,
				c.ctaTitle,
				c.primaryCta.label
			]);
		}
		case 'instructors': {
			const c = content.instructors;
			const arr = c.items.map((i) =>
				allFilled([i.badge, i.name, i.credentials, i.role, i.description, i.photo]) &&
				i.highlights.length > 0
					? 'x'
					: ''
			);
			return countFields([
				c.title,
				c.description,
				c.closing,
				c.ctaTitle,
				c.ctaDescription,
				c.primaryCta.label,
				c.items.length ? arr.join('') : ''
			]);
		}
		case 'urgency': {
			const c = content.urgency;
			return countFields([c.title, c.description, c.ctaLabel]);
		}
		case 'faq': {
			const c = content.faq;
			return countFields([c.title, c.items.length ? 'x' : '']);
		}
		case 'finalCta': {
			const c = content.finalCta;
			return countFields([c.title, c.description, c.ctaLabel]);
		}
	}
}

function countFields(values: string[]): { filled: number; total: number } {
	return {
		filled: values.filter((v) => typeof v === 'string' && v.trim().length > 0).length,
		total: values.length
	};
}

/** SEO completeness as a 0-100 percentage based on title + description quality. */
export function seoCompleteness(content: LandingContent): number {
	let score = 0;
	const title = content.seo.title?.trim() ?? '';
	const desc = content.seo.description?.trim() ?? '';
	if (title.length > 0) score += 25;
	if (title.length >= 30 && title.length <= 65) score += 25;
	if (desc.length > 0) score += 25;
	if (desc.length >= 80 && desc.length <= 160) score += 25;
	return score;
}
