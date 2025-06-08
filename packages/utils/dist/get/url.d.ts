import { type Result } from "../type";
/**
 * get the origin from a url
 *
 * ```ts
 * get_url_origin("https://example.com/test/test?test=123&test2=456#me")
 * // => "https://example.com"
 * ```
 */
export declare const get_url_origin: (url: string) => string | undefined;
/**
 * get the full pathname from a url
 *
 * ```ts
 * get_url_pathname_full("https://example.com/test/test?test=123&test2=456#me")
 * // => "/test/test?test=123&test2=456#me"
 * ```
 */
export declare const get_url_pathname_full: (url: string) => Result<string, string>;
//# sourceMappingURL=url.d.ts.map