/**
 * ```ts
 * must(undefined) // Error: Unexpected undefined value
 * must(null) // Error: Unexpected null value
 * must(1) // 1
 * must('hello') // 'hello'
 * ```
 */
export function must<T>(v: T | undefined | null, msg?: string): T {
  if (v == null) {
    throw new Error(msg ?? `unexpected ${v} value`);
  }
  return v;
}
