import { json } from "../log/json"
import { get_template_strings } from "../transform"
import { Err } from "../type/helpers"

export const return_error = (error: unknown, message: string): any => {
	const error_message = error instanceof Error ? error.message : json(error)
	console.error(message, error_message)
	return Err(error_message)
}

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
export function get_errors_merged(...errors: Array<unknown>): unknown {
	return errors.reduce((acc, error) => {
		if (error instanceof Error && error.message) return get_template_strings(acc, error.message)
		if (typeof error === "string" && error) return get_template_strings(acc, error)
		if (
			typeof error === "object" &&
			error &&
			"message" in error &&
			typeof error.message === "string" &&
			error.message
		)
			return get_template_strings(acc, error.message)
		return acc
	}, "")
}
