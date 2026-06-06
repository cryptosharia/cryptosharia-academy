import { json } from '@sveltejs/kit';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { RequestHandler } from './$types';
import { ADMIN_EMAILS } from '$lib/admin';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from '$lib/blobUpload';
import { getFirebaseUserFromIdToken } from '$lib/server/firebaseAuth';

const BLOB_PATH_PATTERN = /^(landing|courses)\/[a-zA-Z0-9._-]+$/;

type BlobUploadPayload = {
	scope: 'landing' | 'courses';
	idToken?: string;
};

function getBearerToken(request: Request) {
	const authorization = request.headers.get('authorization');
	const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
	return token || null;
}

function getUploadScope(pathname: string) {
	const match = pathname.match(BLOB_PATH_PATTERN);
	if (!match) {
		throw new Error('Path upload gambar tidak valid.');
	}
	return match[1] as BlobUploadPayload['scope'];
}

function getClientPayload(clientPayload: string | null | undefined): BlobUploadPayload {
	if (!clientPayload) {
		throw new Error('Login admin dibutuhkan untuk upload gambar.');
	}

	let payload: unknown;
	try {
		payload = JSON.parse(clientPayload);
	} catch {
		throw new Error('Payload upload gambar tidak valid.');
	}

	if (
		!payload ||
		typeof payload !== 'object' ||
		!('scope' in payload) ||
		(payload.scope !== 'landing' && payload.scope !== 'courses') ||
		('idToken' in payload &&
			(typeof payload.idToken !== 'string' || payload.idToken.trim().length === 0))
	) {
		throw new Error('Payload upload gambar tidak valid.');
	}

	return payload as BlobUploadPayload;
}

function getUploadIdToken(request: Request, payload: BlobUploadPayload) {
	const token = getBearerToken(request) || payload.idToken;
	if (!token) {
		throw new Error('Login admin dibutuhkan untuk upload gambar.');
	}
	return token;
}

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : 'Gagal memproses upload gambar.';
}

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as HandleUploadBody;

	try {
		const response = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (pathname, clientPayload) => {
				const pathScope = getUploadScope(pathname);
				const payload = getClientPayload(clientPayload);
				if (payload.scope !== pathScope) {
					throw new Error('Scope upload gambar tidak sesuai.');
				}

				const token = getUploadIdToken(request, payload);
				const user = await getFirebaseUserFromIdToken(token);

				if (!ADMIN_EMAILS.includes(user.email)) {
					throw new Error('Akun ini tidak punya akses upload admin.');
				}

				return {
					allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
					maximumSizeInBytes: MAX_IMAGE_SIZE_BYTES,
					addRandomSuffix: true,
					cacheControlMaxAge: 60 * 60 * 24 * 365
				};
			},
			onUploadCompleted: async () => {
				return;
			}
		});

		return json(response);
	} catch (error) {
		return json({ error: getErrorMessage(error) }, { status: 400 });
	}
};
