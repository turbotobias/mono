Draft for a typescript monorepo with bun, vite+rolldown, cloudflare

| Category | Technology |
|----------|------------|
| Scripts | bun |
| Workspaces | bun |
| Package Manager | bun |
| TypeScript Project References | update-ts-references |
| Bundle Source | vite+rolldown |
| Bundle Outputs | vite+rolldown |
| Bundle Target | cloudflare |


Separate /sources and /outputs with strict boundaries, use .d.ts for type surfaces, and always bundle directly from source

Code Organization
- `/sources/`
Contains any source code (utilities, libraries, primitives, etc.).
Never bundled directly; only emits .d.ts files for outputs during development.

- `/outputs/`
Contains any to-be-shipped code (web, native, CLI, etc.).
Always bundles directly from sources.
User-facing bundles are built here.

- Maybe introduce /deploys to more easily replicate outputs (apps) across different production environments
