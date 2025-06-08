import type { GeoJSON } from "geojson"
import { toGeoJSON as toGeoJSON_lib } from "./lib.js"

/**
 * properly typed interface for toGeoJSON library functions
 */
interface ToGeoJSONAPI {
	/**
	 * convert KML document to GeoJSON
	 */
	kml: (doc: Document | XMLDocument) => GeoJSON
	/**
	 * convert GPX document to GeoJSON
	 */
	gpx: (doc: Document | XMLDocument) => GeoJSON
}

// (ai) runtime validation ensures library structure matches expectations
if (typeof toGeoJSON_lib !== "object" || toGeoJSON_lib === null) {
	throw new Error("toGeoJSON library import failed: expected object")
}

if (typeof toGeoJSON_lib.kml !== "function" || typeof toGeoJSON_lib.gpx !== "function") {
	throw new Error("toGeoJSON library import failed: missing required methods")
}

export const toGeoJSON: ToGeoJSONAPI = toGeoJSON_lib as ToGeoJSONAPI
