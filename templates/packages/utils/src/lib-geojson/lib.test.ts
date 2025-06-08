import { register_happy_dom_globally } from "@mono/test-browser"
import { expect, test } from "bun:test"
import { toGeoJSON } from "."

test("test", async () => {
	await register_happy_dom_globally()

	const xml = `
		<kml xmlns="http://www.opengis.net/kml/2.2">
			<Document>
				<Placemark>
					<name>Test</name>
				</Placemark>
			</Document>
		</kml>
	`

	const kml = new DOMParser().parseFromString(xml, "application/xml")

	const geojson = toGeoJSON.kml(kml)

	expect(geojson).toBeDefined()
})