/**
 * ```ts
 * must(undefined) // Error: Unexpected undefined value
 * must(null) // Error: Unexpected null value
 * must(1) // 1
 * must('hello') // 'hello'
 * ```
 */
export declare function must<T>(v: T | undefined | null, msg?: string): T;
//# sourceMappingURL=must.d.ts.map