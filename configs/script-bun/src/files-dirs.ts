import { readdir, stat } from "fs/promises"
import { join } from "path"

export const get_dirs_from_path = async (path: string): Promise<Array<string>> => {

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
