export declare const return_error: (error: unknown, message: string) => any;
/**
 * merges errors into a single error string
 *
 * ```ts
 * get_errors_merged([{message: "something"},{message: "wrong"}])
 * // =>
 * something
 * wrong
 * ```
 */
export declare function get_errors_merged(...errors: Array<unknown>): unknown;
//# sourceMappingURL=error.d.ts.map