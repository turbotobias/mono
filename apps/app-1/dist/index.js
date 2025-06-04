"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var b_1 = require("@mono/b");
var utils_1 = require("@mono/config-bunup/utils");
console.log(b_1.HeeeySchema.type);
exports.default = (function () {
    (0, utils_1.get_bunup_config)({
        name: "app-1",
        root: ".",
        entry: "src/index.ts",
    });
});
