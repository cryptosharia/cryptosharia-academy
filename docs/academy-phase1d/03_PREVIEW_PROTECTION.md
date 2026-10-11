# Protected preview and containment plan

Protection configuration and Vercel Git integration for Academy are UNKNOWN. No preview URL/project/hook/integration/workflow was created. [Vercel Git integration](https://vercel.com/docs/git) can build branch pushes, so even a feature-branch push requires owner verification of deployment behavior and protection first; no push performed.

Owner must approve a dedicated target and restricted tester access using [Vercel Deployment Protection](https://vercel.com/docs/deployment-protection), verify plan entitlement/coverage for unique URLs, aliases and custom domains, and test access while signed out. URL secrecy is insufficient. Do not generate bypass/share tokens or disable protection to run QA. Approved testers use normal provider authentication; backend Rules/entitlements remain mandatory after website login.

Default Academy OFF is retained; live stays disabled. Existing hooks return no-store 503 for contained transactions/payment/orders/vouchers/mock course. Denied/backend unavailable clears private player; no offline media cache or queued progress writes. HTTP tests retain 22 assertions. Protected pages cannot authorize direct SDK operations; separate Rules negatives remain necessary.

Hosted preflight must explicitly disable Blob/Storage/Drive imports/payment/mail/WhatsApp/notification providers, secrets, hooks and extensions. Academy CMS does not link to a real transaction flow. Existing legacy landing/admin/upload/marketing paths are outside the scoped Academy guarantee; use an owner-approved preview route allowlist/egress policy or separately reviewed containment before activating hosted access. No inherited production Blob token, legacy email admin list or external contact link may stand in for staged role/access approval. Masterclass source remains unchanged, root HTTP 200; full business/visual legacy regression NOT VERIFIED.

## CI design only — not activated

A workflow may be proposed separately with workflow_dispatch only, permissions contents:read, no environment/release permission, no secrets/OIDC, no pull_request_target, no deploy/merge/push/hook and checkout persist-credentials:false. Pin reviewed action SHAs and Node24/Java21/CLI/lock; isolated demo emulators, check/lint/unit/Rules/browser/HTTP/Linux build and build-identity audit run as tests only. Raw snapshots/traces/auth state are never uploaded publicly. The dependency advisory report must not be hidden by an unconditional success wrapper. Owner decides browser prerequisites and private artifact retention before enabling.

No active workflow file is needed for this readiness handover. Local scripts already reproduce tests. Provider Git auto-deployment is independent of a test-only workflow; owner must review/disconnect or approve ignored-build/git deployment settings in a separately authorized action. [Git configuration documentation](https://vercel.com/docs/project-configuration/git-configuration).

Before Phase 1D-B: signed target/branch/protection/side-effect map, baseline policy exports, tested staging-only build contract, approved synthetic roles and fixtures, recovery rollback tuple, reviewer sign-off. Before protected preview GO: separate deployment authorization plus actual hosted tests; local green checks alone are insufficient.
