#!/usr/bin/env bun

import { existsSync, cpSync, rmSync, readdirSync } from "fs";
import { join } from "path";
import { $ } from "bun";

const SOURCE_DIR = "sources/package-a";
const SOURCES_DIR = "sources";
const CLONE_PREFIX = "package-a-clone-";

/**
 * Parse command line arguments
 */
function parseArguments(args: string[]) {
  const cleanFlags = ["-c", "--clean"];
  const hasCleanFlag = args.some(arg => cleanFlags.includes(arg));

  if (hasCleanFlag) {
    // Ensure no mixed arguments
    const nonCleanArgs = args.filter(arg => !cleanFlags.includes(arg));
    if (nonCleanArgs.length > 0) {
      throw new Error("Clean flag cannot be used with other arguments");
    }
    return { action: "clean" as const };
  }

  if (args.length === 0) {
    throw new Error("Number of clones required or use -c/--clean flag");
  }

  if (args.length > 1) {
    throw new Error("Too many arguments. Provide only the number of clones or use -c/--clean flag");
  }

  const numStr = args[0];
  const num = parseInt(numStr, 10);

  if (isNaN(num)) {
    throw new Error(`Invalid number: ${numStr}`);
  }

  if (num < 0) {
    throw new Error("Number of clones cannot be negative");
  }

  return { action: "clone" as const, count: num };
}

/**
 * Find all existing clone directories
 */
function findExistingClones(): string[] {
  if (!existsSync(SOURCES_DIR)) {
    return [];
  }

  return readdirSync(SOURCES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => name.startsWith(CLONE_PREFIX))
    .map(name => join(SOURCES_DIR, name));
}

/**
 * Clean all existing clone directories
 */
async function cleanClones(): Promise<void> {
  const existingClones = findExistingClones();

  if (existingClones.length === 0) {
    console.log("No clone directories found to clean");
    return;
  }

  console.log(`Removing ${existingClones.length} clone directories...`);

  for (const cloneDir of existingClones) {
    try {
      rmSync(cloneDir, { recursive: true, force: true });
      console.log(`Removed: ${cloneDir}`);
    } catch (error) {
      console.error(`Failed to remove ${cloneDir}:`, error);
      throw error;
    }
  }

  console.log("Clean completed successfully");
}

/**
 * Create n clone directories
 */
async function createClones(count: number): Promise<void> {
  if (count === 0) {
    console.log("No clones to create");
    return;
  }

  // Verify source directory exists
  if (!existsSync(SOURCE_DIR)) {
    throw new Error(`Source directory does not exist: ${SOURCE_DIR}`);
  }

  console.log(`Creating ${count} clone(s) of ${SOURCE_DIR}...`);

  for (let i = 1; i <= count; i++) {
    const cloneName = `${CLONE_PREFIX}${i}`;
    const clonePath = join(SOURCES_DIR, cloneName);

    try {
      // Remove existing clone if it exists to ensure clean copy
      if (existsSync(clonePath)) {
        rmSync(clonePath, { recursive: true, force: true });
        console.log(`Removed existing: ${clonePath}`);
      }

      // Copy the source directory
      cpSync(SOURCE_DIR, clonePath, {
        recursive: true,
        force: true,
        preserveTimestamps: true
      });

      console.log(`Created: ${clonePath}`);
    } catch (error) {
      console.error(`Failed to create clone ${i}:`, error);
      throw error;
    }
  }

  console.log(`Clone creation completed successfully`);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    const parsed = parseArguments(args);

    if (parsed.action === "clean") {
      await cleanClones();
    } else {
      await createClones(parsed.count);
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the main function if this script is executed directly
if (import.meta.main) {
  await main();
}