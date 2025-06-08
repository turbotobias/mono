import { describe, expect, test } from "bun:test"
import { validate_email, validate_url_pathname_full, validate_redirect_url, validate_url } from "./validations"

test("validate_email", () => {
	expect(validate_email("test@test.com").ok).toBeTrue()
	expect(validate_email("test@test").ok).toBe(false)
	expect(validate_email("test@test.com.com").ok).toBeTrue()
	expect(validate_email("test@test.co.uk").ok).toBeTrue()
	expect(validate_email("t@t.to").ok).toBeTrue()
	expect(validate_email("t@t.t").ok).toBe(false)
	expect(validate_email("tob@hey.com").ok).toBeTrue()
	expect(validate_email("tob@hey.com.com.com.com").ok).toBeTrue() //(?)

	expect(validate_email("__@h.to").ok).toBeTrue()

	expect(validate_email({}).ok).toBe(false)
	expect(validate_email(undefined).ok).toBe(false)
	expect(validate_email([]).ok).toBe(false)
	expect(validate_email(1).ok).toBe(false)
	expect(validate_email(null).ok).toBe(false)
	expect(validate_email(void 0).ok).toBe(false)
})

test("validate_url", () => {
	expect(validate_url("https://www.google.com").ok).toBeTrue()
	expect(validate_url("http://www.google.com").ok).toBeTrue()
	expect(validate_url("www.google.com").ok).toBeTrue()
	expect(validate_url("google.com").ok).toBeTrue()
	expect(validate_url("google.com/").ok).toBeTrue()
	expect(validate_url("google.com/test").ok).toBeTrue()
	expect(validate_url("google.com/test/").ok).toBeTrue()
	expect(validate_url("google.com/test/test#123").ok).toBeTrue()
	expect(validate_url("google.com/test/test/586").ok).toBeTrue()
	expect(validate_url("google.com/test/test/test?test=123").ok).toBeTrue()
	expect(validate_url("https://google.com/test/test/test?test=123&test2=456").ok).toBeTrue()
	expect(validate_url("www.google.com/test/test/test?test=123&test2=456&test3=789").ok).toBeTrue()
	expect(validate_url("google.com/test/test/test?test=123&test2=456&test3=789&test4=101112").ok).toBeTrue()
	expect(
		validate_url("google.com/test/test/test?test=123&test2=456&test3=789&test4=101112&test5=131415").ok,
	).toBeTrue()
	expect(validate_url("google").ok).toBe(false)
	expect(validate_url("google.comtest").ok).toBe(true)
	expect(validate_url("google.sowkeodickaemxiqogadcuwe").ok).toBe(false)
	expect(validate_url("g").ok).toBe(false)
	expect(validate_url("").ok).toBe(false)
	expect(validate_url(undefined).ok).toBe(false)
	expect(validate_url([]).ok).toBe(false)
	expect(validate_url(1).ok).toBe(false)
	expect(validate_url(null).ok).toBe(false)
	expect(validate_url(void 0).ok).toBe(false)
	expect(validate_url({}).ok).toBe(false)
})

test("validate_redirect_url", () => {
	expect(validate_redirect_url("https://www.google.com").ok).toBeTrue()
	expect(validate_redirect_url("http://www.google.com").ok).toBeTrue()
	expect(validate_redirect_url("www.google.com").ok).toBeTrue()
	expect(validate_redirect_url("google.com").ok).toBeTrue()
})

describe("validate_url_pathname_full", () => {
	test("invalid urls", () => {
		expect(validate_url_pathname_full("https://www.google.com").ok).toBeFalse()
		expect(validate_url_pathname_full("http://www.google.com").ok).toBeFalse()
		expect(validate_url_pathname_full("www.google.com").ok).toBeFalse()
		expect(validate_url_pathname_full("google.com").ok).toBeFalse()
		expect(validate_url_pathname_full("google.com/").ok).toBeFalse()
		expect(validate_url_pathname_full("").ok).toBeFalse()
		expect(validate_url_pathname_full("g").ok).toBeFalse()
		expect(validate_url_pathname_full("google.com/test").ok).toBeFalse()
	})

	test("valid urls", () => {
		expect(validate_url_pathname_full("/").ok).toBeTrue()
		expect(validate_url_pathname_full("/test").ok).toBeTrue()
		expect(validate_url_pathname_full("/test/test").ok).toBeTrue()
		expect(validate_url_pathname_full("/test/test/586").ok).toBeTrue()
		expect(validate_url_pathname_full("/?test=123").ok).toBeTrue()
		expect(validate_url_pathname_full("/?test=123#me").ok).toBeTrue()
		expect(validate_url_pathname_full("/test?test=123#me").ok).toBeTrue()
	})
})
