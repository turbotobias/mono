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
export declare const defaultOptions: Options;
export declare const execute: ({ cwd, createTsConfig, verbose, check, usecase, strict, ...configurable }: Options) => Promise<number>;
//# sourceMappingURL=update-ts-references.lib.d.ts.map