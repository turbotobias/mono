import * as v from 'valibot';
export * from "./must";
export const HeeeySchema = v.pipe(v.string(), v.regex(/^[a-z0-9_-]{4,16}$/iu), v.title('Username'), v.description('A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens.'));
export const BigintSchema = v.bigint(); // bigint
export const BooleanSchema = v.boolean(); // boolean
export const NullSchema = v.null(); // null
export const NumberSchema = v.number(); // number
export const StringSchema = v.string(); // string
export const SymbolSchema = v.symbol(); // symbol
export const UndefinedSchema = v.undefined(); // undefined
export const ArraySchema = v.array(v.string()); // string[]
export const BlobSchema = v.blob(); // Blob
export const DateSchema = v.date(); // Date
export const FileSchema = v.file(); // File
export const FunctionSchema = v.function(); // (...args: unknown[]) => unknown
export const LooseObjectSchema = v.looseObject({ key: v.string() }); // { key: string }
export const LooseTupleSchema = v.looseTuple([v.string(), v.number()]); // [string, number]
export const MapSchema = v.map(v.string(), v.number()); // Map<string, number>
export const ObjectSchema = v.object({ key: v.string() }); // { key: string }
export const ObjectWithRestSchema = v.objectWithRest({ key: v.string() }, v.null()); // { key: string } & { [key: string]: null }
export const PromiseSchema = v.promise(); // Promise<unknown>
export const RecordSchema = v.record(v.string(), v.number()); // Record<string, number>
export const SetSchema = v.set(v.number()); // Set<number>
export const StrictObjectSchema = v.strictObject({ key: v.string() }); // { key: string }
export const StrictTupleSchema = v.strictTuple([v.string(), v.number()]); // [string, number]
export const TupleSchema = v.tuple([v.string(), v.number()]); // [string, number]
export const TupleWithRestSchema = v.tupleWithRest([v.string(), v.number()], v.null()); // [string, number, ...null[]]
export const UsernameSchema = v.pipe(v.string(), v.regex(/^[a-z0-9_-]{4,16}$/iu), v.title('Username'), v.description('A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens.'));
//# sourceMappingURL=index.js.map