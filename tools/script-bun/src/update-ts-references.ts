#!/usr/bin/env bun

/**
 * Update TypeScript references script for Bun
 * Modern ESModule CLI interface
 */

// Import the actual implementation
import { defaultOptions, execute, type Options } from './update-ts-references.lib.js';

/**
 * Parse command line arguments using modern Bun approach
 */
function parseArgs(): Partial<Options> {
  const args = process.argv.slice(2);
  const options: Partial<Options> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--check':
        options.check = true;
        break;
      case '--withoutRootConfig':
        options.withoutRootConfig = true;
        break;
      case '--createTsConfig':
        options.createTsConfig = true;
        break;
      case '--createPathMappings':
        options.createPathMappings = true;
        break;
      case '--strict':
        options.strict = true;
        break;
      case '--configName':
        options.configName = args[++i];
        break;
      case '--rootConfigName':
        options.rootConfigName = args[++i];
        break;
      case '--cwd':
        options.cwd = args[++i];
        break;
      case '--usecase':
        options.usecase = args[++i];
        break;
      case '--ignoreReferencePaths':
        // Support comma-separated list or multiple occurrences
        const paths = args[++i];
        if (paths) {
          options.ignoreReferencePaths = options.ignoreReferencePaths || [];
          options.ignoreReferencePaths.push(...paths.split(',').map(p => p.trim()));
        }
        break;
    }
  }

  return options;
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
  Usage: update-ts-references [options]
  Options:
    --configName         The name of the config files which needs to be updated. Default: ${defaultOptions.configName}
    --rootConfigName     The name of the root config file which needs to be updated. Default: ${defaultOptions.rootConfigName}
    --withoutRootConfig  If you will not have a tsconfig in the root directory or don't want to update it. Default: ${defaultOptions.withoutRootConfig}
    --check              Checks if updates would be necessary (without applying them)
    --help, -h           Show help
    --createTsConfig     Create default TS configs for packages where the main entry in the package.json have a ts|tsx extension
    --createPathMappings Create paths mappings under compilerOptions for a better IDE support
    --cwd                Set working directory. Default: ${defaultOptions.cwd}
    --verbose            Show verbose output. Default: ${defaultOptions.verbose}
    --usecase            The use case for the script. Default: ${defaultOptions.usecase}
    --strict             Expects always a tsconfig.json in the package directory. Default: ${defaultOptions.strict}
    --ignoreReferencePaths Comma-separated list of reference paths to preserve (e.g., --ignoreReferencePaths "../../external-lib,../../another-lib")
  `);
}

/**
 * Main CLI entry point
 */
async function main() {
  const parsedOptions = parseArgs();
  const options = { ...defaultOptions, ...parsedOptions };

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  try {
    const changesCount = await execute(options);

    if (options.check && changesCount > 0) {
      process.exit(changesCount);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  await main();
}