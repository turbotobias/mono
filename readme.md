Draft for a typescript monorepo with bun, vite+rolldown, cloudflare

| Category | Technology |
|----------|------------|
| Scripts | bun |
| Workspaces | bun |
| Package manager | bun |
| TypeScript project references | update-ts-references |
| Bundle `/packages` | vite+rolldown |
| Bundle `/apps` | vite+rolldown |
| Bundle target | cloudflare |


Code organization

 `/packages/`
  - any source code (utilities, libraries, primitives, etc.).
  - never bundled

 `/apps/`
  - any to-be-shipped code (web, native, cli, etc.).
  - bundles directly from packages

----

`/configs`
- configs, scripts, etc.

`/deploys` (maybe)
- to easily replicate apps across prods
