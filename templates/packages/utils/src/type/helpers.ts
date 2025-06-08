/**
 * i love this. i use it all the time, all over the place,
 */
export type Result<T, E = undefined> =
    | { ok: true; value: T }
    | { ok: false; error: E | undefined };
export function Ok(): Result<undefined, never>;
export function Ok<T>(data: T): Result<T, never>;
export function Ok<T>(data?: T): Result<T | undefined, never> {
    return { ok: true, value: data === undefined ? undefined : data };
}
export function Err<E>(error: E): Result<never, E> {
    return { ok: false, error };
}

// (ai) Standard union-to-intersection trick
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type TUnionToIntersection<U> = (
    U extends any ? (x: U) => void : never
) extends (x: infer I) => void
    ? I
    : never;

// (ai) Get last member of union using the intersection trick
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type TLastOf<U> = TUnionToIntersection<
    U extends any ? (x: U) => void : never
> extends (x: infer L) => void
    ? L
    : never;

// (ai) Convert union to tuple (order not guaranteed by TS, but works for small unions)
export type TUnionToTuple<T, L = TLastOf<T>> = [T] extends [never]
    ? []
    : [...TUnionToTuple<Exclude<T, L>>, L];

// (ai) Extract last element from tuple
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type TLastElement<T extends any[]> = T extends [...infer _, infer L]
    ? L
    : never;

export type TLastUnion<T> = TLastElement<TUnionToTuple<T>>;

// (ai) Get all string union keys
export type StringUnionKeys<T> = {
    [K in keyof T]: Extract<T[K], string> extends never ? never : K;
}[keyof T];

// (ai) Get all boolean union keys
export type BooleanKeys<T> = {
    [K in keyof T]: Extract<T[K], boolean> extends never ? never : K;
}[keyof T];
