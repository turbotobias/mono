Draft for a vanillaer monorepo using bun, turbo, and typescript project references

- `/apps` are undled to be deployed
- `/packages` are not bundled to be deployed
- `/tooling` are not bundled nor deployed

| what | thing |
|----------|------------|
| scripts | bun |
| workspaces (+ catalogs) | bun |
| package manager | bun |
| tests | bun |
| typescript project references | update-ts-references |
| task orchestration | turbo |
