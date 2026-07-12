---
name: Object-storage skill quirks
description: Gotchas hit wiring the object-storage skill's templates into a pnpm-workspace project using zod v3 and TS project references.
---

- The OpenAPI `format: uri` on a string schema makes orval emit `zod.url()`, which only exists in zod v4. If the workspace pins zod v3 (`catalog:` entry), this fails `tsc --build` with "Property 'url' does not exist on type zod". Fix: drop `format: uri` and use a plain `type: string` for URL fields in the spec.
- The skill's `pnpm.overrides` snippet for React (`"react": "$react"`) only works if the root `package.json` itself lists `react` as a direct dependency. In a monorepo where React is only pulled in via workspace packages, this errors ("Cannot resolve version $react in overrides"). Check root `package.json` first; if it has no direct React dependency, skip the override — no conflict exists to override.
- A newly created lib package under TS project references (e.g. `object-storage-web`) needs `"composite": true`, `"declarationMap": true`, `"emitDeclarationOnly": true` in its own `tsconfig.json` (matching sibling lib packages), or `tsc --build` fails with "must have setting composite: true".
- If that lib only lists `react`/`@uppy/*` as `peerDependencies` (not `devDependencies`), pnpm won't link them into its own `node_modules`, so its local `tsc --build` fails with "Cannot find module 'react'" even though consumers have it. Add `react` (and any other type-checked peer) to `devDependencies` as `catalog:` so the package can typecheck standalone.

**Why:** these are easy to miss because each one only surfaces as a generic-looking TS/orval error with no direct pointer back to the object-storage skill.

**How to apply:** whenever following the object-storage skill's setup steps (OpenAPI → codegen → copy templates → wire into workspace), check these four points before assuming something is broken elsewhere.
