---
name: CHODU Admin Rate Confirmation feature
description: How the Rate Confirmation generator (form + printable document) is built and verified in chodu-admin/api-server.
---

- Rate Confirmation is its own CRUD resource (`rateConfirmationsTable` in `lib/db/src/schema/rate-confirmations.ts`, `/admin/rate-confirmations` routes), not tied to Loads — it was built standalone since the user only supplied UI reference screenshots, not a data-linking requirement.
- The "generate PDF" requirement was implemented as a dedicated print-only route (`/rate-confirmations/:id/print`) rendering a light-themed, letterhead-style document and calling `window.print()` — no PDF library dependency. This is the default pattern to reuse for future "generate a document/PDF" asks in this app.
- To visually verify authenticated admin flows when no real credentials exist, insert a temporary admin_users row via SQL with a bcrypt hash (Super Admin role_id) for the testing subagent to log in with, then delete both the temp user and any test records it created immediately after.
