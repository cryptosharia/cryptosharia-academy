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
export type Activity = { meta: string; title: string; description: string; image: string };
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
	authority: 'Kredibilitas',
	valueProps: 'Manfaat Utama',
	testimonials: 'Testimoni',
	usp: 'Keunggulan Program',
	pricing: 'Harga & Jadwal',
	curriculum: 'Kurikulum',
	urgency: 'Urgensi & Kuota',
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
		get badge() {
			return `Crypto Sharia Masterclass ${new Date().getFullYear()}`;
		},
		title: '',
		subtitle:
			'Belajar langsung bersama para praktisi berpengalaman yang telah tersertifikasi standar BNSP & internasional dalam bidang investasi dan industri crypto.',
		description:
			'Terbukti membantu banyak member Premium Crypto Sharia membangun strategi profit di market crypto tanpa leverage dan tetap berpegang pada prinsip syariah.',
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
		eyebrow: '',
		title: 'Apa yang Akan Dipelajari?',
		items: [
			{
				label: '',
				title: 'Strategi Cuan Halal di Crypto',
				description: 'Memahami strategi investasi crypto yang terukur dan sesuai prinsip syariah.'
			},
			{
				label: '',
				title: 'Build Your Sharia Wealth',
				description:
					'Membangun aset dan kekayaan jangka panjang dengan pendekatan yang sehat dan berkelanjutan.'
			},
			{
				label: '',
				title: 'Strategi Bertahan di Bear Market',
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
				title: 'Akhirnya lebih paham cara analisa market tanpa gambling.',
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
		quote: '"The best investment you can make is an investment in yourself." - Warren Buffett',
		items: [
			{
				label: '',
				title: 'Tugas Praktek Langsung',
				description:
					'Setiap materi dilengkapi penugasan agar peserta langsung mempraktekkan ilmunya.'
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
					'Diskusi kelompok kecil 5-10 orang bersama mentor untuk pendampingan yang lebih personal.'
			},
			{
				label: '',
				title: 'Sharia Compliant',
				description: 'Belajar fiqih muamalah serta metode analisa crypto sesuai prinsip syariah.'
			},
			{
				label: '',
				title: 'Komunitas Global',
				description:
					'Akses networking eksklusif bersama ratusan member dari berbagai industri dan profesi.'
			}
		]
	},
	pricing: {
		eyebrow: '',
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
		priceBadge: '',
		originalPrice: 'Rp3.000.000',
		price: 'Rp2.000.000',
		note: 'Harga promo untuk peserta awal dengan kuota mentoring terbatas.',
		ctaLabel: 'Gabung Sekarang'
	},
	curriculum: {
		eyebrow: '',
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
		eyebrow: '',
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
			return countFields([c.title, c.quote, c.items.length ? 'x' : '']);
		}
		case 'pricing': {
			const c = content.pricing;
			return countFields([c.title, c.price, c.ctaLabel, c.benefitCards.length ? 'x' : '']);
		}
		case 'curriculum': {
			const c = content.curriculum;
			return countFields([c.title, c.topics.length ? 'x' : '']);
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
