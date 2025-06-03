import * as v from "valibot";
declare const BigintSchema: v.BigintSchema<undefined>;
declare const BooleanSchema: v.BooleanSchema<undefined>;
declare const NullSchema: v.NullSchema<undefined>;
declare const NumberSchema: v.NumberSchema<undefined>;
declare const StringSchema: v.StringSchema<undefined>;
declare const SymbolSchema: v.SymbolSchema<undefined>;
declare const UndefinedSchema: v.UndefinedSchema<undefined>;
declare const ArraySchema: v.ArraySchema<v.StringSchema<undefined>, undefined>;
declare const BlobSchema: v.BlobSchema<undefined>;
declare const DateSchema: v.DateSchema<undefined>;
declare const FileSchema: v.FileSchema<undefined>;
declare const FunctionSchema: v.FunctionSchema<undefined>;
declare const LooseObjectSchema: v.LooseObjectSchema<{
	readonly key: v.StringSchema<undefined>
}, undefined>;
declare const LooseTupleSchema: v.LooseTupleSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], undefined>;
declare const MapSchema: v.MapSchema<v.StringSchema<undefined>, v.NumberSchema<undefined>, undefined>;
declare const ObjectSchema: v.ObjectSchema<{
	readonly key: v.StringSchema<undefined>
}, undefined>;
declare const ObjectWithRestSchema: v.ObjectWithRestSchema<{
	readonly key: v.StringSchema<undefined>
}, v.NullSchema<undefined>, undefined>;
declare const PromiseSchema: v.PromiseSchema<undefined>;
declare const RecordSchema: v.RecordSchema<v.StringSchema<undefined>, v.NumberSchema<undefined>, undefined>;
declare const SetSchema: v.SetSchema<v.NumberSchema<undefined>, undefined>;
declare const StrictObjectSchema: v.StrictObjectSchema<{
	readonly key: v.StringSchema<undefined>
}, undefined>;
declare const StrictTupleSchema: v.StrictTupleSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], undefined>;
declare const TupleSchema: v.TupleSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], undefined>;
declare const TupleWithRestSchema: v.TupleWithRestSchema<[v.StringSchema<undefined>, v.NumberSchema<undefined>], v.NullSchema<undefined>, undefined>;
declare const UsernameSchema: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.RegexAction<string, undefined>, v.TitleAction<string, "Username">, v.DescriptionAction<string, "A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens.">]>;
export { UsernameSchema, UndefinedSchema, TupleWithRestSchema, TupleSchema, SymbolSchema, StringSchema, StrictTupleSchema, StrictObjectSchema, SetSchema, RecordSchema, PromiseSchema, ObjectWithRestSchema, ObjectSchema, NumberSchema, NullSchema, MapSchema, LooseTupleSchema, LooseObjectSchema, FunctionSchema, FileSchema, DateSchema, BooleanSchema, BlobSchema, BigintSchema, ArraySchema };
