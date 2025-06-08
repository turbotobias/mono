/** (ai)
 * Returns true if value is a Proxy (best effort, since native detection is not possible).
 * Handles Proxy(Function) and Proxy objects.
 */
declare function is_proxy(val: unknown): boolean;
export declare const get_trimmed_object: (obj?: unknown, max_properties?: number) => {
    [k: string]: unknown;
} | undefined;
export declare const json: (data: unknown) => string;
export declare const json_log: (data: unknown) => void;
export declare const json_trimmed: (obj?: unknown, max_properties?: number) => string;
export declare const json_trimmed_log: (obj?: unknown, max_properties?: number) => void;
/**
 * (ai) Print any JS value in a readable, reliable, and adaptive format for debugging or logging.
 * Handles all types, circular references, proxies, and edge cases.
 *
 * @example
 * ```ts
 * js({ a: 1, b: [2, 3], c: new Set([4]) })
 * //=> '{ a: 1, b: [2, 3], c: Set { 4 } }'
 * ```
 */
export declare function js(data: unknown): string;
export { is_proxy };
//# sourceMappingURL=json.d.ts.map