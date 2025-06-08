/**
/**
 * A logger that logs messages with a counter for each unique message
 *
 * ```tsx
 * log("entry.server.tsx handleRequest()")
 * // => "#0: entry.server.tsx handleRequest()"
 * log.error("entry.server.tsx handleRequest()")
 * // => "#2: entry.server.tsx handleRequest()"
 * log.trace("entry.server.tsx handleRequest()")
 * // => "#4: entry.server.tsx handleRequest()"
 * ```
 */
import { get_number_rounded_with_1_decimals, get_number_rounded_with_2_decimals } from "../get";
import { TimedCache } from "../side-effect/cache";
export const log = (() => {
    const counters = new Map();
    const logger = (message, type = "log") => {
        const count = counters.get(message) ?? 0;
        counters.set(message, count + 1);
        console[type](`#${count}: ${message}`);
        // console.log(counters)
    };
    /** singleton logger with cache persistence across all consumers */
    const inc = (message, type = "log") => {
        const count = persistent_log_cache.get('global_count') ?? 0;
        persistent_log_cache.set('global_count', count + 1);
        console[type](`#${count}: ${message}`);
    };
    /** creates new logger instance starting from 0 */
    const inc_new = (prefix) => {
        let count = 0;
        return (message, type = "log") => {
            const full_message = prefix ? `${prefix} ${message}` : message;
            console[type](`#${count++}: ${full_message}`);
        };
    };
    return Object.assign(logger, {
        log: (message) => logger(message, "log"),
        info: (message) => logger(message, "info"),
        error: (message) => logger(message, "error"),
        warn: (message) => logger(message, "warn"),
        trace: (message) => logger(message, "trace"),
        inc,
        inc_new,
    });
})();
export const log_bit_size = (size) => {
    const kb = size / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;
    if (gb >= 1)
        return `${get_number_rounded_with_2_decimals(gb)} gb`;
    if (mb >= 1)
        return `${get_number_rounded_with_1_decimals(mb)} mb`;
    if (kb >= 1)
        return `${kb} kb`;
    return `${size} bytes`;
};
/** singleton cache for persistent logging across all instances (1 hour TTL) */
const persistent_log_cache = new TimedCache(1000 * 60 * 60);
//# sourceMappingURL=increment.js.map