import * as v from 'valibot';
export declare const BigintSchema: v.BigintSchema<undefined>;
export declare const BooleanSchema: v.BooleanSchema<undefined>;
export declare const NullSchema: v.NullSchema<undefined>;
export declare const NumberSchema: v.NumberSchema<undefined>;
export declare const StringSchema: v.StringSchema<undefined>;
export declare const SymbolSchema: v.SymbolSchema<undefined>;
export declare const UndefinedSchema: v.UndefinedSchema<undefined>;
export declare const ArraySchema: v.ArraySchema<v.StringSchema<undefined>, undefined>;
export declare const BlobSchema: v.BlobSchema<undefined>;
export declare const DateSchema: v.DateSchema<undefined>;
export declare const FileSchema: v.FileSchema<undefined>;
export declare const FunctionSchema: v.FunctionSchema<undefined>;
export declare const LooseObjectSchema: v.LooseObjectSchema<{
    readonly key: v.StringSchema<undefined>;
}, undefined>;
export declare const LooseTupleSchema: v.LooseTupleSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], undefined>;
export declare const MapSchema: v.MapSchema<v.StringSchema<undefined>, v.NumberSchema<undefined>, undefined>;
export declare const ObjectSchema: v.ObjectSchema<{
    readonly key: v.StringSchema<undefined>;
}, undefined>;
export declare const ObjectWithRestSchema: v.ObjectWithRestSchema<{
    readonly key: v.StringSchema<undefined>;
}, v.NullSchema<undefined>, undefined>;
export declare const PromiseSchema: v.PromiseSchema<undefined>;
export declare const RecordSchema: v.RecordSchema<v.StringSchema<undefined>, v.NumberSchema<undefined>, undefined>;
export declare const SetSchema: v.SetSchema<v.NumberSchema<undefined>, undefined>;
export declare const StrictObjectSchema: v.StrictObjectSchema<{
    readonly key: v.StringSchema<undefined>;
}, undefined>;
export declare const StrictTupleSchema: v.StrictTupleSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], undefined>;
export declare const TupleSchema: v.TupleSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], undefined>;
export declare const TupleWithRestSchema: v.TupleWithRestSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], v.NullSchema<undefined>, undefined>;
export declare const UsernameSchema: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.RegexAction<string, undefined>, v.TitleAction<string, "Username">, v.DescriptionAction<string, "A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens.">]>;
//# sourceMappingURL=index.d.ts.map