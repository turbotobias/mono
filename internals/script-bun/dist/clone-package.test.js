import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync } from "fs";
import path from "path";
import { $ } from "bun";
describe("clone-package script", () => {
    const sourceDir = "sources/package-a";
    const testClones = ["sources/package-a-clone-1", "sources/package-a-clone-2", "sources/package-a-clone-3"];
    beforeEach(async () => {
        // Clean up any existing test clones
        for (const clone of testClones) {
            if (existsSync(clone)) {
                rmSync(clone, { recursive: true, force: true });
            }
        }
    });
    afterEach(async () => {
        // Clean up test clones after each test
        for (const clone of testClones) {
            if (existsSync(clone)) {
                rmSync(clone, { recursive: true, force: true });
            }
        }
    });
    it("should clone package-a directory n times with correct naming", async () => {
        const result = await $ `bun clone-package.ts 3`.quiet();
        expect(result.exitCode).toBe(0);
        expect(existsSync("sources/package-a-clone-1")).toBe(true);
        expect(existsSync("sources/package-a-clone-2")).toBe(true);
        expect(existsSync("sources/package-a-clone-3")).toBe(true);
        // Verify directory contents are copied correctly
        expect(existsSync("sources/package-a-clone-1/src/index.ts")).toBe(true);
        expect(existsSync("sources/package-a-clone-1/tsconfig.json")).toBe(true);
        expect(existsSync("sources/package-a-clone-2/src/index.ts")).toBe(true);
        expect(existsSync("sources/package-a-clone-3/src/index.ts")).toBe(true);
    });
    it("should clean all cloned directories with -c flag", async () => {
        // First create some clones
        await $ `bun clone-package.ts 2`.quiet();
        expect(existsSync("sources/package-a-clone-1")).toBe(true);
        expect(existsSync("sources/package-a-clone-2")).toBe(true);
        // Then clean them
        const result = await $ `bun clone-package.ts -c`.quiet();
        expect(result.exitCode).toBe(0);
        expect(existsSync("sources/package-a-clone-1")).toBe(false);
        expect(existsSync("sources/package-a-clone-2")).toBe(false);
    });
    it("should clean all cloned directories with --clean flag", async () => {
        // First create some clones
        await $ `bun clone-package.ts 2`.quiet();
        expect(existsSync("sources/package-a-clone-1")).toBe(true);
        expect(existsSync("sources/package-a-clone-2")).toBe(true);
        // Then clean them
        const result = await $ `bun clone-package.ts --clean`.quiet();
        expect(result.exitCode).toBe(0);
        expect(existsSync("sources/package-a-clone-1")).toBe(false);
        expect(existsSync("sources/package-a-clone-2")).toBe(false);
    });
    it("should handle zero clones gracefully", async () => {
        const result = await $ `bun clone-package.ts 0`.quiet();
        expect(result.exitCode).toBe(0);
        // No directories should be created
        expect(existsSync("sources/package-a-clone-1")).toBe(false);
    });
    it("should handle invalid arguments gracefully", async () => {
        try {
            await $ `bun clone-package.ts invalid`.quiet();
            expect(false).toBe(true); // Should not reach here
        }
        catch (error) {
            expect(error.exitCode).toBe(1);
            expect(error.stderr.toString()).toContain("Invalid number");
        }
    });
    it("should handle negative numbers gracefully", async () => {
        try {
            await $ `bun clone-package.ts -5`.quiet();
            expect(false).toBe(true); // Should not reach here
        }
        catch (error) {
            expect(error.exitCode).toBe(1);
            expect(error.stderr.toString()).toContain("cannot be negative");
        }
    });
    it("should handle no arguments gracefully", async () => {
        try {
            await $ `bun clone-package.ts`.quiet();
            expect(false).toBe(true); // Should not reach here
        }
        catch (error) {
            expect(error.exitCode).toBe(1);
            expect(error.stderr.toString()).toContain("Number of clones required");
        }
    });
    it("should handle large number of clones efficiently", async () => {
        const largeNumber = 10;
        const result = await $ `bun clone-package.ts ${largeNumber}`.quiet();
        expect(result.exitCode).toBe(0);
        // Verify all directories were created
        for (let i = 1; i <= largeNumber; i++) {
            expect(existsSync(`sources/package-a-clone-${i}`)).toBe(true);
            expect(existsSync(`sources/package-a-clone-${i}/src/index.ts`)).toBe(true);
        }
        // Clean up
        await $ `bun clone-package.ts -c`.quiet();
        // Verify all were cleaned
        for (let i = 1; i <= largeNumber; i++) {
            expect(existsSync(`sources/package-a-clone-${i}`)).toBe(false);
        }
    });
    it("should handle missing source directory gracefully", async () => {
        // Temporarily rename the source directory
        if (existsSync(sourceDir)) {
            await $ `mv ${sourceDir} ${sourceDir}-temp`.quiet();
        }
        try {
            try {
                await $ `bun clone-package.ts 1`.quiet();
                expect(false).toBe(true); // Should not reach here
            }
            catch (error) {
                expect(error.exitCode).toBe(1);
                expect(error.stderr.toString()).toContain("Source directory does not exist");
            }
        }
        finally {
            // Restore the source directory
            if (existsSync(`${sourceDir}-temp`)) {
                await $ `mv ${sourceDir}-temp ${sourceDir}`.quiet();
            }
        }
    });
    it("should handle existing clone directories appropriately", async () => {
        // Create a clone manually
        await $ `mkdir -p sources/package-a-clone-1`.quiet();
        // Try to create clones - should handle existing directory gracefully
        const result = await $ `bun clone-package.ts 2`.quiet();
        expect(result.exitCode).toBe(0);
        // Should still create the second clone
        expect(existsSync("sources/package-a-clone-2")).toBe(true);
    });
    it("should preserve file contents correctly", async () => {
        await $ `bun clone-package.ts 1`.quiet();
        const originalContent = await Bun.file("sources/package-a/src/index.ts").text();
        const clonedContent = await Bun.file("sources/package-a-clone-1/src/index.ts").text();
        expect(clonedContent).toBe(originalContent);
    });
    it("should handle clean flag when no clones exist", async () => {
        // Ensure no clones exist
        for (const clone of testClones) {
            if (existsSync(clone)) {
                rmSync(clone, { recursive: true, force: true });
            }
        }
        const result = await $ `bun clone-package.ts -c`.quiet();
        expect(result.exitCode).toBe(0); // Should not error
    });
    it("should handle mixed arguments gracefully", async () => {
        // Should reject mixed clean and number arguments
        try {
            await $ `bun clone-package.ts -c 5`.quiet();
            expect(false).toBe(true); // Should not reach here
        }
        catch (error) {
            expect(error.exitCode).toBe(1);
            expect(error.stderr.toString()).toContain("Clean flag cannot be used with other arguments");
        }
    });
});
