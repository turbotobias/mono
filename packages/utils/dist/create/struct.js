/**
 * ### Creates a registry (FORT) that is:
 *
 * - Frozen — immutable at runtime, via deep freeze
 * - Organized — structured, catalogued, easily indexable (safe.dot.notation)
 * - Readonly — prevents unintended mutation
 * - Typed — type inference and drift-prevention
 *
 * ```ts
 * const items = create_data<{ label: string }>()({
 * 	running: { label: "Løpe" },
 * 	swimming: { label: "Svømme" },
 * })
 *
 * items.running.label // "Løpe" (type: string, readonly)
 * items.running.id // "running" (type: "running", readonly)
 * items.swimming.label // "Svømme" (type: string, readonly)
 * items.swimming.id // "swimming" (type: "swimming", readonly)
 *
 * type TItem = keyof typeof items
 * // => "running" | "swimming"
 * ```
 *
 * @example *without pre-defined shape*
 *
 * ```ts
 * const catalog_form_data_route_upload_key = create_data()({
 * 	 route_file: {},
 * 	 id_user: {},
 * 	 id_posthog_session: {},
 * 	 id_event: {
 *   // something: "else" here would *not* error
 *   },
 * })
 *
 * type TFormDataRouteUploadKey = keyof typeof catalog_form_data_route_upload_key
 * // => "route_file" | "id_user" | "id_posthog_session" | "id_event"
 *```
 */
export function create_data() {
    return (o) => create_data_internal(o);
}
function create_data_internal(o) {
    const entries = object_entries(o).map(([key, value]) => {
        // adds `id` to every object in the registry
        if (typeof key === "string") {
            ;
            value.id = key;
        }
        else {
            console.error(`can not create_data_internal when key ${String(key)} is not a string of any value:`, value);
        }
        return [key, value];
    });
    const out = Object.fromEntries(entries);
    return deep_freeze(out);
}
/**
 * type-safe `Object.entries({..})`
 *
 * ```ts
 * object_entries({ a: 1, b: 2 })
 * 	.map(([key,value]) => {
 *     // (parameter) key: "a" | "b"
 *     // (parameter) value: number
 *   })
 * ```
 */
export function object_entries(o) {
    return Object.entries(o);
}
export function deep_freeze(o) {
    if (typeof o !== "object" || o === null || Object.isFrozen(o))
        return o;
    for (const v of Object.values(o))
        deep_freeze(v);
    return Object.freeze(o);
}
/**
 * clone with `structuredClone` but strips `readonly`
 *
 * ```ts
 * const before = deep_freeze({ a: "no" })
 * before.a = "yes" // error
 * const after = structured_clone_as_mutable(before)
 * after.a = "yes" // ok
 * ```
 */
export function structured_clone_as_mutable(item) {
    return structuredClone(item);
}
//# sourceMappingURL=struct.js.map