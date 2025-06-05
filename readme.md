Draft for a vanillaer typescript monorepo

- `/apps` to be deployed
- `/packages` source code (TS references)
- `/tooling` internal config, scripts, etc.

| what | thing |
|----------|------------|
| scripts | bun |
| workspaces (+ catalogs) | bun |
| package manager | bun |
| tests | bun |
| typescript project references | update-ts-references |
| task orchestration | turbo |
| hosting | cloudflare |
