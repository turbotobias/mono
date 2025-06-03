// sources/package-b/src/index.ts
import * as v from "valibot";
var BigintSchema = v.bigint();
var BooleanSchema = v.boolean();
var NullSchema = v.null();
var NumberSchema = v.number();
var StringSchema = v.string();
var SymbolSchema = v.symbol();
var UndefinedSchema = v.undefined();
var ArraySchema = v.array(v.string());
var BlobSchema = v.blob();
var DateSchema = v.date();
var FileSchema = v.file();
var FunctionSchema = v.function();
var LooseObjectSchema = v.looseObject({ key: v.string() });
var LooseTupleSchema = v.looseTuple([v.string(), v.number()]);
var MapSchema = v.map(v.string(), v.number());
var ObjectSchema = v.object({ key: v.string() });
var ObjectWithRestSchema = v.objectWithRest({ key: v.string() }, v.null());
var PromiseSchema = v.promise();
var RecordSchema = v.record(v.string(), v.number());
var SetSchema = v.set(v.number());
var StrictObjectSchema = v.strictObject({ key: v.string() });
var StrictTupleSchema = v.strictTuple([v.string(), v.number()]);
var TupleSchema = v.tuple([v.string(), v.number()]);
var TupleWithRestSchema = v.tupleWithRest([v.string(), v.number()], v.null());
var UsernameSchema = v.pipe(v.string(), v.regex(/^[a-z0-9_-]{4,16}$/iu), v.title("Username"), v.description("A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens."));
export {
  UsernameSchema,
  UndefinedSchema,
  TupleWithRestSchema,
  TupleSchema,
  SymbolSchema,
  StringSchema,
  StrictTupleSchema,
  StrictObjectSchema,
  SetSchema,
  RecordSchema,
  PromiseSchema,
  ObjectWithRestSchema,
  ObjectSchema,
  NumberSchema,
  NullSchema,
  MapSchema,
  LooseTupleSchema,
  LooseObjectSchema,
  FunctionSchema,
  FileSchema,
  DateSchema,
  BooleanSchema,
  BlobSchema,
  BigintSchema,
  ArraySchema
};

//# debugId=826C8459F1FEDE5164756E2164756E21
//# sourceMappingURL=index.js.map
