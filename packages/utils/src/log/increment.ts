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

import { TimedCache } from "../side-effect/cache"
import { get_number_rounded_with_1_decimals, get_number_rounded_with_2_decimals } from "../transform"


/** log message type */
type TConsoleMethod = Pick<typeof console, "log" | "info" | "error" | "warn" | "trace">
type TConsoleMethodType = keyof TConsoleMethod

/** logger interface with counter for each unique message */
interface ILogger extends TConsoleMethod {
	(message: string, type?: TConsoleMethodType): void
	/** singleton logger with cache persistence across all consumers */
	inc: (message: string, type?: TConsoleMethodType) => void
	/** creates new logger instance starting from 0 */
	inc_new: (prefix?: string) => (message: string, type?: TConsoleMethodType) => void
}

export const log: ILogger = (() => {
	const counters = new Map<string, number>()
	const logger = (message: string, type: TConsoleMethodType = "log"): void => {
		const count = counters.get(message) ?? 0
		counters.set(message, count + 1)
		console[type](`#${count}: ${message}`)
		// console.log(counters)
	}

	/** singleton logger with cache persistence across all consumers */
	const inc = (message: string, type: TConsoleMethodType = "log"): void => {
		const count = persistent_log_cache.get('global_count') ?? 0
		persistent_log_cache.set('global_count', count + 1)
		console[type](`#${count}: ${message}`)
	}

	/** creates new logger instance starting from 0 */
	const inc_new = (prefix?: string) => {
		let count = 0
		return (message: string, type: TConsoleMethodType = "log"): void => {
			const full_message = prefix ? `${prefix} ${message}` : message
			console[type](`#${count++}: ${full_message}`)
		}
	}

	return Object.assign(logger, {
		log: (message: string): void => logger(message, "log"),
		info: (message: string): void => logger(message, "info"),
		error: (message: string): void => logger(message, "error"),
		warn: (message: string): void => logger(message, "warn"),
		trace: (message: string): void => logger(message, "trace"),
		inc,
		inc_new,
	})
})()

export const log_bit_size = (size: number): string => {
	const kb = size / 1024
	const mb = kb / 1024
	const gb = mb / 1024
	if (gb >= 1) return `${get_number_rounded_with_2_decimals(gb)} gb`
	if (mb >= 1) return `${get_number_rounded_with_1_decimals(mb)} mb`
	if (kb >= 1) return `${kb} kb`
	return `${size} bytes`
}

/** singleton cache for persistent logging across all instances (1 hour TTL) */
const persistent_log_cache = new TimedCache<number>(1000 * 60 * 60)
