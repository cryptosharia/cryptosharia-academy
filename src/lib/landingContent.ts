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
export type ProofItem = { meta: string; title: string; description: string };
export type Activity = { meta: string; title: string; description: string; image: string };
export type Faq = { question: string; answer: string };
export type Cta = { label: string; href: string };
export type BenefitCard = { title: string; items: string[] };
export type LayoutEntry = { id: SectionId; visible: boolean };
export type CurriculumDay = {
	stage: string;
	date: string;
	sessions: string[];
	sessionSpeakers: string[];
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
		benefitCards: BenefitCard[];
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
		{ id: 'authority', visible: true },
		{ id: 'usp', visible: true },
		{ id: 'valueProps', visible: true },
		{ id: 'curriculum', visible: true },
		{ id: 'instructors', visible: true },
		{ id: 'pricing', visible: true },
		{ id: 'urgency', visible: true },
		{ id: 'faq', visible: true },
		{ id: 'finalCta', visible: true },
		{ id: 'testimonials', visible: true }
	],
	whatsapp: {
		phone: '6281234567890',
		message: 'Assalamualaikum CryptoSharia, saya mau daftar Crypto Sharia Masterclass.'
	},
	seo: {
		title: 'Crypto Sharia Masterclass Learning | Bootcamp Crypto Syariah 4 Hari',
		description:
			'Bootcamp crypto syariah 4 hari bersama founder Crypto Sharia, founder Qualifin, dan pakar fiqih muamalah untuk belajar market, risk, technical, dan portofolio.'
	},
	hero: {
		badge: 'Crypto Sharia Masterclass Learning',
		title: '',
		subtitle:
			'Bootcamp intensif 4 hari untuk memahami industri crypto, manajemen risiko, analisis market, screening syariah, dan portfolio building.',
		description:
			'Belajar langsung bersama founder Crypto Sharia, founder Qualifin, dan pakar fiqih muamalah dengan pendekatan sistematis, praktis, dan sesuai prinsip syariah.',
		primaryCtaLabel: 'Join Now / Gabung Sekarang',
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
			'Program ini menggabungkan pengalaman praktisi, standar sertifikasi, dan proses belajar komunitas agar peserta memahami crypto secara sistematis, bukan sekadar mengikuti hype.',
		activities: [
			{
				meta: '',
				title: 'QnA Session',
				description:
					'Forum tanya jawab rutin untuk membahas market, portofolio, dan fiqih muamalah.',
				image: ''
			},
			{
				meta: '',
				title: 'Nushafest',
				description:
					'Dokumentasi edukasi publik bersama komunitas yang tertarik pada aset digital halal.',
				image: ''
			},
			{
				meta: '',
				title: 'Halal Kulture Market',
				description: 'Aktivasi edukasi crypto syariah untuk memperluas literasi investor Muslim.',
				image: ''
			},
			{
				meta: '',
				title: 'Gathering Komunitas',
				description: 'Diskusi kecil dan networking antar member untuk memperkuat proses belajar.',
				image: ''
			}
		],
		cards: [
			{
				label: 'Analisis Market',
				description: 'Placeholder screenshot hasil analisis market dan thesis aset pilihan.'
			},
			{
				label: 'Pencapaian Member',
				description: 'Placeholder dokumentasi pencapaian dan progres portofolio member.'
			},
			{
				label: 'Discord Community',
				description:
					'Placeholder testimoni profit, ucapan terima kasih, dan sharing pengalaman belajar.'
			}
		]
	},
	valueProps: {
		eyebrow: '',
		title: 'Apa yang Akan Dipelajari?',
		items: [
			{
				label: '',
				title: 'Strategi Investasi Crypto Sesuai Prinsip Syariah',
				description: 'Memahami strategi investasi crypto yang terukur dan sesuai prinsip syariah.'
			},
			{
				label: '',
				title: 'Membangun Wealth Plan yang Lebih Terarah',
				description:
					'Membangun aset dan kekayaan jangka panjang dengan pendekatan yang sehat dan berkelanjutan.'
			},
			{
				label: '',
				title: 'Strategi Bertahan di Market Volatil',
				description: 'Belajar menjaga portofolio dan mengambil peluang saat market sedang turun.'
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
			'Placeholder untuk screenshot testimoni Discord, ucapan terima kasih, dokumentasi profit member, dan sharing pengalaman belajar.',
		items: [
			{
				meta: '',
				title: 'Thanks to you my mentor!',
				description:
					'Member membagikan hasil belajar, eksekusi strategi spot, dan progres portofolio di Discord Premium.'
			},
			{
				meta: '',
				title: 'Akhirnya lebih paham cara analisis market tanpa gambling.',
				description:
					'Pendekatan riset, manajemen risiko, dan screening syariah membantu member lebih disiplin.'
			},
			{
				meta: '',
				title: 'Profit tanpa leverage, tetap pakai rencana.',
				description:
					'Dokumentasi hasil member ditampilkan sebagai studi kasus edukasi, bukan janji keuntungan.'
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
				title: 'Tugas Praktik Langsung',
				description:
					'Setiap materi dilengkapi penugasan agar peserta langsung mempraktikkan ilmu yang dipelajari.'
			},
			{
				label: '',
				title: 'Sertifikat Kelulusan',
				description:
					'Peserta mendapatkan sertifikat setelah menyelesaikan evaluasi akhir sebagai bukti kompetensi.'
			},
			{
				label: '',
				title: 'FGD & Mentoring',
				description:
					'Diskusi kelompok kecil bersama mentor untuk membantu peserta memahami materi secara lebih personal.'
			},
			{
				label: '',
				title: 'Sharia Compliant',
				description: 'Belajar fiqih muamalah dan metode analisis crypto sesuai prinsip syariah.'
			},
			{
				label: '',
				title: 'Komunitas Global',
				description: 'Akses networking bersama member dari berbagai industri dan profesi.'
			},
			{
				label: '',
				title: 'Materi Terstruktur',
				description:
					'Alur belajar disusun bertahap dari dasar industri crypto, analisis pasar, prinsip syariah, hingga strategi portfolio.'
			}
		]
	},
	pricing: {
		eyebrow: '',
		title: 'Gabung Crypto Sharia Masterclass 2026',
		description:
			'Bootcamp berlangsung 4 hari pada 27-28 Juni 2026 dan 4-5 Juli 2026 dengan dua sesi materi di setiap hari belajar.',
		benefitCards: [
			{
				title: 'Jadwal Bootcamp',
				items: [
					'Sabtu, 27 Juni 2026',
					'Minggu, 28 Juni 2026',
					'Sabtu, 4 Juli 2026',
					'Minggu, 5 Juli 2026'
				]
			},
			{
				title: 'Format Belajar',
				items: [
					'2 sesi materi per hari',
					'Kelas terstruktur bersama praktisi',
					'FGD kecil untuk pendampingan intensif'
				]
			}
		],
		priceBadge: '',
		originalPrice: 'Rp3.000.000',
		price: 'Rp2.000.000',
		note: 'Harga promo untuk peserta awal dengan kuota mentoring terbatas.',
		ctaLabel: 'Gabung Sekarang'
	},
	curriculum: {
		eyebrow: '',
		title: 'Kurikulum 4 Hari: Dari Dasar Crypto hingga Portfolio Syariah',
		description:
			'Peserta akan memahami crypto dari peta industri, manajemen risiko, analisis pasar, prinsip syariah, hingga penyusunan portfolio jangka panjang yang lebih terarah.',
		schedule: [
			{
				stage: 'Foundation',
				date: 'Sabtu, 27 Juni 2026',
				sessions: ['Peta Industri Crypto & Web3', 'Financial Planning & Manajemen Risiko'],
				sessionSpeakers: ['Sholahuddin Al Ayyubi', 'Muhammad Ghithrif Gustomo Putra'],
				outcome:
					'Peserta memahami gambaran besar industri crypto serta cara mengelola risiko sebelum mengambil keputusan investasi.'
			},
			{
				stage: 'Market Analysis',
				date: 'Minggu, 28 Juni 2026',
				sessions: ['Analisis Fundamental & Narasi Pasar', 'Analisis Makro Global'],
				sessionSpeakers: ['Muhammad Ghithrif Gustomo Putra', 'Muhammad Ghithrif Gustomo Putra'],
				outcome:
					'Peserta belajar membaca kualitas aset, narasi pasar, dan pengaruh kondisi makro terhadap pergerakan crypto.'
			},
			{
				stage: 'Technical & Sharia Screening',
				date: 'Sabtu, 4 Juli 2026',
				sessions: ['Analisis Teknikal Dasar', 'Analisis Coin Syariah'],
				sessionSpeakers: ['Muhammad Ghithrif Gustomo Putra', 'Devin Halim'],
				outcome:
					'Peserta memahami dasar membaca chart dan prinsip menilai aset crypto dari perspektif syariah.'
			},
			{
				stage: 'Strategy & Portfolio',
				date: 'Minggu, 5 Juli 2026',
				sessions: ['Analisis Teknikal Lanjutan', 'Strategi Portfolio Jangka Panjang'],
				sessionSpeakers: ['Muhammad Ghithrif Gustomo Putra', 'Sholahuddin Al Ayyubi'],
				outcome:
					'Peserta belajar menyusun strategi portfolio crypto dengan pendekatan jangka panjang dan manajemen risiko.'
			}
		],
		topics: [
			'Peta Industri Crypto & Web3',
			'Financial Planning & Manajemen Risiko',
			'Analisis Fundamental & Narasi Pasar',
			'Analisis Makro Global',
			'Analisis Teknikal Dasar dan Lanjutan',
			'Analisis Coin Syariah',
			'Strategi Portfolio Jangka Panjang'
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
		closing:
			'Dengan kombinasi tiga perspektif ini, peserta tidak hanya belajar melihat peluang crypto, tetapi juga memahami risiko dan batasan syariahnya secara lebih matang.',
		ctaTitle: 'Siap memahami crypto syariah secara lebih utuh?',
		ctaDescription:
			'Belajar dari tiga perspektif: industri crypto, strategi keuangan, dan prinsip fiqih muamalah.',
		primaryCta: { label: 'Lihat Kurikulum', href: '#curriculum' },
		secondaryCta: { label: 'Diskusi via WhatsApp', href: '' },
		items: [
			{
				badge: 'Crypto Syariah & Wealth Planning',
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
				badge: 'Investment & Financial Planning',
				name: 'Muhammad Ghithrif Gustomo Putra',
				credentials: 'S.E. · CFA · CFP · CSA · CTA',
				role: 'Founder of Qualifin',
				highlights: [
					'CFA, kredensial global bergengsi di bidang investasi dan keuangan',
					'CFP, sertifikasi profesional perencanaan keuangan',
					'CSA & CTA di bidang analisis pasar',
					'Berpengalaman dalam risk management, fundamental analysis, dan macro analysis'
				],
				description:
					'Membantu peserta memahami cara membaca risiko, fundamental aset, narasi pasar, dan pengaruh kondisi makro terhadap keputusan investasi.',
				photo: '/instructors/muhammad-ghithrif.jpeg'
			},
			{
				badge: 'Fiqih Muamalah & Islamic Finance',
				name: 'Devin Halim',
				credentials: 'AAOIFI · DPS MUI',
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
		title: 'Special Price for 10 Pax Only',
		description: 'Kuota terbatas untuk menjaga kualitas mentoring dan diskusi tetap optimal.',
		ctaLabel: 'Daftar Sekarang'
	},
	faq: {
		eyebrow: '',
		title: 'Pertanyaan yang Sering Diajukan',
		items: [
			{
				question: 'Apakah program ini cocok untuk pemula?',
				answer:
					'Ya. Materi disusun dari dasar hingga advanced sehingga dapat diikuti oleh pemula maupun yang sudah berpengalaman.'
			},
			{
				question: 'Apakah bootcamp ini berisi rekomendasi beli coin tertentu?',
				answer:
					'Tidak. Program ini bersifat edukasi untuk membantu peserta memahami analisis, risiko, dan prinsip syariah. Keputusan investasi tetap menjadi tanggung jawab masing-masing peserta.'
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
				question: 'Apa yang membedakan program ini dengan masterclass lain?',
				answer:
					'Program ini menggabungkan edukasi investasi crypto, manajemen risiko, komunitas, mentoring, serta pendekatan syariah secara komprehensif.'
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

	const merge = (target: any, source: any) => {
		for (const key of Object.keys(source)) {
			const value = source[key];
			if (value === undefined || value === null) continue;
			if (Array.isArray(value)) {
				target[key] = value;
			} else if (typeof value === 'object') {
				target[key] = merge(target[key] ?? {}, value);
			} else {
				target[key] = value;
			}
		}
		return target;
	};

	return normalizeContent(merge(base, stored));
}

function normalizeContent(content: LandingContent): LandingContent {
	content.layout = normalizeLayout(content.layout);
	content.valueProps = normalizeValueProps(content.valueProps);
	content.usp = normalizeUsp(content.usp);
	content.curriculum = normalizeCurriculum(content.curriculum);
	content.instructors = normalizeInstructors(content.instructors);
	content.pricing = normalizePricing(content.pricing);
	content.faq = normalizeFaq(content.faq);
	content.finalCta = normalizeFinalCta(content.finalCta);
	return content;
}

function normalizeValueProps(
	valueProps: LandingContent['valueProps']
): LandingContent['valueProps'] {
	const defaults = defaultLandingContent.valueProps;
	const oldTitles = new Map([
		['Strategi Cuan Halal di Crypto', 'Strategi Investasi Crypto Sesuai Prinsip Syariah'],
		['Build Your Sharia Wealth', 'Membangun Wealth Plan yang Lebih Terarah'],
		['Strategi Bertahan di Bear Market', 'Strategi Bertahan di Market Volatil']
	]);

	if (!valueProps.title?.trim()) valueProps.title = defaults.title;
	valueProps.items = normalizeFeatures(valueProps.items, defaults.items, oldTitles);
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

	return normalized;
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
		'Peserta akan belajar memahami crypto dari peta industri, manajemen risiko, analisis pasar, prinsip syariah, hingga penyusunan portfolio jangka panjang yang lebih terarah.'
	]);
	const oldCtaTitles = new Set(['Siap mengikuti alur belajar 4 hari ini?']);
	const oldCtaDescriptions = new Set([
		'Lihat detail benefit peserta atau konsultasikan kebutuhan belajar Anda sebelum mendaftar.'
	]);

	if (oldEyebrows.has(curriculum.eyebrow?.trim() ?? '')) curriculum.eyebrow = '';
	if (!curriculum.title?.trim() || oldTitles.has(curriculum.title.trim())) {
		curriculum.title = defaults.title;
	}
	if (!curriculum.description?.trim() || oldDescriptions.has(curriculum.description.trim())) {
		curriculum.description = defaults.description;
	}
	curriculum.schedule = normalizeCurriculumSchedule(curriculum.schedule);
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

function normalizeCurriculumSchedule(schedule: CurriculumDay[] | undefined): CurriculumDay[] {
	const sourceDays = Array.isArray(schedule) ? schedule : [];
	if (sourceDays.length === 0) return [...defaultLandingContent.curriculum.schedule];

	return sourceDays.map((day, index) => normalizeCurriculumDay(day, index));
}

function normalizeCurriculumDay(day: Partial<CurriculumDay>, index: number): CurriculumDay {
	const fallback =
		defaultLandingContent.curriculum.schedule[index] ??
		defaultLandingContent.curriculum.schedule[0];
	const sessions = normalizeCurriculumSessions(day.sessions, fallback.sessions);
	const speakers = Array.isArray(day.sessionSpeakers)
		? day.sessionSpeakers.map((speaker) => speaker.trim()).filter((speaker) => speaker.length > 0)
		: [];

	return {
		stage: day.stage?.trim() || fallback.stage,
		date: day.date?.trim() || fallback.date,
		sessions,
		sessionSpeakers: sessions.map((_, sessionIndex) => {
			return speakers[sessionIndex] || fallback.sessionSpeakers[sessionIndex] || '';
		}),
		outcome: normalizeCurriculumOutcome(day.outcome, fallback.outcome)
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

function normalizeCurriculumSessions(sessions: string[] | undefined, fallback: string[]): string[] {
	const oldCopy = new Map([
		['Crypto Industry Map & Web3', 'Peta Industri Crypto & Web3'],
		['Financial Planning & Risk Management', 'Financial Planning & Manajemen Risiko'],
		['Fundamental & Narrative Analysis', 'Analisis Fundamental & Narasi Pasar'],
		['Global Macro Analysis', 'Analisis Makro Global'],
		['Technical Analysis (Session 1)', 'Analisis Teknikal Dasar'],
		['Technical Analysis (Session 2)', 'Analisis Teknikal Lanjutan'],
		['Sharia Coin Analysis', 'Analisis Coin Syariah'],
		['Long-Term Portfolio Building', 'Strategi Portfolio Jangka Panjang'],
		['Membangun Portfolio Jangka Panjang', 'Strategi Portfolio Jangka Panjang']
	]);
	const values = Array.isArray(sessions)
		? sessions
				.map((session) => oldCopy.get(session.trim()) ?? session.trim())
				.filter((session) => session.length > 0)
		: [];

	return values.length > 0 ? values : [...fallback];
}

function normalizeCurriculumTopics(topics: string[] | undefined): string[] {
	const oldCopy = new Map([
		['Crypto Industry Map & Web3', 'Peta Industri Crypto & Web3'],
		['Financial Planning & Risk Management', 'Financial Planning & Manajemen Risiko'],
		['Fundamental & Narrative Analysis', 'Analisis Fundamental & Narasi Pasar'],
		['Global Macro Analysis', 'Analisis Makro Global'],
		['Technical Analysis', 'Analisis Teknikal Dasar dan Lanjutan'],
		['Sharia Coin Analysis', 'Analisis Coin Syariah'],
		['Long-Term Portfolio Building', 'Strategi Portfolio Jangka Panjang'],
		['Membangun Portfolio Jangka Panjang', 'Strategi Portfolio Jangka Panjang']
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

	if (!instructors.eyebrow?.trim()) instructors.eyebrow = defaults.eyebrow;
	if (!instructors.title?.trim() || instructors.title.trim() === oldTitle) {
		instructors.title = defaults.title;
	}
	if (!instructors.description?.trim() || oldDescriptions.has(instructors.description.trim())) {
		instructors.description = defaults.description;
	}
	if (!instructors.closing?.trim()) instructors.closing = defaults.closing;
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
		'Biaya Program Crypto Sharia Masterclass'
	]);

	if (!pricing.title?.trim() || oldTitles.has(pricing.title.trim())) {
		pricing.title = defaults.title;
	}
	if (!pricing.description?.trim()) pricing.description = defaults.description;
	if (!pricing.originalPrice?.trim()) pricing.originalPrice = defaults.originalPrice;
	if (!pricing.price?.trim()) pricing.price = defaults.price;
	if (!pricing.note?.trim()) pricing.note = defaults.note;
	if (!pricing.ctaLabel?.trim()) pricing.ctaLabel = defaults.ctaLabel;
	pricing.benefitCards =
		Array.isArray(pricing.benefitCards) && pricing.benefitCards.length > 0
			? pricing.benefitCards
			: defaults.benefitCards;

	return pricing;
}

function normalizeFaq(faq: LandingContent['faq']): LandingContent['faq'] {
	const defaults = defaultLandingContent.faq;
	const oldDefaultQuestions = new Set([
		'Apakah program ini cocok untuk pemula?',
		'Bagaimana jika tidak bisa hadir di salah satu sesi?',
		'Apa yang membedakan program ini dengan masterclass lain?'
	]);

	if (!faq.title?.trim()) faq.title = defaults.title;
	if (
		!Array.isArray(faq.items) ||
		faq.items.length === 0 ||
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

function normalizeLayout(layout: LayoutEntry[]): LayoutEntry[] {
	const defaultEntries = defaultLandingContent.layout;
	const defaultIds = new Set(defaultEntries.map((entry) => entry.id));
	const seen = new Set<SectionId>();
	const normalized: LayoutEntry[] = [];

	for (const entry of Array.isArray(layout) ? layout : []) {
		if (!entry || typeof entry.id !== 'string') continue;
		const id = entry.id as SectionId;
		if (!defaultIds.has(id) || seen.has(id)) continue;
		normalized.push({ id, visible: entry.visible !== false });
		seen.add(id);
	}

	defaultEntries.forEach((entry, defaultIndex) => {
		if (seen.has(entry.id)) return;
		const insertAt = findDefaultInsertIndex(normalized, defaultEntries, defaultIndex);
		normalized.splice(insertAt, 0, { ...entry });
		seen.add(entry.id);
	});

	return reorderLayoutForConversion(normalized, defaultEntries);
}

function reorderLayoutForConversion(
	layout: LayoutEntry[],
	defaultEntries: LayoutEntry[]
): LayoutEntry[] {
	if (!shouldUseConversionOrder(layout)) return layout;

	const visibility = new Map(layout.map((entry) => [entry.id, entry.visible]));
	return defaultEntries.map((entry) => ({
		id: entry.id,
		visible: visibility.get(entry.id) ?? entry.visible
	}));
}

function shouldUseConversionOrder(layout: LayoutEntry[]): boolean {
	const indexOf = (id: SectionId) => layout.findIndex((entry) => entry.id === id);
	const valuePropsIndex = indexOf('valueProps');
	const uspIndex = indexOf('usp');
	const curriculumIndex = indexOf('curriculum');
	const instructorsIndex = indexOf('instructors');
	const pricingIndex = indexOf('pricing');
	const urgencyIndex = indexOf('urgency');

	return (
		(valuePropsIndex !== -1 && uspIndex !== -1 && valuePropsIndex < uspIndex) ||
		(pricingIndex !== -1 && curriculumIndex !== -1 && pricingIndex < curriculumIndex) ||
		(pricingIndex !== -1 && instructorsIndex !== -1 && pricingIndex < instructorsIndex) ||
		(pricingIndex !== -1 && urgencyIndex !== -1 && urgencyIndex !== pricingIndex + 1)
	);
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
			return countFields([c.title, c.price, c.ctaLabel, c.benefitCards.length ? 'x' : '']);
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
