# Memory Index

- [Drizzle-orm duplicate instance typecheck errors](drizzle-dedupe.md) — pnpm hoisting can create two drizzle-orm copies with incompatible private types; `pnpm dedupe` fixes it.
- [Admin/CMS session-auth pattern](admin-session-auth.md) — DB-backed opaque session token design used for the CHODU Logistics admin portal; reusable pattern for future custom admin auth.
- [Object-storage skill quirks](object-storage-quirks.md) — orval `format: uri` breaks zod v3 codegen; new lib packages need `composite: true` + a real `react` devDependency to build under project references.
- [CHODU Admin Rate Confirmations](chodu-admin-rate-confirmations.md) — standalone CRUD + print-only route pattern for "generate a document/PDF" features; temp-admin-user trick for verifying authenticated flows.
