# Pilot content and trusted role readiness

No real lesson is READY. `pilot-lesson-readiness.example.json` is one unapproved design slot derived from the Phase 1C manifest, not a database seed or publication request. Proposed Fundamental/level1/chapter1/lesson1 placement, stable proposed IDs/outcomes require curriculum owner verification. Title, final duration, edited/final stage, instructor/ownership, embedding permission, captions, intended-domain asset availability, reviewer/syariah requirement and exact-version approval are all pending. Private asset/reviewer evidence remains external; no Drive ID/private URL/sensitive identity in template. No 168 published records.

Owner curates exactly one intended pilot lesson: verify mapping/title/outcomes, final edit and actual duration, instructor consent and rights, caption language/accuracy, syariah requirement, content reviewer and approval version; verify intended-domain playback. Approval covers exact content version, not a mutable URL. Draft is not public, approved is not yet public, published requires unchanged approval/parent/order/audit. Subsequent lesson edits invalidate approval and withdraw public projection. Current Rules accept a rights assertion but do not independently prove licensing/final editing/captions; external evidence review cannot be replaced by synthetic CMS approval.

## Five future synthetic identities — not provisioned hosted

| Identity    | Intended authority                              | Current boundary / decision                                                                   |
| ----------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Admin       | Manage scoped grants and incident access        | Verified academyAdmin; no self-assignment                                                     |
| Editor      | Curate drafts, request review                   | Currently academyAdmin also grants/admin preview; least-privilege gap requires owner decision |
| Reviewer    | Review exact version/rights                     | academyReviewer; academySyariah additionally required when applicable                         |
| Publisher   | Publish approved unchanged version              | academyPublisher; cannot edit/grant/review alone                                              |
| Participant | Read active scope, own profile/history/progress | Ordinary Auth UID and explicit scoped grant; never a role claim granting content              |

Separate people/accounts/duties; do not hand all fixture claims to a hosted tester. Guest/no-grant/expired/revoked remain required. Current reviewer cannot read private projection merely by role; approved media review occurs through authorized editorial data. Admin preview is broad in the candidate; owner must approve or narrow that policy. Hosted identity and review/role provisioning remains NOT VERIFIED.

Owner-authorized provisioning: private approved roster/UID/project/role/expiry/change ticket, verify separate staging identity/email, two-person approval for privileged claims where chosen, trusted staging-only operator applies claims, immutable external change record, token refresh/re-auth and direct SDK positive/negative checks. No app UI profile field/ordinary account can assign role. [Firebase custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) require privileged provisioning and new tokens for changed claims.

Revoke incident: remove claims/disable compromised identity/revoke refresh tokens through approved operator, revoke grants and close Academy if needed; already issued tokens can retain claims until refresh/expiry, so verify actual latency. Preserve audit and fresh request-time denial, never restore grants wholesale from an old backup. No hosted accounts created automatically, no production participants/credentials copied. Owner must decide editor/admin separation, separate syariah sign-off, claim latency and incident access policy before Phase 1D-B approval.

Drive/repository governance review remains BLOCKED. Current metadata was checked read-only; sensitive findings and remediation recommendations are private. No sharing/visibility/history/file change performed.
