import { json } from '@sveltejs/kit';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { RequestHandler } from './$types';
import { ADMIN_EMAILS } from '$lib/admin';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from '$lib/blobUpload';
import { getFirebaseUserFromIdToken } from '$lib/server/firebaseAuth';

const BLOB_PATH_PATTERN = /^(landing|courses)\/[a-zA-Z0-9._-]+$/;

function getBearerToken(request: Request) {
	const authorization = request.headers.get('authorization');
	const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
	if (!token) {
		throw new Error('Login admin dibutuhkan untuk upload gambar.');
	}
	return token;
}

function getUploadScope(pathname: string) {
	const match = pathname.match(BLOB_PATH_PATTERN);
	if (!match) {
		throw new Error('Path upload gambar tidak valid.');
	}
	return match[1];
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
			onBeforeGenerateToken: async (pathname) => {
				const token = getBearerToken(request);
				const user = await getFirebaseUserFromIdToken(token);

				if (!ADMIN_EMAILS.includes(user.email)) {
					throw new Error('Akun ini tidak punya akses upload admin.');
				}

				getUploadScope(pathname);

				return {
					allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
					maximumSizeInBytes: MAX_IMAGE_SIZE_BYTES,
					addRandomSuffix: true,
					cacheControlMaxAge: 60 * 60 * 24 * 365
				};
			}
		});

		return json(response);
	} catch (error) {
		return json({ error: getErrorMessage(error) }, { status: 400 });
	}
};
