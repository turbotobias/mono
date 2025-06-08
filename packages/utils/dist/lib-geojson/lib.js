import { toGeoJSON as toGeoJSON_lib } from "./lib.js";
// (ai) runtime validation ensures library structure matches expectations
if (typeof toGeoJSON_lib !== "object" || toGeoJSON_lib === null) {
    throw new Error("toGeoJSON library import failed: expected object");
}
if (typeof toGeoJSON_lib.kml !== "function" || typeof toGeoJSON_lib.gpx !== "function") {
    throw new Error("toGeoJSON library import failed: missing required methods");
}
export const toGeoJSON = toGeoJSON_lib;
//# sourceMappingURL=lib.js.map