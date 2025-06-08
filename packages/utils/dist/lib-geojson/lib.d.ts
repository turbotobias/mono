import type { GeoJSON } from "geojson";
/**
 * properly typed interface for toGeoJSON library functions
 */
interface ToGeoJSONAPI {
    /**
     * convert KML document to GeoJSON
     */
    kml: (doc: Document | XMLDocument) => GeoJSON;
    /**
     * convert GPX document to GeoJSON
     */
    gpx: (doc: Document | XMLDocument) => GeoJSON;
}
export declare const toGeoJSON: ToGeoJSONAPI;
export {};
//# sourceMappingURL=lib.d.ts.map