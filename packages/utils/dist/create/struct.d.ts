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
export declare function create_data<TShape extends Partial<TFortItem | TShape>>(): <O extends Record<string, TShape>>(o: TWithShape<O, TShape>) => TDeepReadonly<TWithId<O>>;
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
export declare function object_entries<O extends object>(o: O): { [K in keyof O]: [K, O[K]]; }[keyof O][];
/**
 * deep-freeze that returns a DeepReadonly type
 *
 * ```ts
    const obj = { a: [{ b: 2 }]}
    const frozen = deep_freeze(obj)
    frozen.a = [{ b: 3 }] // error
    frozen.a[0].b = 3 // error
 * ```
 */
export declare function deep_freeze<T extends object>(o: T): TDeepReadonly<T>;
export declare function deep_freeze<T>(o: T): T;
/**
 * common defaults for data items in ui/ux
 */
export type TFortItem = {
    label: string;
    description: string;
    icon?: React.ComponentType<unknown> | React.ComponentType<unknown>;
};
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
export declare function structured_clone_as_mutable<T extends object>(item: T): TMutable<T>;
/** clones the type and strips `readonly` */
export type TMutable<T> = {
    -readonly [K in keyof T]: TMutable<T[K]>;
};
/**
 *
 * Ensures all properties of object type O conform to TShape.
 *
 * ```ts
 * type X = TWithShape<{a: {foo: 1}, b: {foo: 2}}, {bar: string}>
 * // X = { a: {foo: 1} & {bar: string}, b: {foo: 2} & {bar: string} }
 * ```
 *
 * Useful for enforcing a consistent structure in mapped object types.
 */
export type TWithShape<O, TShape> = {
    [K in keyof O]: O[K] & TShape;
};
/**
 * adds `id` to all objects in an object
 *
 * ```ts
 *
 *
 * ```
 */
export type TWithId<T extends Record<string, object>> = {
    readonly [K in keyof T]: {
        readonly id: K;
    } & T[K];
};
/**
 * adds `readonly` to all properties of an object
 */
export type TDeepReadonly<T> = T extends (...args: unknown[]) => unknown ? T : T extends object ? {
    readonly [K in keyof T]: TDeepReadonly<T[K]>;
} : T;
//# sourceMappingURL=struct.d.ts.map