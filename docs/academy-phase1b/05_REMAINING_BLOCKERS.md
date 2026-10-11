# Phase 1B — remaining blockers

Eight external gate groups remain BLOCKED / NOT VERIFIED. Automated local security scenarios have no remaining blocked case.

| Gate                                        | Status       | Needed from owner / next authorized phase                                                                                                             |
| ------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Deployed Firebase identity/Rules/indexes | NOT VERIFIED | Read-only export/version and environment map; no production security PASS                                                                             |
| 2. Access policy and trusted roles          | BLOCKED      | Commercial model, scope/expiry/revoke policy, verified role provisioning, reviewers/publisher identities and separation of duties                     |
| 3. Real content approval                    | BLOCKED      | Curated stable-ID manifest, instructor consent, rights, syariah requirements and approval per content version; no bulk Drive import                   |
| 4. Actual media playback                    | NOT VERIFIED | Approved test asset/domain, embedding permissions, error/caption/mobile playback checks; this phase only intercepted synthetic frames                 |
| 5. Hosted preview isolation                 | BLOCKED      | Approved Vercel/project/domain/target configuration and side-effect controls; public preview expressly not created                                    |
| 6. Dependency residual risk                 | BLOCKED      | Four low package entries from cookie advisory; approved compatible remediation or reviewed major framework migration/risk decision                    |
| 7. Recovery/operations/platform             | NOT VERIFIED | Backup/restore/rollback/monitoring ownership and rehearsal; Linux build passed, Windows adapter symlink packaging remains a prior platform limitation |
| 8. Repository/Drive governance              | BLOCKED      | Owner review of visibility, existing tracked log/history redaction and earlier sharing finding; no history rewrite, permission change or public push  |

Final `npm audit --json` exit 1: four low entries, zero moderate/high/critical. The existing cookie advisory [GHSA-pxg6-pf52-xh8x](https://github.com/advisories/GHSA-pxg6-pf52-xh8x) propagates through Kit and adapters. Lockfile and dependency versions did not change in Phase 1B. This is neither remediation nor acceptance of production risk. No auto-fix/major upgrade was performed.

Five existing check warnings concern placeholder links in Masterclass/bootcamp and auth recovery. They are not hidden. No real recovery-email flow, payment, order approval, voucher redemption, certificate, notification, marketing statistic or Masterclass redesign was activated.

Local schema ceilings: scoped lesson metadata, not the complete curriculum administration system; opaque attachment refs without a renderer/storage policy; initial-position progress rather than complete playback resume; synthetic role/workflow policy rather than real organizational sign-off; emulator index/performance/IAM limitations. These do not justify copying candidate Rules into production unchanged. In particular the candidate's global default deny also excludes shared legacy/Masterclass collections; deployment would require a separately reviewed combined policy.

Raw operational logs, serialized responses and build artifact remain outside Git. Public reports avoid credentials, private media/source URLs and participant PII. Existing repository confidentiality findings have not been remediated or certified by this phase.
