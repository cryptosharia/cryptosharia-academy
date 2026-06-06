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

async function getBlobUploadClientToken({
	pathname,
	scope,
	idToken,
	multipart,
	abortSignal
}: {
	pathname: string;
	scope: BlobUploadScope;
	idToken: string;
	multipart: boolean;
	abortSignal?: AbortSignal;
}) {
	const response = await fetch('/api/blob/upload', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${idToken}`
		},
		body: JSON.stringify({
			type: 'blob.generate-client-token',
			payload: {
				pathname,
				clientPayload: JSON.stringify({ scope, idToken }),
				multipart
			}
		}),
		signal: abortSignal
	});

	let data: { clientToken?: string; error?: string } = {};
	try {
		data = (await response.json()) as { clientToken?: string; error?: string };
	} catch {
		// Keep the generic message below when the server does not return JSON.
	}

	if (!response.ok || !data.clientToken) {
		throw new Error(data.error || 'Gagal mengambil token upload dari Vercel Blob.');
	}

	return data.clientToken;
}

export async function uploadImageToVercelBlob({
	file,
	scope,
	idToken,
	abortSignal,
	onProgress
}: UploadImageOptions) {
	const { put } = await import('@vercel/blob/client');
	const pathname = `${scope}/${Date.now()}-${sanitizeBlobFileName(file.name)}`;
	const multipart = file.size > 4 * 1024 * 1024;

	const token = await getBlobUploadClientToken({
		pathname,
		scope,
		idToken,
		multipart,
		abortSignal
	});

	const blob = await put(pathname, file, {
		access: 'public',
		contentType: file.type,
		token,
		multipart,
		abortSignal,
		onUploadProgress: ({ percentage }) => {
			onProgress?.(Math.round(percentage));
		}
	});

	return blob.url;
}
