import { defineWorkspace, type DefineWorkspaceItem } from "bunup"
import { get_dirs_from_path } from "./__scripts/files-dirs"

const [dirs_sources, dirs_outputs] = await Promise.all([
  get_dirs_from_path("./sources"),
  get_dirs_from_path("./outputs")
])

console.log("Directory names in /sources:", dirs_sources)
console.log("Directory names in /outputs:", dirs_outputs)

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

export default defineWorkspace(ws_sources)
