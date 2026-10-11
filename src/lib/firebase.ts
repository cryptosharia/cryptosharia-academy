import * as env from '$env/static/public';
import { resolveFirebaseSettings, requireFirebaseServices } from './firebaseConfig';
import { initializeFirebaseClient } from './firebaseClient';

export const firebaseSettings = resolveFirebaseSettings(env);
export const { auth, db, lessonDb } = initializeFirebaseClient(firebaseSettings);
export const ensureFirebaseReady = () => requireFirebaseServices(firebaseSettings);
