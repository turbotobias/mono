
import { defineWorkspace } from "bunup"
import { readdir, stat } from "fs/promises"
import { join } from "path"
import { get_bunup_config } from "./bunup.config.utils"


const get_dirs_from_path = async (path: string): Promise<Array<string>> => {

  const entries = await readdir(path)
  const directories: string[] = []

  for (const entry of entries) {
    const fullPath = join(path, entry)
    const stats = await stat(fullPath)
    if (stats.isDirectory()) {
      directories.push(entry)
    }
  }

  return directories
}

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