import { get_template_strings } from "../get/string";
import { json } from "../log/json";
import { Err } from "../type/helpers";
export const return_error = (error, message) => {
    const error_message = error instanceof Error ? error.message : json(error);
    console.error(message, error_message);
    return Err(error_message);
};
/**
 * merges errors into a single error string
 *
 * ```ts
 * get_errors_merged([{message: "something"},{message: "wrong"}])
 * // =>
 * something
 * wrong
 * ```
 */
export function get_errors_merged(...errors) {
    return errors.reduce((acc, error) => {
        if (error instanceof Error && error.message)
            return get_template_strings(acc, error.message);
        if (typeof error === "string" && error)
            return get_template_strings(acc, error);
        if (typeof error === "object" &&
            error &&
            "message" in error &&
            typeof error.message === "string" &&
            error.message)
            return get_template_strings(acc, error.message);
        return acc;
    }, "");
}
//# sourceMappingURL=error.js.map