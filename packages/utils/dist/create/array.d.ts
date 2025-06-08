/**
 * Creates an array of the given length
 *
 * ```ts
 * create_array(3) // [0, 1, 2]
 * create_array(3, "three") // ["three", "three", "three"]
 * create_array(3, { three: [3] }) // [{ three: [3] }, { three: [3] }, { three: [3] }]
 * ```
 */
export declare function create_array(size: number): Array<number>;
export declare function create_array<T>(size: number, value: T): Array<T>;
//# sourceMappingURL=array.d.ts.map