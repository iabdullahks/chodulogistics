---
name: Drizzle-orm duplicate instance typecheck errors
description: pnpm can install two copies of drizzle-orm with different peer-dependency contexts, causing TS2345/TS2769 "private property shouldInlineParams" errors across unrelated files.
---

In this pnpm monorepo, a package (e.g. an API server) that imports `drizzle-orm` directly alongside a workspace `db` package that also depends on `pg`/`@types/pg` can end up with two separate `drizzle-orm@<version>` installs in `.pnpm` — one plain, one suffixed with `_@types+pg@...`. TypeScript treats these as structurally different types (private field `shouldInlineParams` differs), so `eq()`, `and()`, etc. imported in one package fail to type-check against columns/tables imported from the other package, even though versions match exactly.

**Why:** pnpm's peer-dependency-aware install can create multiple isolated contexts for the "same" package instead of hoisting a single copy, especially after adding a new dependency (e.g. bcryptjs) shifts the dependency graph.

**How to apply:** If you see `SQL<unknown>` "not assignable" errors mentioning duplicate `drizzle-orm@<ver>` paths in `.pnpm`, don't rewrite the query code — run `pnpm dedupe` at the workspace root, then re-run typecheck. This has resolved it every time so far.
