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
  - any source code (utilities, libraries, primitives, etc.).
  - never bundled

 `/outputs/`
  - any to-be-shipped code (web, native, cli, etc.).
  - bundles directly from sources

----

`/internals`
- configs, scripts, etc.

`/deploys` (maybe)
- to easily replicate apps across prods
