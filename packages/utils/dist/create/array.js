export function create_array(size, value) {
    if (typeof size !== "number" || Number.isNaN(size))
        throw new Error("size must be a number");
    if (size < 0)
        throw new Error("size must be positive or zero");
    if (size > Number.MAX_SAFE_INTEGER)
        throw new Error("size is too large");
    // custom value
    if (value !== undefined) {
        return Array.from({ length: size }, () => value);
    }
    // default indices
    return Array.from({ length: size }, (_, i) => i);
}
//# sourceMappingURL=array.js.map