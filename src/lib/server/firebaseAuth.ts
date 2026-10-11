import * as env from '$env/static/public';
import { resolveFirebaseSettings, requireFirebaseServices } from '$lib/firebaseConfig';

type FirebaseLookupResponse = {
	users?: Array<{
		email?: string;
		localId?: string;
	}>;
	error?: {
		message?: string;
	};
};

export type FirebaseAuthUser = {
	email: string;
	uid: string;
};

export async function getFirebaseUserFromIdToken(idToken: string): Promise<FirebaseAuthUser> {
	const settings = resolveFirebaseSettings(env);
	await requireFirebaseServices(settings);
	const origin =
		settings.mode === 'emulator'
			? `${settings.authEmulatorUrl}/identitytoolkit.googleapis.com`
			: 'https://identitytoolkit.googleapis.com';
	const response = await fetch(`${origin}/v1/accounts:lookup?key=${settings.config.apiKey}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ idToken })
	});

	const data = (await response.json()) as FirebaseLookupResponse;

	if (!response.ok) {
		throw new Error(data.error?.message || 'Token Firebase tidak valid.');
	}

	const user = data.users?.[0];
	if (!user?.email || !user.localId) {
		throw new Error('Token Firebase tidak mengarah ke user yang valid.');
	}

	return {
		email: user.email.toLowerCase(),
		uid: user.localId
	};
}
