export type BlobUploadScope = 'landing' | 'courses';

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'image/avif'
] as const;

type UploadImageOptions = {
	file: File;
	scope: BlobUploadScope;
	idToken: string;
	abortSignal?: AbortSignal;
	onProgress?: (percentage: number) => void;
};

export function isAllowedImageFile(file: File) {
	return ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number]);
}

export function sanitizeBlobFileName(fileName: string) {
	return fileName.replace(/[^a-zA-Z0-9._-]/g, '') || 'image';
}

export async function uploadImageToVercelBlob({
	file,
	scope,
	idToken,
	abortSignal,
	onProgress
}: UploadImageOptions) {
	const { upload } = await import('@vercel/blob/client');
	const pathname = `${scope}/${Date.now()}-${sanitizeBlobFileName(file.name)}`;

	const blob = await upload(pathname, file, {
		access: 'public',
		contentType: file.type,
		handleUploadUrl: '/api/blob/upload',
		headers: {
			Authorization: `Bearer ${idToken}`
		},
		clientPayload: JSON.stringify({ scope }),
		multipart: file.size > 4 * 1024 * 1024,
		abortSignal,
		onUploadProgress: ({ percentage }) => {
			onProgress?.(Math.round(percentage));
		}
	});

	return blob.url;
}
