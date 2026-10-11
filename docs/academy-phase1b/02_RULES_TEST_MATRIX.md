# Phase 1B — candidate Rules test matrix

**CANDIDATE RULES VERIFIED LOCALLY — DEPLOYED RULES NOT VERIFIED**

Final candidate file SHA-256: `37c4c699fe191960146f3241bac527acecb8858e4c71d5ac77d68ce5cafd3d6c`.

`tests/academy.rules.ts` loads `firebase/academy-v1.rules` into the fixed demo emulator. `tests/academy-fixtures.ts` provides guarded setup, actual Auth accounts, scoped fixture grants and protected application publishing operations. Loading/compilation must succeed before fixture clearing; there is no user allow-all fallback. Project mismatch and missing services stop before setup.

Command: `node scripts/run-local.mjs test:rules`; final exit 0. 86 PASS, 0 FAIL, 0 BLOCKED, 0 skipped. Six parent nodes plus 72 role subcases and eight additional tests are counted by Node. Every forbidden SDK operation asserts `code === permission-denied`; network/validation harness failures cannot pass that assertion. Positive operations resolve and data is checked. Five additional tests use actual Auth credentials, the application's client factory, fresh Firestore Lite reads and logout denial, rather than mocked Rule claims alone.

| Actor          | Published query/get | Editorial draft | Private known ID scope A         | Private scope B                  | Restricted listing | Own profile update | Own valid progress write  | Grant/CMS authority                     |
| -------------- | ------------------- | --------------- | -------------------------------- | -------------------------------- | ------------------ | ------------------ | ------------------------- | --------------------------------------- |
| Guest          | Allow               | Deny            | Deny                             | Deny                             | Deny               | Deny               | Deny                      | Deny                                    |
| No grant       | Allow               | Deny            | Deny                             | Deny                             | Deny               | Allow bounded      | Deny                      | Deny                                    |
| Active A       | Allow               | Deny            | Allow                            | Deny                             | Deny               | Allow bounded      | Allow bounded             | Deny                                    |
| Expired A      | Allow               | Deny            | Deny                             | Deny                             | Deny               | Allow bounded      | Deny                      | Deny                                    |
| Revoked A      | Allow               | Deny            | Deny                             | Deny                             | Deny               | Allow bounded      | Deny                      | Deny                                    |
| Verified admin | Allow               | Allow           | Allow explicit management policy | Allow explicit management policy | Deny               | Own bounded only   | Deny without member grant | Allow only valid role/schema/audit path |

All cells above were observed as expected. Catalog queries return only the three published fixture lessons, with exact public keys and no private reference. Unconstrained catalog queries and known unpublished IDs deny. Full and scope-filtered private collection queries deny, even for admin.

Additional negative assertions cover cross-user profiles/progress/grants, users collection listing, complete unauthorized grant creation, direct grant creation without audit, profile email/role/subscription/approval/entitlement forgery, legacy collection get/query, order approval and voucher mutation. Cross-user progress remains denied to admin. Own historical progress and own grant queries remain readable for authenticated users; history never gives media access.

Protected admin CRUD, grant/revoke and append-only audits succeed. Publishing directly from draft, changing approved media, stale expected versions, approval for the wrong version, unconfirmed rights, missing audit, private scope/video mutation and private fields added to catalog deny. Unverified admin, an admin-looking email, publisher-only editing/grants, editor-only approval and reviewer-only publishing deny. Required syariah approval requires the additional trusted claim. Distinct reviewer/publisher paths succeed with their corresponding roles.

The nine `test_*` Rules cases from Phase 1A are retained as historical fixture code; they are not this matrix and are not loaded by the Phase 1B emulator configuration or npm Rules command. Neither suite is a comparison with deployed production Rules, which have not been obtained.

Emulator limitations: unsigned Auth test tokens, synthetic role provisioning, no production IAM/provider/domain/revocation certification, and no proof of deployed indexes/query performance. An already received full-SDK listener result can remain available; it is not fresh authorization evidence. Actual player private reads use the uncached Lite SDK and fresh expiry/revoke denial is also asserted in the browser suite. Public/shared source and old cached video IDs are not DRM.

Primary references: [Rules testing](https://firebase.google.com/docs/rules/unit-tests), [atomic validation with getAfter](https://firebase.google.com/docs/firestore/manage-data/transactions), [Firestore Lite server reads](https://firebase.google.com/docs/reference/js/firestore_lite), [Auth emulator limitations](https://firebase.google.com/docs/emulator-suite/connect_auth).
