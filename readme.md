
Faster typescript lookup in monorepo

Separate /sources and /outputs with strict boundaries, use .d.ts for type surfaces, and always bundle directly from source

Code Organization
- `/sources/`
Contains any source code (utilities, libraries, primitives, etc.).
Never bundled directly; only emits .d.ts files for outputs during development.

- `/outputs/`
Contains any to-be-shipped code (web, native, CLI, etc.).
Always bundles directly from sources.
User-facing bundles are built here.
Maybe introduce /deploys to more easily replicate apps across different production environments
