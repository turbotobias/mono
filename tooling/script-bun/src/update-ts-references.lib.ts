import assert from 'assert';
import { assign, parse, stringify } from 'comment-json';
import * as fs from 'fs';
import yaml from 'js-yaml';
import { minimatch } from 'minimatch';
import path from 'path';

const PACKAGE_JSON = 'package.json';
const TSCONFIG_JSON = 'tsconfig.json';

export interface Options {
  configName: string;
  rootConfigName: string;
  withoutRootConfig: boolean;
  createTsConfig: boolean;
  cwd: string;
  verbose: boolean;
  help: boolean;
  check: boolean;
  createPathMappings: boolean;
  usecase: string;
  strict: boolean;
  ignoreReferencePaths?: string[];
}

export const defaultOptions: Options = {
  configName: TSCONFIG_JSON,
  rootConfigName: TSCONFIG_JSON,
  withoutRootConfig: false,
  createTsConfig: false,
  cwd: process.cwd(),
  verbose: false,
  help: false,
  check: false,
  createPathMappings: false,
  usecase: 'update-ts-references.yaml',
  strict: false,
  ignoreReferencePaths: []
};

interface PackageInfo {
  packageDir: string;
  hasTsEntry: boolean;
}

interface Reference {
  name: string;
  path: string;
  folder: string;
}

interface TSConfigInfo {
  detectedConfig: string;
  compilerOptions?: {
    rootDir?: string;
    [key: string]: any;
  };
}

type PackagesMap = Map<string, PackageInfo>;
type TSConfigMap = Record<string, TSConfigInfo>;

const getAllPackageJsons = async (workspaces: string[], cwd: string): Promise<string[]> => {
  const ignoreGlobs: string[] = [];
  const workspaceGlobs: string[] = [];

  workspaces.forEach((workspaceGlob: string) => {
    if (workspaceGlob.startsWith('!')) {
      ignoreGlobs.push(!workspaceGlob.includes('/') ? `${workspaceGlob}/${PACKAGE_JSON}` : workspaceGlob);
    } else {
      workspaceGlobs.push(workspaceGlob);
    }
  });

  const allPackages = await Promise.all(
    workspaceGlobs.map(async (workspace: string): Promise<string[]> => {
      const globPattern = `${workspace}/${PACKAGE_JSON}`;
      const glob = new Bun.Glob(globPattern);
      const files: string[] = [];
      for await (const file of glob.scan({ cwd })) {
        files.push(file);
      }
      return files;
    })
  );

  const flattened = allPackages.reduce((acc: string[], files: string[]) => [...acc, ...files], []);

  return flattened.filter((packageName: string) => {
    const shouldInclude = ignoreGlobs.every((pattern: string) => !minimatch(packageName, pattern));
    return shouldInclude && !packageName.includes('node_modules');
  });
};

const detectTSConfig = (directory: string, configName: string, createConfig?: boolean, cwd?: string): string | null => {
  let detectedConfig = fs.existsSync(path.join(directory, configName)) ? configName : null;

  if (configName !== TSCONFIG_JSON && detectedConfig === null) {
    detectedConfig = fs.existsSync(path.join(directory, TSCONFIG_JSON)) ? TSCONFIG_JSON : null;
  }

  if (detectedConfig === null && createConfig && cwd) {
    let maybeExtends: { extends?: string } = {};

    if (fs.existsSync(path.join(cwd, 'tsconfig.base.json'))) {
      maybeExtends = {
        extends: path.join(path.relative(directory, cwd), "tsconfig.base.json").split(path.sep).join(path.posix.sep),
      };
    }

    const tsconfigFilePath = path.join(directory, configName);
    const config = {
      ...maybeExtends,
      compilerOptions: {
        outDir: "dist",
        rootDir: "src"
      },
      references: [],
    };

    fs.writeFileSync(tsconfigFilePath, stringify(config, null, 2) + '\n');
    return configName;
  }

  return detectedConfig;
};

const getPackageNamesAndPackageDir = (packageFilePaths: string[], cwd: string): PackagesMap => {
  return packageFilePaths.reduce((map: PackagesMap, packageFilePath: string) => {
    const fullPackageFilePath = path.join(cwd, packageFilePath);
    const packageJson = require(fullPackageFilePath);
    const { name } = packageJson;

    map.set(name, {
      packageDir: path.dirname(fullPackageFilePath),
      hasTsEntry: /\.(ts|tsx)$/.test(packageJson.main || '')
    });

    return map;
  }, new Map());
};

const getReferencesFromDependencies = (
  configName: string,
  { packageDir }: PackageInfo,
  packageName: string,
  packagesMap: PackagesMap,
  verbose: boolean
): Reference[] => {
  const packageJsonFilePath = path.join(packageDir, PACKAGE_JSON);

  const packageJson = require(packageJsonFilePath);
  const {
    dependencies = {},
    peerDependencies = {},
    devDependencies = {},
  } = packageJson;

  const mergedDependencies = {
    ...dependencies,
    ...peerDependencies,
    ...devDependencies,
  };

  if (verbose) console.log(`all deps from ${packageName}`, mergedDependencies);

  if (Object.keys(mergedDependencies).includes(packageName)) {
    throw new Error(
      `This package ${packageName} references itself, please check dependencies in package.json`
    );
  }

  return Object.keys(mergedDependencies)
    .reduce((referenceArray: Reference[], dependency: string): Reference[] => {
      if (packagesMap.has(dependency)) {
        const packageInfo = packagesMap.get(dependency);
        if (!packageInfo) return referenceArray;

        const { packageDir: dependencyDir } = packageInfo;
        const relativePath = path.relative(packageDir, dependencyDir);
        const detectedConfig = detectTSConfig(dependencyDir, configName);

        if (detectedConfig !== null) {
          return [
            ...referenceArray,
            {
              name: dependency,
              path: detectedConfig !== TSCONFIG_JSON ? path.join(relativePath, detectedConfig) : relativePath,
              folder: relativePath,
            },
          ];
        }
      }
      return referenceArray;
    }, [])
    .sort((refA: Reference, refB: Reference) => (refA.path > refB.path ? 1 : -1));
};

const ensurePosixPathStyle = (reference: Reference): Reference => ({
  ...reference,
  path: reference.path.split(path.sep).join(path.posix.sep),
  folder: reference.folder?.split(path.sep).join(path.posix.sep),
});

const updateTsConfig = (
  strict: boolean,
  configName: string,
  references: Reference[],
  paths: Record<string, string[]>,
  check: boolean,
  createPathMappings = false,
  { packageDir }: { packageDir: string } = { packageDir: process.cwd() },
  ignoreReferencePaths: string[] = []
): number => {
  const tsconfigFilePath = path.join(packageDir, configName);

  try {
    const configContent = fs.readFileSync(tsconfigFilePath, 'utf8');
    const config = parse(configContent) as any;

    const currentReferences = config?.references || [];

    // Preserve references that are in the ignore list
    const preservedReferences = currentReferences.filter((currentRef: any) =>
      ignoreReferencePaths.includes(currentRef.path)
    );

    // Merge workspace references with preserved ones
    const workspaceReferences = references.map(({ path: refPath }) => ({
      path: refPath,
      ...currentReferences.find((currentRef: any) => currentRef.path === refPath),
    }));

    // Combine workspace references and preserved references, avoiding duplicates
    const mergedReferences = [
      ...workspaceReferences,
      ...preservedReferences.filter((preserved: any) =>
        !workspaceReferences.some(workspace => workspace.path === preserved.path)
      )
    ];

    let isEqual = false;
    try {
      assert.deepEqual(JSON.parse(JSON.stringify(currentReferences)), mergedReferences);
      if (createPathMappings) {
        assert.deepEqual(JSON.parse(JSON.stringify(config?.compilerOptions?.paths ?? {})), paths);
      }
      isEqual = true;
    } catch (error) {
      // Changes needed
      console.log("can not update ts config when merging references:", error)
    }

    if (!isEqual) {
      if (check === false) {
        const compilerOptions = config?.compilerOptions ?? {};

        if (createPathMappings && paths) {
          assign(compilerOptions,
            paths && Object.keys(paths).length > 0 ? { paths } : { paths: undefined }
          );
        }

        const newTsConfig = assign(config, {
          compilerOptions,
          references: mergedReferences.length ? mergedReferences : undefined,
        });

        fs.writeFileSync(tsconfigFilePath, stringify(newTsConfig, null, 2) + '\n');
      }
      return 1;
    }
    return 0;
  } catch (error) {
    console.error(`could not read ${tsconfigFilePath}`, error);
    if (strict) {
      throw new Error('Expect always a tsconfig.json in the package directory while running in strict mode');
    }
    return 0;
  }
};

function getPathsFromReferences(
  references: Reference[],
  tsconfigMap: TSConfigMap,
  ignorePathMappings: string[] = []
): Record<string, string[]> {
  return references.reduce((paths: Record<string, string[]>, ref: Reference) => {
    if (ignorePathMappings.includes(ref.name)) return paths;

    const rootFolder = tsconfigMap[ref.name]?.compilerOptions?.rootDir ?? 'src';
    return {
      ...paths,
      [`${ref.name}`]: [`${ref.folder}${rootFolder === '.' ? '' : `/${rootFolder}`}`],
    };
  }, {});
}

export const execute = async ({
  cwd,
  createTsConfig,
  verbose,
  check,
  usecase,
  strict,
  ...configurable
}: Options): Promise<number> => {
  let changesCount = 0;
  console.log('updating tsconfigs');

  const packageJsonPath = path.join(cwd, PACKAGE_JSON);
  const packageJson = require(packageJsonPath);

  let workspaces: string[] | undefined = packageJson.workspaces;
  if (workspaces && !Array.isArray(workspaces)) {
    workspaces = (workspaces as any).packages;
  }

  if (!workspaces && fs.existsSync(path.join(cwd, 'lerna.json'))) {
    const lernaJson = require(path.join(cwd, 'lerna.json'));
    workspaces = lernaJson.packages;
  }

  if (!workspaces && fs.existsSync(path.join(cwd, 'pnpm-workspace.yaml'))) {
    const pnpmConfigContent = fs.readFileSync(path.join(cwd, 'pnpm-workspace.yaml'), 'utf8');
    const pnpmConfig = yaml.load(pnpmConfigContent) as any;
    workspaces = pnpmConfig.packages;
  }

  let {
    configName,
    rootConfigName,
    createPathMappings,
    withoutRootConfig,
    ignoreReferencePaths = []
  } = configurable;

  let ignorePathMappings: string[] = [];

  if (fs.existsSync(path.join(cwd, usecase))) {
    const yamlConfigContent = fs.readFileSync(path.join(cwd, usecase), 'utf8');
    const yamlConfig = yaml.load(yamlConfigContent) as any;

    configName = yamlConfig.configName ?? configName;
    rootConfigName = yamlConfig.rootConfigName ?? rootConfigName;
    createPathMappings = yamlConfig.createPathMappings ?? createPathMappings;
    withoutRootConfig = yamlConfig.withoutRootConfig ?? withoutRootConfig;
    workspaces = [...(yamlConfig.packages ? yamlConfig.packages : []), ...(workspaces ? workspaces : [])];
    ignorePathMappings = yamlConfig.ignorePathMappings ?? [];
    ignoreReferencePaths = yamlConfig.ignoreReferencePaths ?? ignoreReferencePaths;

    if (verbose) {
      console.log(`configName ${configName}`);
      console.log(`rootConfigName ${rootConfigName}`);
      console.log(`createPathMappings ${createPathMappings}`);
      console.log('joined workspaces', workspaces);
      console.log('ignorePathMappings', ignorePathMappings);
    }
  }

  if (!workspaces) {
    throw new Error(
      'could not detect yarn/npm/pnpm workspaces or lerna in this repository'
    );
  }

  const packageFilePaths = await getAllPackageJsons(workspaces, cwd);
  if (verbose) {
    console.log('packageFilePaths', packageFilePaths);
  }

  const packagesMap = getPackageNamesAndPackageDir(packageFilePaths, cwd);

  if (verbose) {
    console.log('packagesMap', packagesMap);
  }

  let rootReferences: Reference[] = [];
  let rootPaths: Record<string, string[]> = {};
  let tsconfigMap: TSConfigMap = {};

  packagesMap.forEach((packageEntry: PackageInfo, packageName: string) => {
    const detectedConfig = detectTSConfig(
      packageEntry.packageDir,
      configName,
      packageEntry.hasTsEntry && createTsConfig,
      cwd
    );

    if (detectedConfig) {
      const configPath = path.join(packageEntry.packageDir, detectedConfig);
      const configContent = fs.readFileSync(configPath, 'utf8');
      const parsedConfig = parse(configContent) as any;
      const compilerOptions = parsedConfig?.compilerOptions;

      tsconfigMap = {
        ...tsconfigMap,
        [packageName]: {
          detectedConfig,
          compilerOptions
        }
      };
    }
  });

  packagesMap.forEach((packageEntry: PackageInfo, packageName: string) => {
    const detectedConfig = tsconfigMap[packageName]?.detectedConfig;

    if (detectedConfig) {
      rootReferences.push({
        name: packageName,
        path: path.join(path.relative(cwd, packageEntry.packageDir), detectedConfig !== TSCONFIG_JSON ? detectedConfig : ''),
        folder: path.relative(cwd, packageEntry.packageDir),
      });

      const references = getReferencesFromDependencies(
        configName,
        packageEntry,
        packageName,
        packagesMap,
        verbose
      ).map(ensurePosixPathStyle);

      const paths = getPathsFromReferences(references, tsconfigMap, ignorePathMappings);

      if (verbose) {
        console.log(`references of ${packageName}`, references);
        console.log(`paths of ${packageName}`, paths);
      }

      const changeCount = updateTsConfig(
        strict,
        detectedConfig,
        references,
        paths,
        check,
        createPathMappings,
        packageEntry,
        ignoreReferencePaths
      );

      changesCount += changeCount;
    } else {
      console.log(`NO ${configName === TSCONFIG_JSON ? configName : `${configName} nor ${TSCONFIG_JSON}`} for ${packageName}`);
      rootPaths = {
        ...rootPaths,
        [packageName]: [path.relative(cwd, packageEntry.packageDir)]
      };
    }
  });

  rootReferences = rootReferences.map(ensurePosixPathStyle);
  rootPaths = getPathsFromReferences(rootReferences, tsconfigMap, ignorePathMappings);

  if (verbose) {
    console.log('rootReferences', rootReferences);
    console.log('rootPaths', rootPaths);
  }

  if (withoutRootConfig === false) {
    const rootChangeCount = updateTsConfig(
      strict,
      rootConfigName,
      rootReferences,
      rootPaths,
      check,
      createPathMappings,
      { packageDir: cwd },
      ignoreReferencePaths
    );
    changesCount += rootChangeCount;
  }

  if (verbose) {
    console.log(`counted changes ${changesCount}`);
  }

  return changesCount;
};