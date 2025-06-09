Draft for a vanillaer monorepo using typescript project references, bun, and turbo

> see cursor rules in [monorepo.mdc](.cursor/rules/monorepo.mdc)

## Directory Structure

| Directory | Shippable | Bundled | Shared | Purpose |
|-----------|---------|---------- |---------|---------|
| `/apps`   | ✅      | ✅       | ⚪ | api, web, app
| `/packages` | ⚪    | ✅       | ✅ | utils, sdks, themes
| `/tools`  | ⚪      | ⚪      | ⚪ | configs, scripts
| `/templates` |⚪    | ⚪       | ⚪ | clonable templates


### How it works

Step by step for
#### Dependencies
#### Exports
#### Types
#### Build


| What | Thing |
|----------|------------|
| scripts | bun |
| workspaces (+ catalogs) | bun |
| package manager | bun |
| tests | bun |
| typescript project references | update-ts-references |
| task orchestration | turbo |
