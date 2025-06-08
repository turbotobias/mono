import { type Result } from "../type";
export declare function get_string(...from: Array<unknown | string | undefined | null>): string;
export declare function get_string_from_object(obj: Record<string, unknown>, skip_empty?: boolean | undefined): string;
export declare function get_template_strings(...from: Array<unknown | string | undefined | null>): string;
export declare const get_safe_string: (name: string, options?: {
    lowercase: boolean;
}) => string;
export declare const get_number_rounded_with_2_decimals: (num: number) => number;
export declare const get_number_rounded_with_1_decimals: (num: number) => number;
export declare const slugify: (string_source: string) => string;
/**
 * Returns a string with only alphanumeric characters
 * ```ts
 * get_alphanumeric("this-is-a-text")
 * // => "this is a text"
 * ```
 * ```ts
 * get_alphanumeric("this-is_number@!~12")
 * // => "this is number 12"
 * ```
 */
export declare const get_alphanumeric: (string_source: string) => string;
export declare const capitalize: (str?: string) => string;
/**
 * ```ts
 * get_readable_string("hi") // => "Hi"
 * get_readable_string("hi-mom") // => "Hi mom"
 * get_readable_string("8er-~^@.//3000   :mkay") // => "8er 3000 mkay"
 * ```
 */
export declare const get_readable_string: (str: string) => string;
/**
 * ```ts
 * const name: TName = {
 *   first: "Pauline",
 *   last: "Narvas",
 *   full: "Pauline P. Narvas",
 *   display: "Pauline Narvas",
 * }
 * ...
 * const name = create_name("Pauline P. Narvas")
 * // => { first: "Pauline", last: "Narvas", full: "Pauline P. Narvas", display: "Pauline Narvas" }
 * ```
 */
export interface TName {
    first: string;
    middle?: string;
    last: string;
    full: string;
    display: string;
    initials: string;
}
export declare function get_name_parts(full: string): string[];
export declare function get_name_display(name: string[] | string): string;
/**
 * ```ts
 * const name = get_name("Pauline P. Narvas")
 * // => { first: "Pauline", last: "Narvas", full: "Pauline P. Narvas", display: "Pauline Narvas" }
 * ```
 */
export declare function get_name(full: string): Result<TName, string>;
//# sourceMappingURL=string.d.ts.map