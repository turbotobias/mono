import { log } from "../log/increment"
import { json } from "../log/json"


/**
 * Utility function to execute an operation and handle errors with log notifications
 */
export async function handle<T>(options: {
	fn: () => Promise<T> | T
	on_error?: {
		message: string
		details?: boolean
	}
	on_success?: {
		message: string
		show: boolean
	}
}): Promise<T | undefined> {
	const { fn, on_error, on_success } = options

	try {
		const result = await fn()

		if (on_success?.show) {
			log(on_success.message)
		}

		return result
	} catch (err: unknown) {
		log.error(
			on_error?.message ?? "An error occurred",
			on_error?.details !== false
				? {
					description: err instanceof Error ? err.message : `Unknown error ${json(err)}`,
				}
				: undefined
		)

		return undefined
	}
}

/**
 * Synchronous version of handle
 */
export function handle_sync<T>(options: {
	fn: () => T
	on_error?: {
		message: string
		details?: boolean
	}
	on_success?: {
		message: string
		show: boolean
	}
}): T | undefined {
	const { fn, on_error, on_success } = options

	try {
		const result = fn()

		if (on_success?.show) {
			log(on_success.message)
		}

		return result
	} catch (err: unknown) {
		log.error(
			on_error?.message ?? "An error occurred",
			on_error?.details !== false
				? {
					description: err instanceof Error ? err.message : `Unknown error ${json(err)}`,
				}
				: undefined
		)

		return undefined
	}
}
