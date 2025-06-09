
/**
 * ```ts
 * replace_filename_extension("f", "geojson") // "f.geojson"
 * replace_filename_extension("f.geojson", "gpx") // "f.gpx"
 * replace_filename_extension("f.gpx", "geojson") // "f.geojson"
 * ```
 */
export const replace_filename_extension = (filename: string, to: string): string => {
	if (typeof filename !== "string" || filename.trim() === "") {
		throw new Error("Invalid filename: must be a non-empty string")
	}

	if (typeof to !== "string" || to.trim() === "") {
		throw new Error("Invalid target extension: must be a non-empty string")
	}

	const last_extension_match = filename.match(/\.([^.]+)$/)
	const last_extension = last_extension_match ? last_extension_match[1] : null

	if (!last_extension) {
		return `${filename}.${to}`
	}

	if (last_extension.toLowerCase() !== to.toLowerCase()) {
		return filename.replace(/\.([^.]+)$/, `.${to}`)
	}

	return filename
}

