import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import { existsSync } from "fs"
import { mkdir, writeFile } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { delete_tmp_files } from "./delete-tmp-files-dirs"

describe("delete_tmp_files", () => {
    let test_dir: string
    let original_cwd: string

    beforeEach(async () => {
        original_cwd = process.cwd()
        test_dir = join(tmpdir(), `test-delete-${Date.now()}`)
        await mkdir(test_dir, { recursive: true })
    })

    afterEach(async () => {
        process.chdir(original_cwd)
        // Clean up test directory
        if (existsSync(test_dir)) {
            await Bun.$`rm -rf ${test_dir}`.quiet()
        }
    })

    it("should delete files from current directory by default", async () => {
        // Create test files
        await writeFile(join(test_dir, "test.tsbuildinfo"), "test")
        await writeFile(join(test_dir, "bun.lock"), "test")
        await writeFile(join(test_dir, "keep.txt"), "keep")

        process.chdir(test_dir)
        const result = await delete_tmp_files()

        expect(result.deleted_count).toBe(2)
        expect(existsSync(join(test_dir, "test.tsbuildinfo"))).toBe(false)
        expect(existsSync(join(test_dir, "bun.lock"))).toBe(false)
        expect(existsSync(join(test_dir, "keep.txt"))).toBe(true)
    })

    it("should delete files from specified directory", async () => {
        const sub_dir = join(test_dir, "subdir")
        await mkdir(sub_dir, { recursive: true })
        await writeFile(join(sub_dir, "test.tsbuildinfo"), "test")
        await writeFile(join(sub_dir, "keep.txt"), "keep")

        const result = await delete_tmp_files(sub_dir)

        expect(result.deleted_count).toBe(1)
        expect(existsSync(join(sub_dir, "test.tsbuildinfo"))).toBe(false)
        expect(existsSync(join(sub_dir, "keep.txt"))).toBe(true)
    })

    it("should traverse nested directories up to max depth", async () => {
        // Create nested structure: test_dir/1/2/3/4/5/
        let current_dir = test_dir
        for (let i = 1; i <= 5; i++) {
            current_dir = join(current_dir, i.toString())
            await mkdir(current_dir, { recursive: true })
            await writeFile(join(current_dir, "test.tsbuildinfo"), "test")
        }

        const result = await delete_tmp_files(test_dir)

        expect(result.deleted_count).toBe(5)
        // Verify all files were deleted
        current_dir = test_dir
        for (let i = 1; i <= 5; i++) {
            current_dir = join(current_dir, i.toString())
            expect(existsSync(join(current_dir, "test.tsbuildinfo"))).toBe(false)
        }
    })

    it("should respect max depth limit", async () => {
        // Create nested structure beyond max depth
        let current_dir = test_dir
        for (let i = 1; i <= 20; i++) {
            current_dir = join(current_dir, i.toString())
            await mkdir(current_dir, { recursive: true })
            await writeFile(join(current_dir, "test.tsbuildinfo"), "test")
        }

        const result = await delete_tmp_files(test_dir, { max_depth: 3 })

        // Should only delete files up to depth 3
        expect(result.deleted_count).toBe(3)

        // Verify files beyond depth 3 still exist
        let check_dir = test_dir
        for (let i = 1; i <= 4; i++) {
            check_dir = join(check_dir, i.toString())
            if (i <= 3) {
                expect(existsSync(join(check_dir, "test.tsbuildinfo"))).toBe(false)
            } else {
                expect(existsSync(join(check_dir, "test.tsbuildinfo"))).toBe(true)
            }
        }
    })

    it("should handle directories in delete list", async () => {
        const node_modules = join(test_dir, "node_modules")
        const dist = join(test_dir, "dist")

        await mkdir(node_modules, { recursive: true })
        await mkdir(dist, { recursive: true })
        await writeFile(join(node_modules, "package.json"), "test")
        await writeFile(join(dist, "index.js"), "test")

        const result = await delete_tmp_files(test_dir)

        expect(result.deleted_count).toBe(2)
        expect(existsSync(node_modules)).toBe(false)
        expect(existsSync(dist)).toBe(false)
    })

    it("should respect ignore list", async () => {
        await writeFile(join(test_dir, "dist"), "test")
        await writeFile(join(test_dir, "important.tsbuildinfo"), "test")

        const result = await delete_tmp_files(test_dir, {
            ignore_patterns: ["important.*"]
        })

        expect(result.deleted_count).toBe(1)
        expect(existsSync(join(test_dir, "dist"))).toBe(false)
        expect(existsSync(join(test_dir, "important.tsbuildinfo"))).toBe(true)
    })

    it("should handle non-existent directory gracefully", async () => {
        const non_existent = join(test_dir, "does-not-exist")

        const result = await delete_tmp_files(non_existent)

        expect(result.deleted_count).toBe(0)
        expect(result.errors).toHaveLength(1)
        expect(result.errors[0]).toContain("does-not-exist")
    })

    it("should handle permission errors gracefully", async () => {
        // Create a file and make it unreadable (if possible)
        const protected_file = join(test_dir, "protected.tsbuildinfo")
        await writeFile(protected_file, "test")

        // Try to make it unreadable (this might not work on all systems)
        try {
            await Bun.$`chmod 000 ${protected_file}`.quiet()
        } catch {
            // Skip this test if chmod fails (e.g., on Windows)
        }

        const result = await delete_tmp_files(test_dir)

        // Should not crash and should report errors
        expect(result.errors).toBeDefined()
        expect(Array.isArray(result.errors)).toBe(true)
    })

    it("should handle glob patterns in delete list", async () => {
        await writeFile(join(test_dir, "app.tsbuildinfo"), "test")
        await writeFile(join(test_dir, "lib.tsbuildinfo"), "test")
        await writeFile(join(test_dir, "keep.buildinfo"), "test")

        const result = await delete_tmp_files(test_dir)

        expect(result.deleted_count).toBe(2)
        expect(existsSync(join(test_dir, "app.tsbuildinfo"))).toBe(false)
        expect(existsSync(join(test_dir, "lib.tsbuildinfo"))).toBe(false)
        expect(existsSync(join(test_dir, "keep.buildinfo"))).toBe(true)
    })

    it("should provide detailed result information", async () => {
        await writeFile(join(test_dir, "test.tsbuildinfo"), "test")
        await mkdir(join(test_dir, "dist"), { recursive: true })

        const result = await delete_tmp_files(test_dir)

        expect(result.deleted_count).toBeGreaterThan(0)
        expect(result.deleted_paths).toBeDefined()
        expect(Array.isArray(result.deleted_paths)).toBe(true)
        expect(result.errors).toBeDefined()
        expect(Array.isArray(result.errors)).toBe(true)
        expect(result.scanned_directories).toBeGreaterThan(0)
    })

    it("should handle mixed file and directory patterns", async () => {
        // Create mix of files and directories
        await writeFile(join(test_dir, "bun.lock"), "test")
        await mkdir(join(test_dir, "node_modules"), { recursive: true })
        await mkdir(join(test_dir, ".turbo"), { recursive: true })
        await writeFile(join(test_dir, "package.json"), "keep")

        const result = await delete_tmp_files(test_dir)

        expect(result.deleted_count).toBe(3)
        expect(existsSync(join(test_dir, "bun.lock"))).toBe(false)
        expect(existsSync(join(test_dir, "node_modules"))).toBe(false)
        expect(existsSync(join(test_dir, ".turbo"))).toBe(false)
        expect(existsSync(join(test_dir, "package.json"))).toBe(true)
    })
})