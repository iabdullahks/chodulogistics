---
name: Admin/CMS session-auth pattern
description: DB-backed opaque session-token design used for a custom (non-Clerk) admin portal auth flow, and the permission-model shape that paired with it.
---

When a user asks for custom email/password admin auth with sessions "stored in our DB" (not Clerk, not JWT), the pattern that matched their intent literally:

- Random opaque token (e.g. 32-byte hex) is set in an httpOnly, `Secure`, cookie. Only its HMAC-SHA256 hash (keyed by a server secret, e.g. `SESSION_SECRET`) is stored server-side, in a `sessions` table joined to a `users`/`roles` table on each request. The raw token itself is never persisted.
- Role permissions modeled as a JSON map on the role row, e.g. `{"*": "write"}` for a super-admin wildcard, or per-module keys like `{"shipments":"write","leads":"read"}`. A `requirePermission(module, level)` middleware checks the wildcard first, then the specific module key.
- Every admin mutation writes a before/after snapshot to an `audit_logs` table (adminUserId, action, entityType, entityId, before, after) — cheap to add up front, and the user's brief implied "editable from admin" wants traceability.

**Why:** matches "stored in our DB" precisely (vs. a JWT which stores nothing server-side, or express-session/connect-pg-simple which is a different, heavier-weight convention) and gives clean audit/revocation semantics (delete the session row to invalidate).

**How to apply:** Reuse this shape whenever a project needs its own admin/CMS auth distinct from the main end-user auth system, especially when the user explicitly says sessions should live in "our" database.

Related environment fact: under Replit's path-based routing, an artifact's frontend (e.g. `/`) and its API server (e.g. `/api`) are same-origin from the browser's perspective, so the session cookie works with default `cors()` — no `credentials`/`SameSite` cross-origin configuration needed. The Replit preview proxy also rewrites Set-Cookie to `SameSite=None; Secure` regardless of what the app sets, to support iframe embedding — this is expected and not a bug in the app's cookie code.
