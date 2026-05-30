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
	| 'pricing'
	| 'curriculum'
	| 'urgency'
	| 'faq'
	| 'finalCta';

export type Highlight = { symbol: string; performance: string };
export type Feature = { label: string; title: string; description: string };
export type ProofItem = { meta: string; title: string; description: string };
export type Faq = { question: string; answer: string };
export type Cta = { label: string; href: string };
export type BenefitCard = { title: string; items: string[] };
export type LayoutEntry = { id: SectionId; visible: boolean };

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
		videoLabel: string;
		videoTitle: string;
		videoDescription: string;
		highlights: Highlight[];
	};

	authority: {
		eyebrow: string;
		title: string;
		description: string;
		activities: ProofItem[];
		cards: { label: string; description: string }[];
	};

	valueProps: {
		eyebrow: string;
		title: string;
		items: Feature[];
		docEyebrow: string;
		docTitle: string;
		docDescription: string;
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
		quote: string;
		items: Feature[];
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

	curriculum: {
		eyebrow: string;
		title: string;
		topics: string[];
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
	authority: 'Otoritas & Kredibilitas',
	valueProps: 'Value Proposition',
	testimonials: 'Testimoni',
	usp: 'Unique Selling Proposition',
	pricing: 'Harga & Jadwal',
	curriculum: 'Kurikulum',
	urgency: 'Urgency / Scarcity',
	faq: 'FAQ',
	finalCta: 'Penutup / CTA Akhir'
};

export const defaultLandingContent: LandingContent = {
	layout: [
		{ id: 'hero', visible: true },
		{ id: 'authority', visible: true },
		{ id: 'valueProps', visible: true },
		{ id: 'testimonials', visible: true },
		{ id: 'usp', visible: true },
		{ id: 'pricing', visible: true },
		{ id: 'curriculum', visible: true },
		{ id: 'urgency', visible: true },
		{ id: 'faq', visible: true },
		{ id: 'finalCta', visible: true }
	],
	whatsapp: {
		phone: '6281234567890',
		message: 'Assalamualaikum CryptoSharia, saya mau daftar Crypto Sharia Masterclass.'
	},
	seo: {
		title: 'Crypto Sharia Masterclass | Systematic Crypto Investing',
		description:
			'Learn systematic crypto investing aligned with Islamic values bersama praktisi tersertifikasi, mentoring, komunitas, dan kurikulum crypto syariah terstruktur.'
	},
	hero: {
		badge: 'Crypto Sharia Masterclass 2026',
		title: 'Learn Systematic Crypto Investing Aligned with Islamic Values',
		subtitle:
			'Belajar langsung bersama para praktisi berpengalaman yang telah tersertifikasi standar BNSP & internasional dalam bidang investasi dan industri crypto.',
		description:
			'Terbukti membantu banyak member Premium Crypto Sharia membangun strategi profit di market crypto tanpa leverage dan tetap berpegang pada prinsip syariah.',
		primaryCtaLabel: 'Join Now / Gabung Sekarang',
		secondaryCta: { label: 'Lihat Kurikulum', href: '#curriculum' },
		videoLabel: 'intro-masterclass.mp4',
		videoTitle: 'Video Perkenalan Program',
		videoDescription: 'Placeholder upload-ready untuk memperkenalkan visi program dan mentor utama.',
		highlights: [
			{ symbol: 'FHE', performance: '+400%' },
			{ symbol: 'UMBRA', performance: '+280%' },
			{ symbol: 'HUMANITY', performance: '+220%' },
			{ symbol: 'LIGHT', performance: '+200%' }
		]
	},
	authority: {
		eyebrow: 'Otoritas & Kredibilitas',
		title: 'Dibangun dari pengalaman edukasi dan komunitas nyata.',
		description:
			'Program ini menggabungkan pengalaman praktisi, standar sertifikasi, dan proses belajar komunitas agar peserta memahami crypto secara sistematis, bukan sekadar mengikuti hype.',
		activities: [
			{
				meta: 'Live mentoring',
				title: 'QnA Session',
				description:
					'Forum tanya jawab rutin untuk membahas market, portofolio, dan fiqih muamalah.'
			},
			{
				meta: 'Community event',
				title: 'Nushafest',
				description:
					'Dokumentasi edukasi publik bersama komunitas yang tertarik pada aset digital halal.'
			},
			{
				meta: 'Offline activity',
				title: 'Halal Kulture Market',
				description: 'Aktivasi edukasi crypto syariah untuk memperluas literasi investor Muslim.'
			},
			{
				meta: 'Member circle',
				title: 'Gathering Komunitas',
				description: 'Diskusi kecil dan networking antar member untuk memperkuat proses belajar.'
			}
		],
		cards: [
			{
				label: 'Analisa Market',
				description: 'Placeholder screenshot hasil analisa market dan thesis aset pilihan.'
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
		eyebrow: 'Value Proposition',
		title: 'Apa yang Akan Dipelajari?',
		items: [
			{
				label: '01',
				title: 'Strategi Cuan Halal di Crypto',
				description:
					'Memahami strategi investasi crypto yang terukur dan sesuai prinsip syariah.'
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
		],
		docEyebrow: 'Dokumentasi Kegiatan',
		docTitle: 'Seminar, mentoring, QnA Session, dan aktivitas komunitas offline.',
		docDescription:
			'Area ini disiapkan untuk foto-foto kegiatan asli ketika materi campaign final tersedia.'
	},
	testimonials: {
		eyebrow: 'Social Proof & Testimoni',
		title: 'Member Premium Crypto Sharia yang Sudah Bertumbuh Bersama',
		description:
			'Placeholder untuk screenshot testimoni Discord, ucapan terima kasih, dokumentasi profit member, dan sharing pengalaman belajar.',
		items: [
			{
				meta: 'Discord Community',
				title: 'Thanks to you my mentor!',
				description:
					'Member membagikan hasil belajar, eksekusi strategi spot, dan progres portofolio di Discord Premium.'
			},
			{
				meta: 'Member feedback',
				title: 'Akhirnya lebih paham cara analisa market tanpa gambling.',
				description:
					'Pendekatan riset, manajemen risiko, dan screening syariah membantu member lebih disiplin.'
			},
			{
				meta: 'Portfolio story',
				title: 'Profit tanpa leverage, tetap pakai rencana.',
				description:
					'Dokumentasi hasil member ditampilkan sebagai studi kasus edukasi, bukan janji keuntungan.'
			}
		]
	},
	usp: {
		eyebrow: 'Unique Selling Proposition',
		title: 'Kenapa Harus Crypto Sharia Masterclass?',
		quote:
			'"The best investment you can make is an investment in yourself." - Warren Buffett',
		items: [
			{
				label: 'Practice',
				title: 'Tugas Praktek Langsung',
				description:
					'Setiap materi dilengkapi penugasan agar peserta langsung mempraktekkan ilmunya.'
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
		]
	},
	pricing: {
		eyebrow: 'Jadwal & Harga Program',
		title: 'Gabung Programnya Sekarang',
		description:
			'Pelaksanaan program direncanakan pada akhir Juni 2026 atau awal Juli 2026. Tanggal final akan diumumkan segera.',
		benefitCards: [
			{
				title: 'Benefit Tambahan',
				items: ['Materi & rekaman kelas', 'Mentoring & networking komunitas']
			},
			{
				title: 'Format Belajar',
				items: ['Kelas terstruktur bersama praktisi', 'FGD kecil untuk pendampingan intensif']
			}
		],
		priceBadge: 'Special Price',
		originalPrice: 'Rp3.000.000',
		price: 'Rp2.000.000',
		note: 'Harga promo untuk peserta awal dengan kuota mentoring terbatas.',
		ctaLabel: 'Gabung Sekarang'
	},
	curriculum: {
		eyebrow: 'Detail Kurikulum',
		title: 'Materi Pembelajaran',
		topics: [
			'Peta Industri Crypto & Web3',
			'Financial Planning & Risk Management',
			'Analisa Fundamental & Narrative',
			'Analisa Teknikal',
			'Analisa Global Macro',
			'Analisa Koin Syariah',
			'Portfolio Building untuk Long Term Investment'
		]
	},
	urgency: {
		eyebrow: 'Urgency / Scarcity',
		title: 'Special Price for 10 Pax Only',
		description: 'Kuota terbatas untuk menjaga kualitas mentoring dan diskusi tetap optimal.',
		ctaLabel: 'Daftar Sekarang'
	},
	faq: {
		eyebrow: 'Frequently Asked Questions',
		title: 'Pertanyaan yang Sering Diajukan',
		items: [
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
		]
	},
	finalCta: {
		eyebrow: 'Crypto Sharia Masterclass',
		title: 'Ilmu Dulu. Cuan Kemudian. Berkah Selamanya.',
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

/**
 * Deep-merge stored content over the defaults so any missing/new field always
 * falls back to a sensible value. Arrays are replaced wholesale when present.
 */
export function mergeContent(stored: Partial<LandingContent> | null | undefined): LandingContent {
	const base: LandingContent = structuredClone(defaultLandingContent);
	if (!stored) return base;

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

	return merge(base, stored);
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
	await setDoc(
		CONTENT_REF(),
		{ ...content, updatedAt: serverTimestamp() },
		{ merge: false }
	);
}
