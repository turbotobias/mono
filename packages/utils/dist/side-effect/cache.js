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
export class TimedCache {
    #cache;
    #ttlMs;
    #intervalId;
    constructor(ttlMs) {
        this.#cache = new Map();
        this.#ttlMs = ttlMs;
        this.#intervalId = setInterval(() => {
            const now = Date.now();
            for (const [key, entry] of this.#cache.entries()) {
                if (entry.expiresAt < now) {
                    this.#cache.delete(key);
                }
            }
        }, ttlMs * 2);
    }
    set(key, value) {
        const entry = { value, expiresAt: Date.now() + this.#ttlMs };
        this.#cache.set(key, entry);
    }
    get(key) {
        const entry = this.#cache.get(key);
        if (entry === undefined || entry.expiresAt < Date.now()) {
            this.#cache.delete(key);
            return undefined;
        }
        return entry.value;
    }
    destroy() {
        clearInterval(this.#intervalId);
        this.#cache.clear();
    }
}
//# sourceMappingURL=cache.js.map