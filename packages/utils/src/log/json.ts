
/** (ai)
 * Returns true if value is a Proxy (best effort, since native detection is not possible).
 * Handles Proxy(Function) and Proxy objects.
 */
function is_proxy(val: unknown): boolean {
	// Proxies have no reliable tag, but their toString is 'function Proxy() { [native code] }' or '[object Object]' with Proxy handler traps
	// Try-catch to detect revoked proxies (throws on access)
	if (!val || (typeof val !== "object" && typeof val !== "function")) return false
	try {
		// Accessing a property on a revoked proxy throws
		// Proxy(Function) has typeof 'function', Proxy(Object) is 'object'
		// Proxy(Function) can be detected by .toString() or .name
		// Proxy-wrapped functions have a name like 'Proxy'
		// Proxy-wrapped objects may have a constructor.name of 'Proxy'
		// This is not 100% reliable but covers most real-world proxies
		if (typeof val === "function" && val.name === "Proxy") return true
		if (typeof val === "object" && val.constructor && val.constructor.name === "Proxy") return true
		// Use type-safe property access
		void (val as Record<string, unknown>)["__proxy_test__"]
	} catch {
		return true
	}
	return false
}

export const get_trimmed_object = (obj?: unknown, max_properties?: number): {
	[k: string]: unknown
} | undefined => {
	if (!obj) return undefined
	const trim = (value?: unknown): unknown => {
		if (typeof value === "string") return `${value.slice(0, 5)}..`
		if (Array.isArray(value)) {
			return value.length <= 3
				? value.map(trim)
				: [...value.slice(0, 2).map(trim), `...${value.length - 2} more items of ${value.length}`]
		}
		if (typeof value === "object" && value !== null) {
			const entries = Object.entries(value)
			const limited_entries = max_properties ? entries.slice(0, max_properties) : entries
			if (max_properties && entries.length > max_properties) {
				return {
					...Object.fromEntries(limited_entries.map(([k, v]) => [k, trim(v)])),
					_remaining: `...${entries.length - max_properties} more properties`,
				}
			}
			return Object.fromEntries(limited_entries.map(([k, v]) => [k, trim(v)]))
		}
		return value
	}

	const entries = Object.entries(obj)
	const limited_entries = max_properties ? entries.slice(0, max_properties) : entries
	if (max_properties && entries.length > max_properties) {
		return {
			...Object.fromEntries(limited_entries.map(([key, value]) => [key, trim(value)])),
			_remaining: `...${entries.length - max_properties} more properties`,
		}
	}
	return Object.fromEntries(limited_entries.map(([key, value]) => [key, trim(value)]))
}

export const json = (data: unknown): string => (data ? JSON.stringify(data, null, 2) : "")
export const json_log = (data: unknown): void => console.log(json(data))
export const json_trimmed = (obj?: unknown, max_properties?: number): string =>
	json(get_trimmed_object(obj, max_properties))
export const json_trimmed_log = (obj?: unknown, max_properties?: number): void =>
	console.log(json_trimmed(obj, max_properties))

/**
 * (ai) Print any JS value in a readable, reliable, and adaptive format for debugging or logging.
 * Handles all types, circular references, proxies, and edge cases.
 *
 * @example
 * ```ts
 * js({ a: 1, b: [2, 3], c: new Set([4]) })
 * //=> '{ a: 1, b: [2, 3], c: Set { 4 } }'
 * ```
 */
export function js(data: unknown): string {
	const seen = new WeakSet<object>()
	function inner(val: unknown): string {
		if (val === null) return "null"
		if (val === undefined) return "undefined"
		if (is_proxy(val)) {
			if (typeof val === "function") return "[Proxy(Function)]"
			return "[Proxy]"
		}
		if (typeof val === "string") return JSON.stringify(val)
		if (typeof val === "number" || typeof val === "boolean") return String(val)
		if (typeof val === "bigint") return `${val}n`
		if (typeof val === "symbol") return `Symbol(${val.description ?? ""})`
		if (typeof val === "function") {
			const name = val.name === "" || val.name === "anon" ? "anonymous" : val.name
			return `[Function: ${name}]`
		}
		if (val instanceof Date) return val.toISOString()
		if (val instanceof RegExp) return val.toString()
		if (typeof val === "object") {
			if (seen.has(val as object)) return "[Circular]"
			seen.add(val as object)
			if (Array.isArray(val)) {
				if (val.length === 0) return "[]"
				if (val.length === 1 && val[0] === val) return "[ [Circular] ]"
				return `[${val.map(inner).join(", ")}]`
			}
			if (val instanceof Map) {
				if (val.size === 0) return "Map {}"
				return `Map { ${Array.from(val.entries())
					.map(([k, v]) => `${inner(k)} => ${inner(v)}`)
					.join(", ")} }`
			}
			if (val instanceof Set) {
				if (val.size === 0) return "Set {}"
				return `Set { ${Array.from(val.values()).map(inner).join(", ")} }`
			}
			if (typeof (val as { then?: unknown }).then === "function") {
				if (val instanceof Promise) return "[Promise]"
				return "[Thenable]"
			}
			// Plain object
			const keys = [...Object.keys(val), ...(Object.getOwnPropertySymbols(val) as (string | symbol)[])]
			const entries = keys
				.map((k) => {
					const key_str = typeof k === "symbol" ? `[Symbol(${(k as symbol).description ?? ""})]` : k
					let value: unknown
					try {
						value = (val as Record<string | symbol, unknown>)[k]
					} catch (err) {
						const msg = err instanceof Error ? err.message : String(err)
						return `${key_str}: [Thrown: ${msg}]`
					}
					if (typeof value === "function") return undefined
					return `${key_str}: ${inner(value)}`
				})
				.filter(Boolean)
			if (entries.length === 0) return "{}"
			return `{ ${entries.join(", ")} }`
		}
		return String(val)
	}
	return inner(data)
}

export { is_proxy }
