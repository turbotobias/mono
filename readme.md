Draft for a vanillaer typescript monorepo

- `/apps` deployable code (apps, infra, automations...)
- `/packages` source code (not pre-bundled (TS references instead))
- `/configs` internal code (anything not to be deployed (?))

| Category | Technology |
|----------|------------|
| Scripts | bun |
| Workspaces (+ catalogs) | bun |
| Package manager | bun |
| TypeScript project references | bunx update-ts-references |
| Task orchestration | turbo |
| Hosting | cloudflare |
