Draft for faster typescript lookup in a monorepo without pre-bundling

Because it's hard to read code when it takes seconds to see the word you're looking at

**Goals**
1. optimal builds
2. fastest type lookup
3. reliably (that is, javascript reliable)

**Code organisation**

- `/sources` projects that never bundle (only emits .d.ts for outputs)
- `/outputs` projects that always bundle (directly from sources)

**Why**

Achieving all three goals without constraints is unrealistic
- conventional apps/packages are separated by semantics (everything everywhere)
- sources/outputs are separated by constraints so we can reason about X without executing X (using types, not source, before build)

**/sources/**\**

- any source code (utils, libs, ...)
- consumed by outputs
- surfaces as .d.ts during dev (no .js)
- provided as .ts when bundled by outputs

**/outputs/**\**

- any app (web, watchos, mcp,..)
- bundles code from sources
- shipped to users (consider adding /deploys for this)

I simply want to write sources with barrell files:
```ts
// sources/time/src/get/now.ts
export const now = {
  day() {...},
  week() {...},
  month() {...}
}

// sources/time/src/index.ts
export * from "./get"

// sources/time/src/get/index.ts
export * from "./now"
```

And outputs having fast type-lookup:
```ts
// outputs/app/src/foo.ts
import { now } from "@sources/time"

// [instantly appearing suggestions]
now.
    day()
    week()
    month()
    ...
```

Without increasing bundle size or hurting performance, in a large but not super large codebase (6 figure LOC)

**Problems with this approach**

- Phantom errors from any misconfig of tsconfig → error on misconfig (?)
- Not reliable across bundlers → explicit support

**Verify if improvements are significant**
- 🟡 type-check time
- ⚪ IDE lookup latency
- ⚪ bundle size
- ⚪ bundle time
- ⚪ parity between sources and outputs
