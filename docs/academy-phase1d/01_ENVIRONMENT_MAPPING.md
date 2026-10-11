# Environment mapping and owner provisioning checklist

## Nonsecret inventory

| Area                        | Production/legacy                           | Proposed Academy staging                                            |
| --------------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| Vercel account/team         | UNKNOWN for Academy                         | UNKNOWN; dedicated owner-approved context proposed                  |
| Vercel project ID           | UNKNOWN                                     | UNKNOWN; not provisioned or linked                                  |
| Deployment domain           | UNKNOWN                                     | UNKNOWN; protected target to be approved                            |
| Git source                  | Repository/main SHA verified in summary     | Exact reviewed readiness SHA; no branch pushed here                 |
| Firebase project ID         | UNKNOWN                                     | UNKNOWN; dedicated project proposed, never guessed                  |
| Firebase Auth               | UNKNOWN                                     | Separate synthetic identities; no production copy                   |
| Firestore database/location | UNKNOWN                                     | Separate default database proposed; location/edition owner decision |
| Deployed Rules              | Export/version unavailable                  | Tested candidate only; no deployed policy                           |
| Indexes                     | UNKNOWN, no export                          | Target query/index review required; no index deployment             |
| Storage/Blob                | Existing source path, actual target UNKNOWN | Disabled; do not attach existing stores/tokens                      |
| OAuth authorized domains    | UNKNOWN                                     | Exact approved preview origin, no broad wildcard assumption         |
| Notifications/payments      | Actual integrations UNKNOWN                 | Disabled; no extensions/webhooks/providers attached                 |

Vercel connector team/project listing did not identify an Academy target; limited account visibility cannot prove resource absence. No unrelated project inspected. Firebase CLI authentication unavailable; no login/secret access. No project env pull/decryption/value read. Private platform metadata stays outside Git.

## Actual build boundary

Current application is emulator-only for Academy: `academyTestEnabled` requires mode emulator and explicit flag true; live remains closed. Missing config creates disabled inert handles. Current artifacts MUST NOT be uploaded: browser loopback would point at the user's own computer; no tunnel permitted.

`scripts/verify-test-build.mjs` reads actual generated server and browser JS, verifies named server static values and minified browser export-to-variable bindings against fixed synthetic project, localhost and separate loopback endpoints. It emits only synthetic identity plus JS digests. Missing/conflicting server values, wrong project, mixed live mode and wrong browser endpoint fail. Compiler output changes fail closed; this is a narrow compiler-specific audit, not a network or hosted-isolation certification.

Future hosted build requires a separately authorized implementation to accept only a reviewed staging identity, expected project/authDomain/appId and approved origin; never activate by changing a flag alone. Owner supplies private production denylist and staging allowlist. Audit final compiled client AND server (and separately effective server runtime config), source SHA/lock/artifact digest and network destinations. Reject project overlap, inherited tokens/ADC, default SDK app/target fallback, emulator endpoints, cross-project Auth/database setup or unreviewed OAuth domains. Browser-issued Firebase tokens must be checked for expected issuer/audience without logging values; hosted GET/query/write assertions remain Rules-enforced.

## Owner-led provisioning, not executed

1. Approve private target map, billing/region, dedicated Vercel project and dedicated Firebase project/database; separate identities and IAM. Check existing resource inventory before creating anything.
2. Approve no Git auto-deployment/hook, deployment protection coverage, branch/source SHA, review policy and synthetic-only intended audience.
3. Provision through owner workflow; install credentials directly in provider UI/secure store, not chat/Git/reports. Separate least-privilege human provisioning and release identities.
4. Configure only target-specific public SDK fields; disable Storage/Blob, payments, messaging, Drive imports, extensions and production webhooks. Require ordinary test accounts verified as appropriate.
5. Obtain Rules/index/export baselines and recovery artifacts; approve roles/content fixture plan. Compile target-specific artifact and audit embedded identities before any deployment authorization.
6. Request distinct Phase 1D-B authorization with exact reviewed plan and outstanding gate outcomes. Nothing in this checklist provisions or deploys.
