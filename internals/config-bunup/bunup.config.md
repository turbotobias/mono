# 1
```ts
const ws_sources = dirs_sources.map((dir) => ({
  name: dir,
  root: `sources/${dir}`,
  config: {
    entry: "src/index.ts",
    preferredTsconfigPath: "./tsconfig.json",
    // clean: true
    // dts: true,
    // external: ["valibot"]
    // format: ["esm"],
    // minifyIdentifiers: true,
    // minifySyntax: true,
    // minifyWhitespace: true,
    // minify: true
  }
} satisfies DefineWorkspaceItem))
```
CLI ⚡️ Build completed in 5ms
CJS dist/index.js    package-b

File          |    Size |    Gzip
------------- | ------- | -------
dist/index.js | 3.82 KB | 1.23 KB
------------- | ------- | -------
Total         | 3.82 KB | 1.23 KB

# 2
```ts
const ws_sources = dirs_sources.map((dir) => ({
  name: dir,
  root: `sources/${dir}`,
  config: {
    entry: "src/index.ts",
    preferredTsconfigPath: "./tsconfig.json",
    clean: true
    // dts: true,
    // external: ["valibot"]
    // format: ["esm"],
    // minifyIdentifiers: true,
    // minifySyntax: true,
    // minifyWhitespace: true,
    // minify: true
  }
} satisfies DefineWorkspaceItem))
```
CLI ⚡️ Build completed in 6ms

File          |    Size |    Gzip
------------- | ------- | -------
dist/index.js | 3.82 KB | 1.23 KB
------------- | ------- | -------
Total         | 3.82 KB | 1.23 KB

# 3
```ts
const ws_sources = dirs_sources.map((dir) => ({
  name: dir,
  root: `sources/${dir}`,
  config: {
    entry: "src/index.ts",
    preferredTsconfigPath: "./tsconfig.json",
    clean: true
    dts: true,
  }
} satisfies DefineWorkspaceItem))
```
CLI ⚡️ Build completed in 6ms

File           |    Size |  Gzip
-------------- | ------- | -----
dist/index.mjs | 1.74 KB | 587 B
-------------- | ------- | -----
Total          | 1.74 KB | 587 B

# 4
```ts
// ./bunup.config.ts
{
  name: dir,
  root: `sources/${dir}`,
  config: {
    entry: "src/index.ts",
    preferredTsconfigPath: "./tsconfig.json",
    clean: true,
    format: ["esm"],
    dts: true,
  }
} satisfies DefineWorkspaceItem
```
CLI ⚡️ Build completed in 24ms

File             |    Size |    Gzip
---------------- | ------- | -------
dist/index.mjs   | 1.74 KB |   587 B
dist/index.d.mts | 2.65 KB |   569 B
---------------- | ------- | -------
Total            | 4.39 KB | 1.13 KB

# 5
```ts
// ./bunup.config.ts
{
  name: dir,
  root: `sources/${dir}`,
  config: {
    entry: "src/index.ts",
    preferredTsconfigPath: "./tsconfig.json",
    clean: true,
    format: ["esm"],
    dts: true,
    minifyIdentifiers: true, // ~7% reduction
  }
} satisfies DefineWorkspaceItem
```
CLI ⚡️ Build completed in 13ms

File             |    Size |    Gzip
---------------- | ------- | -------
dist/index.mjs   | 1.57 KB |   612 B
dist/index.d.mts | 2.65 KB |   569 B
---------------- | ------- | -------
Total            | 4.22 KB | 1.15 KB

# 6
```ts
// ./bunup.config.ts
{
  name: dir,
  root: `sources/${dir}`,
  config: {
    entry: "src/index.ts",
    preferredTsconfigPath: "./tsconfig.json",
    clean: true,
    format: ["esm"],
    dts: true,
    minifySyntax: true, // ~5% reduction
  }
} satisfies DefineWorkspaceItem
```
CLI ⚡️ Build completed in 28ms
File             |    Size |    Gzip
---------------- | ------- | -------
dist/index.mjs   | 1.65 KB |   585 B
dist/index.d.mts | 2.65 KB |   569 B
---------------- | ------- | -------
Total            | 4.30 KB | 1.13 KB

# 7
```ts
// ./bunup.config.ts
{
  name: dir,
  root: `sources/${dir}`,
  config: {
    entry: "src/index.ts",
    preferredTsconfigPath: "./tsconfig.json",
    clean: true,
    format: ["esm"],
    dts: true,
    minifyWhitespace: true, // ~7% reduction
  }
} satisfies DefineWorkspaceItem
```
CLI ⚡️ Build completed in 14ms
File             |    Size |    Gzip
---------------- | ------- | -------
dist/index.mjs   | 1.53 KB |   540 B
dist/index.d.mts | 2.65 KB |   569 B
---------------- | ------- | -------
Total            | 4.18 KB | 1.08 KB

# 8
```ts
// ./bunup.config.ts
{
  name: dir,
  root: `sources/${dir}`,
  config: {
    entry: "src/index.ts",
    preferredTsconfigPath: "./tsconfig.json",
    clean: true,
    format: ["esm"],
    dts: true,
    minify: true // ~20% reduction
  }
} satisfies DefineWorkspaceItem
```
CLI ⚡️ Build completed in 27ms
DTS dist/index.d.mts    package-b

File             |    Size |    Gzip
---------------- | ------- | -------
dist/index.mjs   | 1.27 KB |   591 B
dist/index.d.mts | 2.65 KB |   569 B
---------------- | ------- | -------
Total            | 3.92 KB | 1.13 KB

# 9
```ts
// ./bunup.config.ts
{
  name: dir,
  root: `sources/${dir}`,
  config: {
    entry: "src/index.ts",
    preferredTsconfigPath: "./tsconfig.json",
    clean: true,
    format: ["esm"],
    dts: true,
    external: ["valibot"] // 0% reduction
  }
} satisfies DefineWorkspaceItem
```
CLI ⚡️ Build completed in 13ms
File             |    Size |    Gzip
---------------- | ------- | -------
dist/index.mjs   | 1.74 KB |   587 B
dist/index.d.mts | 2.65 KB |   569 B
---------------- | ------- | -------
Total            | 4.39 KB | 1.13 KB

