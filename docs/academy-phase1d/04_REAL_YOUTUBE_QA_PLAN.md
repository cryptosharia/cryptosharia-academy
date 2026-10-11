# Real YouTube QA plan and acceptance matrix

REAL YOUTUBE PLAYBACK — NOT VERIFIED.

Candidate `https://youtu.be/ethrPMuAayU` is a review candidate, not an approved/published Academy lesson. No real video fetched, played, imported or published here. Actual rights/availability/duration/captions UNKNOWN.

## Static integration audit

Shared parser accepts canonical validated ID only. Runtime uses HTTPS youtube-nocookie embed, enablejsapi=1 and encoded location.origin; script is official www.youtube.com/iframe_api. Referrer policy strict-origin-when-cross-origin preserves origin for HTTPS cross-origin requests. Iframe title, fullscreen and encrypted-media/picture-in-picture are present. playsinline is currently absent; manual playback is used, autoplay permission is not requested. Mobile inline/autoplay behavior requires actual target QA and any approved correction. No configured SvelteKit CSP; deployed headers UNKNOWN. Plan CSP report-only first: approved YouTube script/frame origins, exact Auth/Firestore connect targets and SvelteKit script nonce/hash policy; inspect actual dependencies before enforcement. Do not add unsafe broad frame/script/connect wildcards or alter Masterclass globally.

Adapter handles onReady seek, PLAYING sample, pause/ended flush, numeric onError safe message and onAutoplayBlocked; destroy clears player/timer. API timeout is ten seconds. Current local tests intercept fake events, NOT actual player behavior. [Official IFrame API reference](https://developers.google.com/youtube/iframe_api_reference).

| QA case                      | Actual hosted acceptance                                                                                    | Current evidence                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Embed/origin/Referer/CSP     | Correct approved HTTPS origin; no sandbox/referrer denial; frame and script load under reviewed policy      | Static only                               |
| Play/pause/audio             | Real picture/audio and real API state events; pause saves observed nonzero time                             | Fake local PASS; real NOT VERIFIED        |
| seekTo/getCurrentTime        | Forward/backward position corresponds to video, bounded server write                                        | Fake local PASS; real NOT VERIFIED        |
| Reload/second browser        | Resume close to last accepted database position/version; separate identity isolated                         | Fake local PASS; real NOT VERIFIED        |
| Ended/autoplay-blocked       | Safe controls/message; final position, no completion or entitlement                                         | NOT VERIFIED against provider             |
| Captions/subtitles           | Language/accuracy/accessibility and manual selection checked; absence explicitly blocked or owner exception | UNKNOWN                                   |
| Fullscreen/mobile            | Real desktop and iOS/Android sizing, controls/orientation/inline behavior                                   | NOT VERIFIED                              |
| Error 100                    | Removed/private video produces safe unavailable state, no further samples                                   | Provider negative asset needed            |
| Error 101/150                | Embedding denial handled without authorization bypass                                                       | Provider negative asset needed            |
| Error 153                    | Missing identification/referrer reproduced only under approved test control; safe state                     | Domain/provider QA needed                 |
| Logout/switch/revoke/offline | Adapter destroyed, no further writes, SDK denial; old responses cannot restore player                       | Synthetic local PASS; hosted NOT VERIFIED |

## Operator script

`node scripts/academy-hosted-qa.mjs` prints the plan only, makes no requests. Run mode is NOT EXECUTED in Phase 1D-A. After separate authorization, operator uses a private reviewed record with ownerAuthorized/protectionVerified/backendIsolationVerified/embeddingRightsApproved true, reviewedSha, exact contentVersion, approvedOrigin and scoped lessonUrl. Set the already-reviewed installed Playwright module and browser paths; run `node scripts/academy-hosted-qa.mjs --run /private/approved-record.json` locally. Do not commit that record, target URL, login state or logs.

Script opens a fresh visible browser, observes real YT event/call callbacks without media interception/fake API and walks nine manual QA groups. Operator authenticates provider protection and synthetic account in browser; no password/token in script arguments or logs. It records PASS/FAIL/BLOCKED and numeric events/positions only, then closes the browser. This is an operator-assisted plan, not a fully automatic acceptance oracle: observed API events do not prove sound/caption quality/rights/backend identity or all required cases. Require private screenshot/network-header and exact own progress/version evidence, preflight compiled backend identity/token audience and explicit owner review. No public tunnel/emulator exposure or real participant data.

Run only after protection, staging-only build contract and content gate pass. Repeat clean browser without instrumentation to detect instrumentation interference. Missing negative assets/mobile device/approval leaves the corresponding case BLOCKED; never substitute the 33 fake-provider scenarios for real playback PASS.
