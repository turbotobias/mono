import { log } from "../log/increment";
import { json } from "../log/json";
/**
 * Utility function to execute an operation and handle errors with log notifications
 */
export async function handle(options) {
    const { fn, on_error, on_success } = options;
    try {
        const result = await fn();
        if (on_success?.show) {
            log(on_success.message);
        }
        return result;
    }
    catch (err) {
        log.error(on_error?.message ?? "An error occurred", on_error?.details !== false
            ? {
                description: err instanceof Error ? err.message : `Unknown error ${json(err)}`,
            }
            : undefined);
        return undefined;
    }
}
/**
 * Synchronous version of handle
 */
export function handle_sync(options) {
    const { fn, on_error, on_success } = options;
    try {
        const result = fn();
        if (on_success?.show) {
            log(on_success.message);
        }
        return result;
    }
    catch (err) {
        log.error(on_error?.message ?? "An error occurred", on_error?.details !== false
            ? {
                description: err instanceof Error ? err.message : `Unknown error ${json(err)}`,
            }
            : undefined);
        return undefined;
    }
}
//# sourceMappingURL=error-handler.js.map