/**
 * ```ts
 * must(undefined) // Error: Unexpected undefined value
 * must(null) // Error: Unexpected null value
 * must(1) // 1
 * must('hello') // 'hello'
 * ```
 */
export function must(v, msg) {
    if (v == null) {
        throw new Error(msg ?? `Unexpected ${v} value`);
    }
    return v;
}
//# sourceMappingURL=must.js.map