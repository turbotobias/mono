Draft for a typescript monorepo with bun, vite+rolldown, cloudflare

| Category | Technology |
|----------|------------|
| Scripts | bun |
| Workspaces | bun |
| Package manager | bun |
| TypeScript project references | update-ts-references |
| Bundle `/sources` | vite+rolldown |
| Bundle `/outputs` | vite+rolldown |
| Bundle target | cloudflare |


Code organization

 `/sources/`
  - Contains any source code (utilities, libraries, primitives, etc.).
  - Never bundled directly; only emits .d.ts files for outputs during development.

 `/outputs/`
  - Contains any to-be-shipped code (web, native, CLI, etc.).
  - Always bundles directly from sources.
  - User-facing bundles are built here.

----

`/internals`
- configs, scripts, etc.

`/deploys` (maybe)
- to more easily replicate outputs (apps) across different production environments
