# Owner decision register

All approvals below remain pending. Synthetic test claims/rights are not organizational authorization.

| ID      | Owner role                       | Required evidence / decision                                                                                                         | Gate                    |
| ------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| ENV     | Platform/Firebase owner          | Signed private staging/production denylist map, dedicated project/database/region/Auth/domain/OAuth, no resource overlap             | Phase 1D-B              |
| PROTECT | Vercel owner/security            | Project/protection coverage, tester roster, Git auto-build/hooks/branch policy verified, side-effect isolation                       | Phase 1D-B              |
| CONFIG  | Engineering/security             | Separately scoped staging-only implementation, compiled client/server target audit and token issuer/audience/egress evidence         | Before deployment       |
| RULES   | Firebase/security/legacy owner   | Deployed Rules/index export and compatibility deltas, target least privilege, release and rollback tuple                             | Phase 1D-B              |
| ROLE    | Access/security owner            | Five separate identities, editor/admin capability decision, admin preview, syariah duties, trusted provisioning/revoke audit         | Phase 1D-B              |
| DATA    | QA/access owner                  | Approved minimal synthetic fixtures and scope/expiry/revoke policy; no production account/data copy                                  | Phase 1D-B              |
| CONTENT | Curriculum/content/syariah owner | Exact one-lesson mapping/final asset/duration/rights/captions/versioned approval                                                     | Real playback/pilot     |
| MEDIA   | Content/QA owner                 | Approved video/domain, real desktop/mobile/negative-asset matrix and private evidence                                                | Real playback/pilot     |
| GOVERN  | Repository/Drive owner           | Private confidentiality findings, visibility/sharing/history/debug-log triage, mandatory PR/branch reviewer policy/CODEOWNERS roster | Before any push/sharing |
| DEP     | Dependency reviewer              | Four low cookie-derived entries; compatible remediation or dated bounded risk decision; no automatic major upgrade                   | Hosted/pilot            |
| OPS     | Operations/access owner          | RPO/RTO/retention, backup/restore/Rules/config/Auth/index/assets rollback, monitoring/incident ownership                             | Pilot/production        |
| RELEASE | Project owner                    | Signed approved exact Phase 1D-B plan and separate deployment instruction; bounded testers/purpose                                   | Hosted authorization    |

Read-only governance audit: repository visibility public verified. Local reachable-history pattern scan and tracked diagnostic/internal reports require private triage; no active credential validity was tested. Platform branch/ruleset and sharing details remain private. No confidentiality/security certification, policy change, history rewrite or secret rotation performed. Require security-reviewed PRs and protected release branch with owner-chosen reviewers; draft CODEOWNERS assignments only after roster approval.

Dependency audit exit1 retains four low entries, zero moderate/high/critical; cookie advisory propagates through Kit/adapters. [Advisory GHSA-pxg6-pf52-xh8x](https://github.com/advisories/GHSA-pxg6-pf52-xh8x). Lock unchanged. Exposure/production exploitability not established, OFF/local containment not remediation. No audit fix/major migration accepted. Existing lifecycle warnings and five placeholder-link check warnings remain recorded.

Deployed identity/Rules/index/protection and real content/account/playback approvals cannot be inferred from local PASS. Missing owner decisions do not prevent readiness handover, but they prevent hosted activity. Approval must identify actor, date, exact version/target and scope privately; no sensitive names or IDs in public register.
