Draft for a vanillaer monorepo using typescript project references, bun, and turbo

- `/apps` are bundled and to be deployed
- `/packages` are not bundled and to be deployed
- `/tools` are not bundled nor to be deployed

| What | Thing |
|----------|------------|
| scripts | bun |
| workspaces (+ catalogs) | bun |
| package manager | bun |
| tests | bun |
| typescript project references | update-ts-references |
| task orchestration | turbo |
