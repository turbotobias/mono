import { get_dirs_from_path } from "@mono/script-bun"
import { defineWorkspace } from "bunup"
import { get_bunup_config } from "./bunup.config.utils"

const [dirs_sources, dirs_outputs] = await Promise.all([
  get_dirs_from_path("./sources"),
  get_dirs_from_path("./outputs")
])

const ws_sources = dirs_sources.map((dir) => get_bunup_config({
  name: dir,
  root: `sources/${dir}`,
  entry: "src/index.ts",
}))

const ws_outputs = dirs_outputs.map((dir) => get_bunup_config({
  name: dir,
  root: `outputs/${dir}`,
  entry: "src/index.ts",
}))

export default defineWorkspace([...ws_sources, /** ...ws_outputs */])
