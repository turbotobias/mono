import type { DefineWorkspaceItem } from "bunup"

export const get_bunup_config = ({ name, root, entry = "src/index.ts" }: { name: string, root: string, entry: string }): DefineWorkspaceItem => ({
  name,
  root,
  config: {
    entry,
    format: ["esm"],
    dts: true,
    sourcemap: "linked", // +4% increase in size
  }
})
