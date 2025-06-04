import { get_dirs_from_path } from "@mono/script-bun"
import { defineWorkspace } from "bunup"
import { get_bunup_config } from "./bunup.config.utils"

const [dirs_packages, dirs_apps] = await Promise.all([
  get_dirs_from_path("./packages"),
  get_dirs_from_path("./apps")
])

const ws_packages = dirs_packages.map((dir) => get_bunup_config({
  name: dir,
  root: `packages/${dir}`,
  entry: "src/index.ts",
}))

const ws_apps = dirs_apps.map((dir) => get_bunup_config({
  name: dir,
  root: `apps/${dir}`,
  entry: "src/index.ts",
}))

export const ws = defineWorkspace([...ws_packages, /** ...ws_apps */])

export default ws