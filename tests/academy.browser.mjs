import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
if (!process.env.ACADEMY_PLAYWRIGHT_MODULE)
	throw new Error('Set ACADEMY_PLAYWRIGHT_MODULE to an installed Playwright module.');
const { chromium } = await import(pathToFileURL(process.env.ACADEMY_PLAYWRIGHT_MODULE).href);
import { seed, password, claims, rulesDb } from './academy-fixtures.ts';
import { writeGrant } from '../src/lib/academyData.ts';
import { Timestamp } from 'firebase/firestore';
const fixture = await seed();
const adminUid = fixture.users['verified-admin'].uid;
const adminDb = rulesDb(fixture.environment.authenticatedContext(adminUid, claims));
const browser = await chromium.launch({
	headless: true,
	executablePath: process.env.ACADEMY_CHROME_EXECUTABLE
});
const secondBrowser = await chromium.launch({
	headless: true,
	executablePath:
		process.env.ACADEMY_SECOND_BROWSER_EXECUTABLE || process.env.ACADEMY_CHROME_EXECUTABLE
});
const base = 'http://localhost:5173';
let pass = 0;
const contexts = [];
async function session(engine = browser) {
	const context = await engine.newContext();
	contexts.push(context);
	const denied = [];
	const payloads = [];
	await context.route('**/*', async (route) => {
		const u = new URL(route.request().url());
		if (u.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(u.hostname))
			return route.continue();
		if (u.hostname === 'www.youtube-nocookie.com')
			return route.fulfill({
				status: 200,
				contentType: 'text/html',
				body: '<p>Synthetic media frame; playback not tested.</p>'
			});
		denied.push(u.origin);
		await route.abort();
	});
	const page = await context.newPage();
	page.on('response', async (response) => {
		if (response.url().includes(':8080')) {
			try {
				payloads.push(await response.text());
			} catch {
				// Long-lived channels can close during navigation; completed catalog RPCs are asserted below.
			}
		}
	});
	return { context, page, denied, payloads };
}
async function status(page, value) {
	await page.bringToFront();
	await page.locator('[data-testid="access-status"]').filter({ hasText: '' }).waitFor();
	await page.waitForFunction(
		(expected) =>
			document.querySelector('[data-testid="access-status"]')?.getAttribute('data-status') ===
			expected,
		value,
		{ timeout: 15000 }
	);
	assert.equal(await page.locator('iframe').count(), value === 'ready' ? 1 : 0);
}
async function login(page, role) {
	await page.goto(base + '/auth/login');
	await page.waitForFunction(
		async () => !(await import('/src/lib/auth.svelte.ts')).userAuth.loading
	);
	await page.locator('#email').fill(fixture.users[role].email);
	await page.locator('#password').fill(password);
	await page.locator('form button[type="submit"]').click();
	await page.waitForURL(base + '/', { timeout: 15000 });
}
async function sdk(page, operation, args) {
	return page.evaluate(
		async ({ operation, args }) => {
			const client = await import('/src/lib/firebase.ts');
			const data = await import('/src/lib/academyData.ts');
			const source = await fetch('/src/lib/firebaseClient.ts').then((r) => r.text());
			const fs = await import(source.match(/from\s+["']([^"']+firebase_firestore[^"']+)["']/)[1]);
			const au = await import(source.match(/from\s+["']([^"']+firebase_auth[^"']+)["']/)[1]);
			if (operation === 'logout') return au.signOut(client.auth);
			if (operation === 'login')
				return au
					.signInWithEmailAndPassword(client.auth, args.email, args.password)
					.then(() => true);
			if (operation === 'private') {
				const lite = await import(
					source.match(/from\s+["']([^"']+firebase_firestore_lite[^"']+)["']/)[1]
				);
				try {
					await lite.getDoc(lite.doc(client.lessonDb, 'academy_lessons', args.id));
					return 'allowed';
				} catch (e) {
					return e.code;
				}
			}
			if (operation === 'forge') {
				try {
					await fs.setDoc(
						fs.doc(client.db, 'users', client.auth.currentUser.uid),
						{ role: 'admin', subscriptionStatus: 'active' },
						{ merge: true }
					);
					return 'allowed';
				} catch (e) {
					return e.code;
				}
			}
			if (operation === 'catalog') {
				const catalog = await data.readCatalog(client.db);
				const lite = await import(
					source.match(/from\s+["']([^"']+firebase_firestore_lite[^"']+)["']/)[1]
				);
				// Capture a completed RPC for the same catalog documents; streaming channels may remain open.
				const snap = await lite.getDocs(
					lite.query(
						lite.collection(client.lessonDb, 'academy_catalog'),
						lite.where('status', '==', 'published')
					)
				);
				if (snap.size !== catalog.length) throw new Error('Catalog transports disagree.');
				return catalog;
			}
			if (operation === 'offline') return fs.disableNetwork(client.db);
			if (operation === 'online') return fs.enableNetwork(client.db);
			if (operation === 'navigate') {
				const navigation =
					await import('/node_modules/@sveltejs/kit/src/runtime/app/navigation.js');
				await navigation.goto(args.path);
			}
		},
		{ operation, args }
	);
}
try {
	const guest = await session();
	await guest.page.goto(base + '/e-learning');
	await guest.page.getByRole('link', { name: 'Synthetic lesson-a1', exact: true }).waitFor();
	assert(!(await guest.page.getByText('Synthetic draft-only', { exact: true }).count()));
	const catalog = await sdk(guest.page, 'catalog', {});
	for (
		let i = 0;
		i < 100 && !guest.payloads.some((body) => body.includes('Synthetic lesson-a1'));
		i++
	)
		await delay(50);
	assert(
		guest.payloads.some((body) => body.includes('Synthetic lesson-a1')),
		'Must capture an actual catalog network response'
	);
	assert.equal(catalog.length, 3);
	assert(!JSON.stringify(catalog).includes('AAAAAAAAAAA'));
	await guest.page.goto(base + '/e-learning/scope-a');
	await status(guest.page, 'unauthorized');
	assert.equal(await sdk(guest.page, 'private', { id: 'lesson-a1' }), 'permission-denied');
	assert(!guest.payloads.join('').includes('AAAAAAAAAAA'));
	console.log('PASS guest: actual catalog/network/private direct read');
	pass++;
	for (const role of ['no-grant', 'expired', 'revoked']) {
		const s = await session();
		await login(s.page, role);
		await s.page.goto(base + '/e-learning/scope-a');
		await status(s.page, role === 'no-grant' ? 'unauthorized' : role);
		assert.equal(await sdk(s.page, 'private', { id: 'lesson-a1' }), 'permission-denied');
		assert.equal(await sdk(s.page, 'forge', {}), 'permission-denied');
		await s.page.reload();
		await status(s.page, role === 'no-grant' ? 'unauthorized' : role);
		await s.page.goto(base + '/admin/courses');
		await s.page.getByText('Akses pengelolaan ditolak.').waitFor();
		console.log('PASS ' + role + ': UI login/denial/reload/SDK forge/CMS');
		pass++;
	}
	const a = await session();
	await login(a.page, 'active');
	await a.page.goto(base + '/e-learning/scope-a');
	await status(a.page, 'ready');
	assert((await a.page.locator('iframe').getAttribute('src')).endsWith('/AAAAAAAAAAA'));
	await a.page.getByRole('button', { name: 'Synthetic lesson-a2', exact: true }).click();
	await status(a.page, 'ready');
	await a.page.getByRole('button', { name: 'Simpan posisi awal' }).click();
	await a.page.getByText('Posisi awal tersimpan.').waitFor();
	assert.equal(await sdk(a.page, 'private', { id: 'lesson-b1' }), 'permission-denied');
	await a.page.goto(base + '/e-learning/scope-b');
	await status(a.page, 'unauthorized');
	await a.page.goto(base + '/e-learning/scope-a');
	await status(a.page, 'ready');
	console.log('PASS active: navigation/progress/out-of-scope');
	pass++;
	await sdk(a.page, 'navigate', { path: '/e-learning/scope-b' });
	await status(a.page, 'unauthorized');
	await sdk(a.page, 'navigate', { path: '/e-learning/scope-a' });
	await status(a.page, 'ready');
	console.log('PASS SPA route parameter changes clear prior scope and validate the new one');
	pass++;
	const tab2 = await a.context.newPage();
	await tab2.goto(base + '/e-learning/scope-a');
	await status(tab2, 'ready');
	await sdk(a.page, 'logout', {});
	await status(a.page, 'unauthorized');
	await status(tab2, 'unauthorized');
	await a.page.reload();
	await status(a.page, 'unauthorized');
	console.log('PASS logout across two tabs and reload');
	pass++;
	await sdk(a.page, 'login', { ...fixture.users.active, password });
	await status(a.page, 'ready');
	await sdk(a.page, 'login', { ...fixture.users['no-grant'], password });
	await status(a.page, 'unauthorized');
	await status(tab2, 'unauthorized');
	assert.equal(await sdk(a.page, 'private', { id: 'lesson-a1' }), 'permission-denied');
	console.log('PASS account switch across tabs and fresh backend read');
	pass++;
	await sdk(a.page, 'login', { ...fixture.users.active, password });
	await status(a.page, 'ready');
	const b = await session(secondBrowser);
	await login(b.page, 'active');
	await b.page.goto(base + '/e-learning/scope-a');
	await status(b.page, 'ready');
	await writeGrant(
		adminDb,
		adminUid,
		fixture.users.active.uid,
		'scope-a',
		'revoked',
		Timestamp.fromMillis(Date.now() - 1000),
		Timestamp.fromMillis(Date.now() + 300000)
	);
	await status(a.page, 'revoked');
	await status(b.page, 'revoked');
	assert.equal(await sdk(a.page, 'private', { id: 'lesson-a1' }), 'permission-denied');
	await a.page.reload();
	await status(a.page, 'revoked');
	console.log('PASS revoke while open in separate browser sessions; stale cache/reload denied');
	pass++;
	await writeGrant(
		adminDb,
		adminUid,
		fixture.users.active.uid,
		'scope-a',
		'active',
		Timestamp.fromMillis(Date.now() - 1000),
		Timestamp.fromMillis(Date.now() + 4500)
	);
	await a.page.getByRole('button', { name: 'Periksa akses kembali' }).click();
	await status(a.page, 'ready');
	await status(a.page, 'expired');
	assert.equal(await sdk(a.page, 'private', { id: 'lesson-a1' }), 'permission-denied');
	console.log('PASS session expiry and server-time denial');
	pass++;
	await writeGrant(
		adminDb,
		adminUid,
		fixture.users.active.uid,
		'scope-a',
		'active',
		Timestamp.fromMillis(Date.now() - 1000),
		Timestamp.fromMillis(Date.now() + 300000)
	);
	await a.page.getByRole('button', { name: 'Periksa akses kembali' }).click();
	await status(a.page, 'ready');
	await sdk(a.page, 'offline', {});
	await status(a.page, 'backend-unavailable');
	await sdk(a.page, 'online', {});
	await status(a.page, 'ready');
	console.log('PASS Firestore offline and reconnect');
	pass++;
	await a.context.setOffline(true);
	await status(a.page, 'backend-unavailable');
	await delay(2500);
	assert.equal(await a.page.locator('iframe').count(), 0);
	await a.context.setOffline(false);
	await status(a.page, 'ready');
	console.log('PASS sustained browser offline closes content; online performs fresh validation');
	pass++;
	const race = await session();
	await login(race.page, 'active');
	await race.page.goto(base + '/e-learning/scope-a');
	await status(race.page, 'ready');
	let release;
	let captured = false;
	let capturing = false;
	const pending = new Promise((resolve) => {
		release = resolve;
	});
	await race.page.route('**/*', async (route) => {
		if (!capturing && route.request().postData()?.includes('academy_lessons/lesson-a2')) {
			capturing = true;
			const response = await route.fetch();
			assert.equal(response.status(), 200);
			assert((await response.text()).includes('AAAAAAAAAAA'));
			captured = true;
			await pending;
			await route.fulfill({ response });
		} else await route.fallback();
	});
	await race.page.getByRole('button', { name: 'Synthetic lesson-a2', exact: true }).click();
	assert.equal(
		await race.page
			.getByRole('button', { name: 'Synthetic lesson-a2', exact: true })
			.getAttribute('aria-pressed'),
		'true'
	);
	for (let i = 0; i < 100 && !captured; i++) await delay(50);
	assert(captured, 'Must actually intercept a private SDK RPC');
	await sdk(race.page, 'login', { ...fixture.users['no-grant'], password });
	assert.equal(await race.page.locator('iframe').count(), 0);
	release();
	await status(race.page, 'unauthorized');
	await delay(500);
	assert.equal(await race.page.locator('iframe').count(), 0);
	await race.page.unroute('**/*');
	console.log('PASS delayed private response after UID switch cannot restore player');
	pass++;
	await writeGrant(
		adminDb,
		adminUid,
		fixture.users.expired.uid,
		'scope-a',
		'active',
		Timestamp.fromMillis(Date.now() - 172800000),
		Timestamp.fromMillis(Date.now() - 1000)
	);
	const forged = await session();
	await forged.context.addInitScript(() => {
		Date.now = () => new Date().getTime() - 86400000;
		localStorage.setItem(
			'academy-grant',
			JSON.stringify({ state: 'active', videoId: 'AAAAAAAAAAA' })
		);
	});
	await login(forged.page, 'expired');
	await forged.page.goto(base + '/e-learning/scope-a');
	await status(forged.page, 'unpublished');
	assert.equal(await sdk(forged.page, 'private', { id: 'lesson-a1' }), 'permission-denied');
	await forged.page.reload();
	await status(forged.page, 'unpublished');
	console.log('PASS forged browser clock and persisted grant cannot bypass backend');
	pass++;
	await guest.page.goto(base + '/e-learning/unknown-scope');
	await status(guest.page, 'not-found');
	console.log('PASS missing public scope has explicit not-found state');
	pass++;
	const management = await session();
	await login(management.page, 'verified-admin');
	await management.page.goto(base + '/admin/courses');
	await management.page.getByRole('heading', { name: 'Grant sintetis per scope' }).waitFor();
	assert(await management.page.getByText('Synthetic draft-only', { exact: true }).count());
	await management.page.getByLabel('Judul', { exact: true }).fill('Browser synthetic draft');
	await management.page.getByLabel('Scope ID', { exact: true }).first().fill('browser-scope');
	await management.page.getByLabel('Bidang', { exact: true }).fill('Synthetic subject');
	await management.page.getByLabel('Bab', { exact: true }).fill('Synthetic chapter');
	await management.page
		.getByLabel('Pemateri disetujui', { exact: true })
		.fill('Synthetic approved instructor');
	await management.page
		.getByLabel('Tautan video', { exact: true })
		.fill('https://youtu.be/CCCCCCCCCCC');
	await management.page.getByRole('button', { name: 'Simpan draft', exact: true }).click();
	await management.page.getByText('Browser synthetic draft', { exact: true }).waitFor();
	const item = management.page.locator('li').filter({ hasText: 'Browser synthetic draft' });
	await item.getByRole('button', { name: 'Ajukan review' }).click();
	await item.getByRole('button', { name: 'Setujui rights dan review' }).click();
	await item.getByRole('button', { name: 'Terbitkan versi disetujui' }).click();
	await item.getByText('published · versi 1').waitFor();
	await management.page.getByLabel('UID peserta').fill(fixture.users['no-grant'].uid);
	await management.page.getByLabel('Scope ID', { exact: true }).last().fill('browser-scope');
	await management.page.getByRole('button', { name: 'Berikan grant', exact: true }).click();
	await management.page.getByText('Perubahan tersimpan.').waitFor();
	const ng = await session();
	await login(ng.page, 'no-grant');
	await ng.page.goto(base + '/e-learning/browser-scope');
	await status(ng.page, 'ready');
	await management.page.getByRole('button', { name: 'Cabut grant', exact: true }).click();
	await status(ng.page, 'revoked');
	console.log('PASS verified-admin: UI CMS review/publish/grant/revoke with real SDK');
	pass++;
	console.log(
		JSON.stringify({
			pass,
			fail: 0,
			externalPlayback: 'NOT VERIFIED',
			browsers: [browser.version(), secondBrowser.version()],
			egress: 'Only loopback requests continued; YouTube frame intercepted with synthetic HTML'
		})
	);
} catch (error) {
	console.log('Last UI', await contexts.at(-1)?.pages().at(-1)?.locator('body').innerText());
	throw error;
} finally {
	for (const context of contexts) await context.close();
	await browser.close();
	await secondBrowser.close();
	await fixture.environment.cleanup();
}
