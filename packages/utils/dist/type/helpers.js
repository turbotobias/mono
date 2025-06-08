export function Ok(data) {
    return { ok: true, value: data === undefined ? undefined : data };
}
export function Err(error) {
    return { ok: false, error };
}
//# sourceMappingURL=helpers.js.map