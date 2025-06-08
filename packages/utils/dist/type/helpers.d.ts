/**
 * i love this. i use it all the time, all over the place,
 */
export type Result<T, E = undefined> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: E | undefined;
};
export declare function Ok(): Result<undefined, never>;
export declare function Ok<T>(data: T): Result<T, never>;
export declare function Err<E>(error: E): Result<never, E>;
export type TUnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
export type TLastOf<U> = TUnionToIntersection<U extends any ? (x: U) => void : never> extends (x: infer L) => void ? L : never;
export type TUnionToTuple<T, L = TLastOf<T>> = [T] extends [never] ? [] : [...TUnionToTuple<Exclude<T, L>>, L];
export type TLastElement<T extends any[]> = T extends [...infer _, infer L] ? L : never;
export type TLastUnion<T> = TLastElement<TUnionToTuple<T>>;
export type StringUnionKeys<T> = {
    [K in keyof T]: Extract<T[K], string> extends never ? never : K;
}[keyof T];
export type BooleanKeys<T> = {
    [K in keyof T]: Extract<T[K], boolean> extends never ? never : K;
}[keyof T];
//# sourceMappingURL=helpers.d.ts.map