"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_a = void 0;
var c_1 = require("@mono/c");
(0, c_1.test_c)();
var test_a = function () { return console.log("from package-a!"); };
exports.test_a = test_a;
