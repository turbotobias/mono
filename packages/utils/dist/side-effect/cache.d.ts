/**
 * taken from @see https://github.com/rocicorp/mono/blob/main/packages/shared/src/cache.ts
 */
/**
 * Stores values with an expiration time at time of insertion.
 * Does not update the expiration time on retrieval.
 * Values are automatically removed from the cache after the TTL expires.
 * The cache is cleaned up periodically based on the TTL so it does
 * not grow indefinitely.
 */
export declare class TimedCache<T> {
    #private;
    constructor(ttlMs: number);
    set(key: string, value: T): void;
    get(key: string): T | undefined;
    destroy(): void;
}
//# sourceMappingURL=cache.d.ts.map