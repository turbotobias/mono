"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameSchema = exports.TupleWithRestSchema = exports.TupleSchema = exports.StrictTupleSchema = exports.StrictObjectSchema = exports.SetSchema = exports.RecordSchema = exports.PromiseSchema = exports.ObjectWithRestSchema = exports.ObjectSchema = exports.MapSchema = exports.LooseTupleSchema = exports.LooseObjectSchema = exports.FunctionSchema = exports.FileSchema = exports.DateSchema = exports.BlobSchema = exports.ArraySchema = exports.UndefinedSchema = exports.SymbolSchema = exports.StringSchema = exports.NumberSchema = exports.NullSchema = exports.BooleanSchema = exports.BigintSchema = exports.HeeeySchema = void 0;
var v = require("valibot");
exports.HeeeySchema = v.pipe(v.string(), v.regex(/^[a-z0-9_-]{4,16}$/iu), v.title('Username'), v.description('A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens.'));
exports.BigintSchema = v.bigint(); // bigint
exports.BooleanSchema = v.boolean(); // boolean
exports.NullSchema = v.null(); // null
exports.NumberSchema = v.number(); // number
exports.StringSchema = v.string(); // string
exports.SymbolSchema = v.symbol(); // symbol
exports.UndefinedSchema = v.undefined(); // undefined
exports.ArraySchema = v.array(v.string()); // string[]
exports.BlobSchema = v.blob(); // Blob
exports.DateSchema = v.date(); // Date
exports.FileSchema = v.file(); // File
exports.FunctionSchema = v.function(); // (...args: unknown[]) => unknown
exports.LooseObjectSchema = v.looseObject({ key: v.string() }); // { key: string }
exports.LooseTupleSchema = v.looseTuple([v.string(), v.number()]); // [string, number]
exports.MapSchema = v.map(v.string(), v.number()); // Map<string, number>
exports.ObjectSchema = v.object({ key: v.string() }); // { key: string }
exports.ObjectWithRestSchema = v.objectWithRest({ key: v.string() }, v.null()); // { key: string } & { [key: string]: null }
exports.PromiseSchema = v.promise(); // Promise<unknown>
exports.RecordSchema = v.record(v.string(), v.number()); // Record<string, number>
exports.SetSchema = v.set(v.number()); // Set<number>
exports.StrictObjectSchema = v.strictObject({ key: v.string() }); // { key: string }
exports.StrictTupleSchema = v.strictTuple([v.string(), v.number()]); // [string, number]
exports.TupleSchema = v.tuple([v.string(), v.number()]); // [string, number]
exports.TupleWithRestSchema = v.tupleWithRest([v.string(), v.number()], v.null()); // [string, number, ...null[]]
exports.UsernameSchema = v.pipe(v.string(), v.regex(/^[a-z0-9_-]{4,16}$/iu), v.title('Username'), v.description('A username must be between 4 and 16 characters long and can only contain letters, numbers, underscores and hyphens.'));
