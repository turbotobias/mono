import { describe, expect, it } from "bun:test"
import { get_errors_merged } from "./error"

describe("get_errors_merged", () => {
	it("should return an empty string if no errors are provided", () => {
		expect(get_errors_merged(new Error("something"), "wrong")).toStrictEqual("something\nwrong")
		expect(get_errors_merged(undefined, "wrong")).toStrictEqual("wrong")
		expect(get_errors_merged(undefined, "")).toStrictEqual("")
		expect(get_errors_merged(undefined, undefined, {})).toStrictEqual("")
		expect(get_errors_merged(new Error("something"), new Error("something"))).toStrictEqual(
			"something\nsomething",

		)
		expect(get_errors_merged("something")).toStrictEqual("something")
		expect(get_errors_merged(new Error(), "wrong")).toStrictEqual("wrong")
	})

	it("should return a string with the error messages if errors are provided", () => {
		expect(get_errors_merged(new Error("something"), "wrong")).toBe("something\nwrong")
	})
})
