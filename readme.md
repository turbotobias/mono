Draft for a vanillaer monorepo using bun, turbo, and typescript project references

- `/apps` are bundled and to be deployed
- `/packages` are not bundled but to be deployed
- `/tools` are not bundled nor to be deployed

| what | thing |
|----------|------------|
| scripts | bun |
| workspaces (+ catalogs) | bun |
| package manager | bun |
| tests | bun |
| typescript project references | update-ts-references |
| task orchestration | turbo |
