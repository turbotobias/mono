import { describe, expect, test } from "bun:test"
import { get_url_pathname_full } from "./url"

describe("get_url_pathname_full", () => {
	test("invalid urls", () => {
		expect(get_url_pathname_full("https://www.google.com").ok).toBeFalse()
		expect(get_url_pathname_full("http://www.google.com").ok).toBeFalse()
		expect(get_url_pathname_full("www.google.com").ok).toBeFalse()
		expect(get_url_pathname_full("google.com").ok).toBeFalse()
		expect(get_url_pathname_full("google.com/").ok).toBeFalse()
		expect(get_url_pathname_full("").ok).toBeFalse()
		expect(get_url_pathname_full("g").ok).toBeFalse()
		expect(get_url_pathname_full("google.com/test").ok).toBeFalse()
	})

	test("valid urls", () => {
		expect(get_url_pathname_full("/").ok).toBeTrue()
		expect(get_url_pathname_full("/test").ok).toBeTrue()
		expect(get_url_pathname_full("/test/test").ok).toBeTrue()
		expect(get_url_pathname_full("/test/test/586").ok).toBeTrue()
		expect(get_url_pathname_full("/?test=123").ok).toBeTrue()
		expect(get_url_pathname_full("/?test=123#me").ok).toBeTrue()
		expect(get_url_pathname_full("/test?test=123#me").ok).toBeTrue()
	})
})
