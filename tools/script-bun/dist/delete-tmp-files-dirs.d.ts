type TDeleteOptions = {
    max_depth?: number;
    delete_patterns?: string[];
    ignore_patterns?: string[];
    dry_run?: boolean;
};
type TDeleteResult = {
    deleted_count: number;
    deleted_paths: string[];
    errors: string[];
    scanned_directories: number;
};
/**
 * delete temporary files and directories from specified path
 */
export declare function delete_tmp_files(target_path?: string, options?: TDeleteOptions): Promise<TDeleteResult>;
export {};
//# sourceMappingURL=delete-tmp-files-dirs.d.ts.map