import * as v from 'valibot';
export * from "./must";
export type Heeey = string | "heeey"
export const HeeeySchema: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.RegexAction<string, undefined>, v.TitleAction<string, "Username">, v.DescriptionAction<string, "A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens.">]> = v.pipe(
  v.string(),
  v.regex(/^[a-z0-9_-]{4,16}$/iu),
  v.title('Username'),
  v.description(
    'A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens.'
  )
);
export const BigintSchema: v.BigintSchema<undefined> = v.bigint(); // bigint
export const BooleanSchema: v.BooleanSchema<undefined> = v.boolean(); // boolean
export const NullSchema: v.NullSchema<undefined> = v.null(); // null
export const NumberSchema: v.NumberSchema<undefined> = v.number(); // number
export const StringSchema: v.StringSchema<undefined> = v.string(); // string
export const SymbolSchema: v.SymbolSchema<undefined> = v.symbol(); // symbol
export const UndefinedSchema: v.UndefinedSchema<undefined> = v.undefined(); // undefined

export const ArraySchema: v.ArraySchema<v.StringSchema<undefined>, undefined> = v.array(v.string()); // string[]
export const BlobSchema: v.BlobSchema<undefined> = v.blob(); // Blob
export const DateSchema: v.DateSchema<undefined> = v.date(); // Date
export const FileSchema: v.FileSchema<undefined> = v.file(); // File
export const FunctionSchema: v.FunctionSchema<undefined> = v.function(); // (...args: unknown[]) => unknown
export const LooseObjectSchema: v.LooseObjectSchema<{
  readonly key: v.StringSchema<undefined>;
}, undefined> = v.looseObject({ key: v.string() }); // { key: string }
export const LooseTupleSchema: v.LooseTupleSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], undefined> = v.looseTuple([v.string(), v.number()]); // [string, number]
export const MapSchema: v.MapSchema<v.StringSchema<undefined>, v.NumberSchema<undefined>, undefined> = v.map(v.string(), v.number()); // Map<string, number>
export const ObjectSchema: v.ObjectSchema<{
  readonly key: v.StringSchema<undefined>;
}, undefined> = v.object({ key: v.string() }); // { key: string }
export const ObjectWithRestSchema: v.ObjectWithRestSchema<{
  readonly key: v.StringSchema<undefined>;
}, v.NullSchema<undefined>, undefined> = v.objectWithRest({ key: v.string() }, v.null()); // { key: string } & { [key: string]: null }
export const PromiseSchema: v.PromiseSchema<undefined> = v.promise(); // Promise<unknown>
export const RecordSchema: v.RecordSchema<v.StringSchema<undefined>, v.NumberSchema<undefined>, undefined> = v.record(v.string(), v.number()); // Record<string, number>
export const SetSchema: v.SetSchema<v.NumberSchema<undefined>, undefined> = v.set(v.number()); // Set<number>
export const StrictObjectSchema: v.StrictObjectSchema<{
  readonly key: v.StringSchema<undefined>;
}, undefined> = v.strictObject({ key: v.string() }); // { key: string }
export const StrictTupleSchema: v.StrictTupleSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], undefined> = v.strictTuple([v.string(), v.number()]); // [string, number]
export const TupleSchema: v.TupleSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], undefined> = v.tuple([v.string(), v.number()]); // [string, number]
export const TupleWithRestSchema: v.TupleWithRestSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], v.NullSchema<undefined>, undefined> = v.tupleWithRest([v.string(), v.number()], v.null()); // [string, number, ...null[]]


export const UsernameSchema: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.RegexAction<string, undefined>, v.TitleAction<string, "Username">, v.DescriptionAction<string, "A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens.">]> = v.pipe(
  v.string(),
  v.regex(/^[a-z0-9_-]{4,16}$/iu),
  v.title('Username'),
  v.description(
    'A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens.'
  )
);