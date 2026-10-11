# Phase 1B — actual application integration

Command: `node scripts/run-local.mjs test:browser`, exit 0. 16 PASS, 0 FAIL, 0 BLOCKED. Local Vite application and the same candidate Rules/data/service modules used by CMS and player were exercised. No alternate mock authorization model is substituted.

Browser versions: Chrome 155.0.8059.39 and a separate Edge process 155.0.4283.45. Playwright 1.62.1 is already installed outside this repository; no dependency was added. Set `ACADEMY_PLAYWRIGHT_MODULE` to its module file and `ACADEMY_CHROME_EXECUTABLE` to a local browser. Optional `ACADEMY_SECOND_BROWSER_EXECUTABLE` selects the second binary; this run selected Edge.

Reproduction: Node 24 / Java 21, `npm ci`, start `npm run emulators`, start `npm run dev:test`, then run the browser command above. Run Rules and browser suites sequentially: both clear/reseed only the same demo fixture project. Restart Vite after Firebase factory/HMR changes; fail-closed configuration reuse is deliberate. Logs belong outside Git.

| Scenario                                  | Observed                                                                                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Guest catalog/network/direct private read | Published metadata renders; actual completed catalog RPC is captured; public fields contain no private ID; private SDK read permission-denied; no iframe |
| No-grant email login                      | Real UI login succeeds; restricted player/SDK/profile forgery/CMS denied; reload stays closed                                                            |
| Expired login                             | Expired state, SDK permission-denied, no iframe after reload                                                                                             |
| Revoked login                             | Revoked state, SDK permission-denied, no iframe after reload                                                                                             |
| Active scoped navigation/progress         | Both allowed lessons selectable; own initial position persists; another scope and direct private ID deny                                                 |
| SPA route changes                         | Actual SvelteKit navigation to another scope clears old media and denies; return to allowed scope validates afresh                                       |
| Logout / second tab / reload              | Both tabs close restricted content and remain closed after reload                                                                                        |
| Account A → B                             | Both tabs reflect the new UID; no-grant B cannot obtain A's lesson                                                                                       |
| Revoke while open, Chrome + Edge          | Grant listener closes both browsers; fresh backend read and reload deny                                                                                  |
| Expiry while open                         | Timer closes iframe; fresh Lite SDK read returns permission-denied                                                                                       |
| Firestore network disable/reconnect       | Cache-only grant state closes content; confirmed reconnection validates afresh                                                                           |
| Sustained browser offline/online          | Content stays closed through offline interval; online performs new validation                                                                            |
| Late private response after UID switch    | A real authorized private RPC is intercepted and verified, held until switch, then released; old response cannot restore the iframe                      |
| Forged clock/persisted grant              | Expired actor with altered browser clock/local storage still receives backend denial and remains closed after reload                                     |
| Missing public scope                      | Explicit not-found state; no editorial existence disclosed                                                                                               |
| Verified admin UI                         | Create draft → review → approval → publish succeeds through protected SDK; grant gives a no-grant actor scoped playback, revoke closes it                |

All page requests outside loopback are aborted. YouTube frame requests are intercepted with synthetic HTML. This tests embed selection and access/data lifecycle, not actual playback, rights, audio, captions or DRM. The completed companion Lite catalog query targets the same documents as the application's streaming catalog query so raw response exposure can be asserted without waiting for an indefinite stream to close.

HTTP regression: enabled `/`, catalog aliases and units return 200; contained transactions/orders/vouchers/mock route return 503. With flag false, `/` returns 200 and Academy routes 503. With services stopped, `/` returns 200 and Academy routes 503; the Rules launcher exits before setup. Masterclass source remains unchanged; full Masterclass visual/business regression is NOT VERIFIED.

Loading, unauthorized, expired, revoked, unpublished, not-found and backend-unavailable are explicit player states. Public metadata absence intentionally combines missing and unpublished identities as not-found; private denial after valid grant is unavailable/unpublished. The ordinary catalog distinguishes loading, empty and backend failure.

Progress UI saves only an initial position; full playback-based resume/completion and attachment rendering are outside this secure-access phase. No quiz, certificate, transaction or real content readiness is claimed.
