import { get_date, get_date_date_now, get_date_format, get_date_time_now, validate_date_date } from "./time"

import { expect, test } from "bun:test"
import { get_number_rounded_with_2_decimals } from "../transform"
import { validate_date_time } from "./time"

test("validate_date_time", () => {
	expect(validate_date_time("00:00")).toBeTrue()
	expect(validate_date_time("10:00")).toBeTrue()
	expect(validate_date_time("22:34")).toBeTrue()
	expect(validate_date_time("00:00:00")).toBe(false)
	expect(validate_date_time("00:00:00:00")).toBe(false)
	expect(validate_date_time("00")).toBe(false)
	expect(validate_date_time("25:00")).toBe(false)
	expect(validate_date_time("00:59")).toBeTrue()
	expect(validate_date_time("00:60")).toBe(false)
})

test("validate_date_date", () => {
	expect(validate_date_date("2024-11-06")).toBeTrue()
	expect(validate_date_date("2024-11-06-01")).toBe(false)
	expect(validate_date_date("2024-11")).toBe(false)
	expect(validate_date_date("2024")).toBe(false)
	expect(validate_date_date("")).toBe(false)
	expect(validate_date_date("asdasd")).toBe(false)
	expect(validate_date_date("11-06-2024")).toBe(false)
	// @ts-expect-error
	expect(validate_date_date(undefined)).toBe(false)
	// @ts-expect-error
	expect(validate_date_date({})).toBe(false)
	// @ts-expect-error
	expect(validate_date_date([{ a: [{}] }])).toBe(false)
})

test("get_date_date_now", () => {
	const date = get_date_date_now()
	expect(validate_date_date(date)).toBeTrue()
})

test("get_date_time_now", () => {
	const time = get_date_time_now()
	expect(validate_date_time(time)).toBeTrue()
})

test("get_date", async () => {
	const date_obj = get_date({ date: "2024-11-06", time: "22:03" })
	expect(date_obj?.toISOString()).toStrictEqual("2024-11-06T22:03:00.000Z")
	expect(date_obj?.getDate()).toStrictEqual(6)
	expect(date_obj?.getMonth()).toStrictEqual(10)
	expect(date_obj?.getFullYear()).toStrictEqual(2024)
	expect(date_obj?.getHours()).toStrictEqual(22)
	expect(date_obj?.getMinutes()).toStrictEqual(3)

	expect(get_date({ date: "", time: "" })).toBeUndefined()
	expect(get_date({ date: "", time: "22:03" })).toBeUndefined()
	expect(get_date({ date: "2024-11-40", time: "22:03" })).toBeUndefined()
	expect(get_date({ date: "2024-11-06", time: "25:03" })).toBeUndefined()
})

test("get_date_format", () => {
	expect(get_date_format({ date: "2024-11-06", time: "22:03" })).toStrictEqual("6. Nov 22:03")
	expect(get_date_format({ date: "2024-11-06", time: "" })).toStrictEqual("6. Nov 00:00")
})

test("get_number_rounded_with_2_decimals", () => {
	expect(get_number_rounded_with_2_decimals(-1.2222)).toBe(-1.22)
	expect(get_number_rounded_with_2_decimals(0)).toBe(0)
	expect(get_number_rounded_with_2_decimals(1)).toBe(1)
	expect(get_number_rounded_with_2_decimals(1.000000001)).toBe(1)
	expect(get_number_rounded_with_2_decimals(1.2345)).toBe(1.23)
	expect(get_number_rounded_with_2_decimals(1.23456)).toBe(1.23)
	expect(get_number_rounded_with_2_decimals(1024.123456)).toBe(1024.12)
})
