import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { parse } from "comment-json";
import * as fs from "fs";
import * as path from "path";
import { execute } from "./update-ts-references.lib.js";

// Test workspace setup
const testWorkspaceDir = path.join(process.cwd(), "test-workspace");
const cleanup = () => {
  if (fs.existsSync(testWorkspaceDir)) {
    fs.rmSync(testWorkspaceDir, { recursive: true, force: true });
  }
};

const createTestWorkspace = () => {
  // Create test workspace structure
  const dirs = [
    "packages/pkg-a/src",
    "packages/pkg-b/src",
    "packages/pkg-c/src",
    "external-lib"
  ];

  dirs.forEach(dir => {
    fs.mkdirSync(path.join(testWorkspaceDir, dir), { recursive: true });
  });

  // Root package.json with workspaces
  fs.writeFileSync(path.join(testWorkspaceDir, "package.json"), JSON.stringify({
    name: "test-monorepo",
    workspaces: ["packages/*"],
    private: true
  }, null, 2));

  // Package A - depends on B and external lib
  fs.writeFileSync(path.join(testWorkspaceDir, "packages/pkg-a/package.json"), JSON.stringify({
    name: "pkg-a",
    main: "./src/index.ts",
    dependencies: {
      "pkg-b": "workspace:*",
      "external-lib": "file:../../external-lib"
    }
  }, null, 2));

  // Package B - standalone
  fs.writeFileSync(path.join(testWorkspaceDir, "packages/pkg-b/package.json"), JSON.stringify({
    name: "pkg-b",
    main: "./src/index.ts"
  }, null, 2));

  // Package C - depends on A
  fs.writeFileSync(path.join(testWorkspaceDir, "packages/pkg-c/package.json"), JSON.stringify({
    name: "pkg-c",
    main: "./src/index.ts",
    dependencies: {
      "pkg-a": "workspace:*"
    }
  }, null, 2));

  // External lib package.json
  fs.writeFileSync(path.join(testWorkspaceDir, "external-lib/package.json"), JSON.stringify({
    name: "external-lib",
    main: "./index.ts"
  }, null, 2));

  // External lib tsconfig
  fs.writeFileSync(path.join(testWorkspaceDir, "external-lib/tsconfig.json"), JSON.stringify({
    compilerOptions: {
      target: "ES2020",
      module: "commonjs"
    }
  }, null, 2));
};

const createTsConfig = (packagePath: string, existingReferences: any[] = []) => {
  const tsconfig = {
    extends: "../../tsconfig.base.json",
    compilerOptions: {
      outDir: "dist",
      rootDir: "src"
    },
    references: existingReferences
  };

  fs.writeFileSync(path.join(testWorkspaceDir, packagePath, "tsconfig.json"), JSON.stringify(tsconfig, null, 2));
};

describe("update-ts-references with ignore paths support", () => {
  beforeEach(() => {
    cleanup();
    createTestWorkspace();
  });

  afterEach(() => {
    cleanup();
  });

  it("should preserve references in ignoreReferencePaths", async () => {
    // Setup: pkg-a has reference to pkg-b and external lib
    createTsConfig("packages/pkg-a", [
      { path: "../pkg-b" },
      { path: "../../external-lib" }
    ]);
    createTsConfig("packages/pkg-b");
    createTsConfig("packages/pkg-c");

    const options = {
      configName: "tsconfig.json",
      rootConfigName: "tsconfig.json",
      withoutRootConfig: true,
      createTsConfig: false,
      cwd: testWorkspaceDir,
      verbose: false,
      help: false,
      check: false,
      createPathMappings: false,
      usecase: "update-ts-references.yaml",
      strict: false,
      ignoreReferencePaths: ["../../external-lib"]
    };

    await execute(options);

    // Verify pkg-a still has both references
    const pkgAConfig = parse(fs.readFileSync(path.join(testWorkspaceDir, "packages/pkg-a/tsconfig.json"), "utf8")) as any;
    expect(pkgAConfig.references).toHaveLength(2);

    const referencePaths = pkgAConfig.references.map((ref: any) => ref.path);
    expect(referencePaths).toContain("../pkg-b");
    expect(referencePaths).toContain("../../external-lib");
  });

  it("should remove non-workspace references not in ignore list", async () => {
    // Setup: pkg-a has reference to pkg-b and external lib, but external lib not in ignore list
    createTsConfig("packages/pkg-a", [
      { path: "../pkg-b" },
      { path: "../../external-lib" },
      { path: "../../some-other-lib" }
    ]);
    createTsConfig("packages/pkg-b");

    const options = {
      configName: "tsconfig.json",
      rootConfigName: "tsconfig.json",
      withoutRootConfig: true,
      createTsConfig: false,
      cwd: testWorkspaceDir,
      verbose: false,
      help: false,
      check: false,
      createPathMappings: false,
      usecase: "update-ts-references.yaml",
      strict: false,
      ignoreReferencePaths: ["../../external-lib"] // only preserve this one
    };

    await execute(options);

    // Verify pkg-a has workspace ref + preserved external ref, but not some-other-lib
    const pkgAConfig = parse(fs.readFileSync(path.join(testWorkspaceDir, "packages/pkg-a/tsconfig.json"), "utf8")) as any;
    expect(pkgAConfig.references).toHaveLength(2);

    const referencePaths = pkgAConfig.references.map((ref: any) => ref.path);
    expect(referencePaths).toContain("../pkg-b");
    expect(referencePaths).toContain("../../external-lib");
    expect(referencePaths).not.toContain("../../some-other-lib");
  });

  it("should work with multiple ignore paths", async () => {
    createTsConfig("packages/pkg-a", [
      { path: "../pkg-b" },
      { path: "../../external-lib" },
      { path: "../../another-external" },
      { path: "../../should-be-removed" }
    ]);
    createTsConfig("packages/pkg-b");

    const options = {
      configName: "tsconfig.json",
      rootConfigName: "tsconfig.json",
      withoutRootConfig: true,
      createTsConfig: false,
      cwd: testWorkspaceDir,
      verbose: false,
      help: false,
      check: false,
      createPathMappings: false,
      usecase: "update-ts-references.yaml",
      strict: false,
      ignoreReferencePaths: ["../../external-lib", "../../another-external"]
    };

    await execute(options);

    const pkgAConfig = parse(fs.readFileSync(path.join(testWorkspaceDir, "packages/pkg-a/tsconfig.json"), "utf8")) as any;
    expect(pkgAConfig.references).toHaveLength(3);

    const referencePaths = pkgAConfig.references.map((ref: any) => ref.path);
    expect(referencePaths).toContain("../pkg-b");
    expect(referencePaths).toContain("../../external-lib");
    expect(referencePaths).toContain("../../another-external");
    expect(referencePaths).not.toContain("../../should-be-removed");
  });

  it("should work normally when ignoreReferencePaths is empty", async () => {
    createTsConfig("packages/pkg-a", [
      { path: "../pkg-b" },
      { path: "../../external-lib" }
    ]);
    createTsConfig("packages/pkg-b");

    const options = {
      configName: "tsconfig.json",
      rootConfigName: "tsconfig.json",
      withoutRootConfig: true,
      createTsConfig: false,
      cwd: testWorkspaceDir,
      verbose: false,
      help: false,
      check: false,
      createPathMappings: false,
      usecase: "update-ts-references.yaml",
      strict: false,
      ignoreReferencePaths: []
    };

    await execute(options);

    // Should only have workspace reference
    const pkgAConfig = parse(fs.readFileSync(path.join(testWorkspaceDir, "packages/pkg-a/tsconfig.json"), "utf8")) as any;
    expect(pkgAConfig.references).toHaveLength(1);
    expect(pkgAConfig.references[0].path).toBe("../pkg-b");
  });

  it("should work when ignoreReferencePaths is undefined", async () => {
    createTsConfig("packages/pkg-a", [
      { path: "../pkg-b" },
      { path: "../../external-lib" }
    ]);
    createTsConfig("packages/pkg-b");

    const options = {
      configName: "tsconfig.json",
      rootConfigName: "tsconfig.json",
      withoutRootConfig: true,
      createTsConfig: false,
      cwd: testWorkspaceDir,
      verbose: false,
      help: false,
      check: false,
      createPathMappings: false,
      usecase: "update-ts-references.yaml",
      strict: false
      // ignoreReferencePaths not provided
    };

    await execute(options);

    // Should only have workspace reference
    const pkgAConfig = parse(fs.readFileSync(path.join(testWorkspaceDir, "packages/pkg-a/tsconfig.json"), "utf8")) as any;
    expect(pkgAConfig.references).toHaveLength(1);
    expect(pkgAConfig.references[0].path).toBe("../pkg-b");
  });

  it("should support ignoreReferencePaths in YAML config", async () => {
    // Create YAML config with ignoreReferencePaths
    const yamlConfig = `
ignorePathMappings:
  - tsconfig.build.json
ignoreReferencePaths:
  - ../../external-lib
  - ../../another-external
`;
    fs.writeFileSync(path.join(testWorkspaceDir, "update-ts-references.yaml"), yamlConfig);

    createTsConfig("packages/pkg-a", [
      { path: "../pkg-b" },
      { path: "../../external-lib" },
      { path: "../../another-external" },
      { path: "../../should-be-removed" }
    ]);
    createTsConfig("packages/pkg-b");

    const options = {
      configName: "tsconfig.json",
      rootConfigName: "tsconfig.json",
      withoutRootConfig: true,
      createTsConfig: false,
      cwd: testWorkspaceDir,
      verbose: false,
      help: false,
      check: false,
      createPathMappings: false,
      usecase: "update-ts-references.yaml",
      strict: false
    };

    await execute(options);

    const pkgAConfig = parse(fs.readFileSync(path.join(testWorkspaceDir, "packages/pkg-a/tsconfig.json"), "utf8")) as any;
    expect(pkgAConfig.references).toHaveLength(3);

    const referencePaths = pkgAConfig.references.map((ref: any) => ref.path);
    expect(referencePaths).toContain("../pkg-b");
    expect(referencePaths).toContain("../../external-lib");
    expect(referencePaths).toContain("../../another-external");
    expect(referencePaths).not.toContain("../../should-be-removed");
  });
});