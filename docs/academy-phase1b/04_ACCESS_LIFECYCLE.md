# Phase 1B — access lifecycle

Implementation: `academyPlayer.ts`, shared `AcademyPlayer.svelte`, existing Auth SDK lifecycle, and own-profile generation guards. Backend Rules use request time, explicit UID/scope, grant state and publication/version integrity. Client state is presentation, never authority.

| Event                             | Player behavior                                                                     | Backend evidence                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Initial load / metadata change    | Clear old media, show loading, fetch published scope metadata                       | Published query and denied missing/draft paths                          |
| UID switch / logout               | Invalidate generation, stop prior listeners/timer, clear media and progress message | Fresh new-actor private SDK denial; two-tab test                        |
| Lesson or SPA scope change        | Generation and pending metadata callback invalidated                                | Allowed lesson navigation; out-of-scope private reads deny              |
| Grant revoked/missing             | Listener immediately clears; pending old reads cannot emit                          | Fresh read and both-browser reload deny                                 |
| Grant expiry                      | Expiry timer cancels reads/listeners and clears iframe                              | Fresh Lite SDK request-time denial; forged clock cannot bypass          |
| Error/offline/cache-only snapshot | Clear media; no persistent private cache accepted                                   | Sustained browser offline and reconnect test                            |
| Hidden tab                        | Suspend and clear media; visibility return triggers new checks                      | Second-tab and cross-browser flows                                      |
| Old asynchronous response         | Actor + lesson generation and request sequence checked before rendering             | Actual held private response released after account switch stays closed |
| Reconnect / explicit retry        | Re-check grant and private content from backend                                     | Automatic reconnect and explicit reactivation/retry exercised           |

Private content and grant validation use Firestore Lite, which makes fresh server RPCs without offline caching/query resumption. Full Firestore is retained for grant invalidation listeners, catalog, profile/progress and protected transactions. Cached listener data alone never establishes playable content. Polling every two seconds additionally verifies access/publication; each RPC is bounded to three seconds. Visible changes clear at listener/timer delivery; connectivity detection/revalidation is bounded rather than a claim of zero network latency.

Expiry timers use the client clock only to remove presentation early. Rules enforce the actual entitlement period independently. Changing the client clock/local storage cannot retrieve new private content. A delayed response can contain data already authorized for the previous UID; the generation guard prevents presenting it under the new UID.

There is deliberately no IndexedDB/persistent private lesson cache. Already received data, a previously disclosed YouTube ID, copied URLs, screen recordings or redistributed Unlisted video cannot be recalled. This phase prevents new unauthorized data retrieval and clears the application's player; it does not create YouTube DRM or protect media hosted outside Firebase.

Owner decisions still required: real auth/session revocation policy, claim provisioning/removal latency, commercial scope/expiry rules and actual media protection strategy. Emulator claims and fixture identities do not verify production identity management.
