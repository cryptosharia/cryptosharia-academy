export type Lesson = {
	title: string;
	videoUrl: string;
	type: 'video' | 'reading' | 'quiz';
	duration: string;
};
export type AcademyCourse = {
	id: string;
	title: string;
	description: string;
	topics: number;
	duration: string;
	category: string;
	image: string;
	price: number;
	originalPrice: number;
	lessons: Lesson[];
};

export function readAcademyCourse(id: string, data: Record<string, unknown>): AcademyCourse {
	const string = (value: unknown) => (typeof value === 'string' ? value : '');
	const number = (value: unknown) =>
		typeof value === 'number' && Number.isFinite(value) ? value : 0;
	const lessons: Lesson[] = [];
	if (Array.isArray(data.lessons)) {
		for (const item of data.lessons) {
			if (!item || typeof item !== 'object') continue;
			const lesson: Record<string, unknown> = item;
			if (!['video', 'reading', 'quiz'].includes(string(lesson.type))) continue;
			lessons.push({
				title: string(lesson.title),
				videoUrl: string(lesson.videoUrl),
				type: lesson.type as Lesson['type'],
				duration: string(lesson.duration)
			});
		}
	}
	return {
		id,
		title: string(data.title),
		description: string(data.description),
		topics: number(data.topics),
		duration: string(data.duration),
		category: string(data.category),
		image: string(data.image),
		price: number(data.price),
		originalPrice: number(data.originalPrice),
		lessons
	};
}
