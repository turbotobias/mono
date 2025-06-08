/**
 * Creates an array of the given length
 *
 * ```ts
 * create_array(3) // [0, 1, 2]
 * create_array(3, "three") // ["three", "three", "three"]
 * create_array(3, { three: [3] }) // [{ three: [3] }, { three: [3] }, { three: [3] }]
 * ```
 */
export function create_array(size: number): Array<number>
export function create_array<T>(size: number, value: T): Array<T>
export function create_array<T>(size: number, value?: T): Array<T> | Array<number> {
    if (typeof size !== "number" || Number.isNaN(size)) throw new Error("size must be a number")
    if (size < 0) throw new Error("size must be positive or zero")
    if (size > Number.MAX_SAFE_INTEGER) throw new Error("size is too large")

    // custom value
    if (value !== undefined) {
        return Array.from({ length: size }, () => value)
    }

    // default indices
    return Array.from({ length: size }, (_, i) => i)
}

