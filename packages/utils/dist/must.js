"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.must = must;
/**
 * ```ts
 * must(undefined) // Error: Unexpected undefined value
 * must(null) // Error: Unexpected null value
 * must(1) // 1
 * must('hello') // 'hello'
 * ```
 */
function must(v, msg) {
    if (v == null) {
        throw new Error(msg !== null && msg !== void 0 ? msg : "Unexpected ".concat(v, " value"));
    }
    return v;
}
//# sourceMappingURL=must.js.map