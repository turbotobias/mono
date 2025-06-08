import { Err, Ok } from "../type";
export function get_string(...from) {
    return from.filter(Boolean).join("");
}
export function get_string_from_object(obj, skip_empty = true) {
    return Object.entries(obj)
        .filter(([_, value]) => !skip_empty || Boolean(value))
        .map(([key, value]) => {
        if (typeof value === "string")
            return `${key}:${value}`;
        return `${key}:${value}`;
    })
        .join(" ");
}
export function get_template_strings(...from) {
    return from.filter(Boolean).join("\n");
}
export const get_safe_string = (name, options) => {
    const safe_string = name.replace(/[^a-zA-Z0-9_.-]/g, "");
    if (options?.lowercase)
        return safe_string.toLowerCase();
    return safe_string;
};
export const get_number_rounded_with_2_decimals = (num) => Math.round(num * 100) / 100;
export const get_number_rounded_with_1_decimals = (num) => Math.round(num * 10) / 10;
export const slugify = (string_source) => {
    const slug = string_source
        .toLowerCase()
        .replace(/[^\w\s-_]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    return slug;
};
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
export const get_alphanumeric = (string_source) => {
    return string_source
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};
export const capitalize = (str) => {
    if (!str?.length)
        return "";
    if (str.length === 1)
        return str.toUpperCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
};
/**
 * ```ts
 * get_readable_string("hi") // => "Hi"
 * get_readable_string("hi-mom") // => "Hi mom"
 * get_readable_string("8er-~^@.//3000   :mkay") // => "8er 3000 mkay"
 * ```
 */
export const get_readable_string = (str) => get_alphanumeric(str).replaceAll("-", " ");
export function get_name_parts(full) {
    const normalized = get_alphanumeric(full);
    if (!normalized.length || normalized === " ")
        return [];
    return normalized.split(" ");
}
export function get_name_display(name) {
    const parts = [];
    if (typeof name === "string") {
        parts.push(...get_name_parts(name));
    }
    else {
        parts.push(...name);
    }
    const display = parts.reduce((acc, part, i) => {
        if (i === 0)
            return part;
        if (i === 1)
            return `${acc} ${part.charAt(0)}.`;
        if (parts.length > 2)
            return `${acc}${part.charAt(0)}.`;
        return `${acc} ${part.charAt(0)}.`;
    }, "");
    return display;
}
/**
 * ```ts
 * const name = get_name("Pauline P. Narvas")
 * // => { first: "Pauline", last: "Narvas", full: "Pauline P. Narvas", display: "Pauline Narvas" }
 * ```
 */
export function get_name(full) {
    const parts = get_name_parts(full);
    if (!parts.length)
        return Err("can not create name from empty string");
    const initials = parts.map((part) => part.charAt(0)).join("") || undefined;
    const middle = parts.length > 2 ? parts.slice(1, -1).join(" ") : undefined;
    return Ok({
        first: parts[0] ?? "",
        middle,
        last: parts.length > 1 ? (parts.at(-1) ?? "") : "",
        full: parts.join(" "),
        display: get_name_display(parts),
        initials: initials ?? "",
    });
}
//# sourceMappingURL=string.js.map