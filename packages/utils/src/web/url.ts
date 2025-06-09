import { Ok, type Result } from "../type"
import { validate_url, validate_url_pathname_full } from "../validate/validations"

/**
 * get the origin from a url
 *
 * ```ts
 * get_url_origin("https://example.com/test/test?test=123&test2=456#me")
 * // => "https://example.com"
 * ```
 */
export const get_url_origin = (url: string): string | undefined => {
	const is_valid = validate_url(url)
	return is_valid.ok ? new URL(is_valid.value).origin : undefined
}

/**
 * get the full pathname from a url
 *
 * ```ts
 * get_url_pathname_full("https://example.com/test/test?test=123&test2=456#me")
 * // => "/test/test?test=123&test2=456#me"
 * ```
 */
export const get_url_pathname_full = (url: string): Result<string, string> => {
	const is_valid_pathname_full = validate_url_pathname_full(url)
	if (!is_valid_pathname_full.ok) return is_valid_pathname_full

	const url_origin = get_url_origin(url)
	const url_origin_maybe_fake = url_origin ?? "https://example.com"
	const pathname_full = is_valid_pathname_full.value
	const _url = new URL(url_origin_maybe_fake + pathname_full)
	const pathname_parts = (_url.pathname || "") + (_url.search || "") + (_url.hash || "")
	return Ok(pathname_parts)
}
