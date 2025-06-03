import type { DefineWorkspaceItem } from "bunup"
import { get_bunup_config } from "@/config-bunup"

export const config: DefineWorkspaceItem = get_bunup_config({
  entry: "src/index.ts",
  name: "app-1",
  root: ".",
})

export default config
