import { existsSync } from "fs"
import { lstat, readdir } from "fs/promises"
import { minimatch } from "minimatch"
import { basename, join, resolve } from "path"
import trash from "trash"


const DEFAULT_DELETE_PATTERNS = [
    ".turbo",
    ".wrangler",
    "*.tsbuildinfo",
    "bun.lock",
    "dist",
    "node_modules",
]

// never delete these files
const DEFAULT_IGNORE_PATTERNS = [
    ".git",
    ".env*"
]

type TDeleteOptions = {
    max_depth?: number
    delete_patterns?: string[]
    ignore_patterns?: string[]
    dry_run?: boolean
}

type TDeleteResult = {
    deleted_count: number
    deleted_paths: string[]
    errors: string[]
    scanned_directories: number
}

/**
 * matches pattern against filename or directory name
 */
function matches_pattern(name: string, patterns: string[]): boolean {
    return patterns.some(pattern => minimatch(name, pattern))
}

/**
 * recursively scan directory for files and directories to delete
 */
async function scan_directory(
    dir_path: string,
    options: TDeleteOptions,
    current_depth: number = 0
): Promise<{ to_delete: string[], scanned_dirs: number }> {
    const max_depth = options.max_depth ?? 15
    const delete_patterns = options.delete_patterns ?? DEFAULT_DELETE_PATTERNS
    const ignore_patterns = options.ignore_patterns ?? DEFAULT_IGNORE_PATTERNS

    if (current_depth > max_depth) {
        return { to_delete: [], scanned_dirs: 0 }
    }

    let to_delete: string[] = []
    let scanned_dirs = 1

    try {
        if (!existsSync(dir_path)) {
            throw new Error(`Directory does not exist: ${dir_path}`)
        }

        const entries = await readdir(dir_path)

        for (const entry of entries) {
            const entry_path = join(dir_path, entry)
            const entry_name = basename(entry_path)

            // Skip if matches ignore patterns
            if (matches_pattern(entry_name, ignore_patterns)) {
                continue
            }

            try {
                const entry_stat = await lstat(entry_path)

                // Check if this entry should be deleted
                if (matches_pattern(entry_name, delete_patterns)) {
                    to_delete.push(entry_path)
                    continue // Don't recurse into directories we're going to delete
                }

                // Recurse into subdirectories (but not symlinks to avoid loops)
                if (entry_stat.isDirectory() && !entry_stat.isSymbolicLink()) {
                    const sub_result = await scan_directory(entry_path, options, current_depth + 1)
                    to_delete.push(...sub_result.to_delete)
                    scanned_dirs += sub_result.scanned_dirs
                }
            } catch (error) {
                // Skip entries that can't be accessed
                continue
            }
        }
    } catch (error) {
        throw error
    }

    return { to_delete, scanned_dirs }
}

/**
 * delete temporary files and directories from specified path
 */
export async function delete_tmp_files(
    target_path?: string,
    options: TDeleteOptions = {}
): Promise<TDeleteResult> {
    const start_path = target_path ? resolve(target_path) : process.cwd()
    const result: TDeleteResult = {
        deleted_count: 0,
        deleted_paths: [],
        errors: [],
        scanned_directories: 0
    }

    try {
        const scan_result = await scan_directory(start_path, options)
        result.scanned_directories = scan_result.scanned_dirs

        if (scan_result.to_delete.length === 0) {
            return result
        }

        if (options.dry_run) {
            result.deleted_paths = scan_result.to_delete
            result.deleted_count = scan_result.to_delete.length
            return result
        }

        // Delete files and directories
        await trash(scan_result.to_delete)

        result.deleted_count = scan_result.to_delete.length
        result.deleted_paths = scan_result.to_delete

    } catch (error) {
        const error_message = error instanceof Error ? error.message : String(error)
        result.errors.push(error_message)
    }

    return result
}

/**
 * main function when script is run directly
 */
async function main() {
    const args = process.argv.slice(2)

    // Handle help
    if (args.includes("--help") || args.includes("-h")) {
        console.log(`
🧹 Delete Temporary Files & Directories

Usage:
  bun delete-tmp-files-dirs.ts [path] [options]

Arguments:
  path          Target directory to clean (default: current directory)
                Use "." for current directory

Options:
  --help, -h    Show this help message
  --dry-run     Show what would be deleted without actually deleting
  --max-depth   Maximum directory depth to traverse (default: 15)

Examples:
  bun delete-tmp-files-dirs.ts .                    # Clean current directory
  bun delete-tmp-files-dirs.ts src/tmp/             # Clean specific directory
  bun delete-tmp-files-dirs.ts --dry-run            # Preview what would be deleted
  bun delete-tmp-files-dirs.ts . --max-depth 5      # Limit depth to 5 levels

Default patterns deleted:
  - *.tsbuildinfo (TypeScript build info)
  - .turbo (Turbo cache)
  - node_modules (Node.js modules)
  - dist (Build outputs)
  - bun.lock (Bun lockfiles)
  - .next, .nuxt (Framework caches)
  - coverage, .nyc_output (Test coverage)
  - *.log (Log files)

Always ignored:
  - .git (Git repository)
  - .env* (Environment files)
  - package.json (Package definitions)
  - *.config.* (Configuration files)
  - README*, LICENSE* (Documentation)
`)
        return
    }

    // Parse arguments
    const target_path = args.find(arg => !arg.startsWith("--")) ?? process.cwd()
    const dry_run = args.includes("--dry-run")
    const max_depth_arg = args.find(arg => arg.startsWith("--max-depth"))
    const max_depth = max_depth_arg ? parseInt(max_depth_arg.split("=")[1] ?? "15") : 15

    try {
        const result = await delete_tmp_files(target_path === "." ? process.cwd() : target_path, {
            dry_run,
            max_depth
        })

        if (result.errors.length > 0) {
            console.error("❌ Errors occurred:")
            result.errors.forEach(error => console.error(`  ${error}`))
        }

        if (dry_run) {
            if (result.deleted_count > 0) {
                console.log(`🔍 Would delete ${result.deleted_count} files and directories:`)
                result.deleted_paths.forEach(path => console.log(`  ${path}`))
            } else {
                console.log("✨ No temporary files found to delete")
            }
            console.log(`📁 Scanned ${result.scanned_directories} directories`)
        } else {
            if (result.deleted_count > 0) {
                console.log(`✔️ Deleted ${result.deleted_count} files and directories`)
                console.log(`📁 Scanned ${result.scanned_directories} directories`)
            } else {
                console.log("✨ No temporary files found to delete")
                console.log(`📁 Scanned ${result.scanned_directories} directories`)
            }
        }

    } catch (error) {
        console.error("❌ Fatal error:", error instanceof Error ? error.message : String(error))
        process.exit(1)
    }
}

// Run main function if script is executed directly
if (import.meta.main) {
    await main()
}