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

export const toGeoJSON: ToGeoJSONAPI = toGeoJSON_lib as ToGeoJSONAPI
