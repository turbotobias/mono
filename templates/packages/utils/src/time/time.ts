import type { Timezone } from "countries-and-timezones"

import type { TimezoneName } from "countries-and-timezones"
import { format } from "date-fns"

export interface TDateTimeZone {
	date: string
	time: string
	timezone?: Timezone | undefined
}

export const get_seconds_from_minutes_and_seconds = (minutes: number, seconds: number): number =>
	minutes * 60 + seconds
export const get_hours_only_from_seconds = (seconds: number): number => ~~(seconds / 3600)
export const get_minutes_only_from_seconds = (seconds: number): number => ~~((seconds % 3600) / 60)
export const get_seconds_only_from_seconds = (seconds: number): number => ~~(seconds % 60)

export const get_date = (from: {
	date: string
	time: string
	timezone_name?: TimezoneName
	timezone_offset?: Timezone["utcOffset"]
	timezone_offset_string?: Timezone["utcOffsetStr"]
}): Date | undefined => {
	const is_date_valid = validate_date_date(from.date)
	const is_time_valid = validate_date_time(from.time)
	if (!is_date_valid) {
		console.trace("can not get date without valid date", from.date)
		return undefined
	}
	if (is_date_valid && from.time.length && !is_time_valid) {
		console.trace(
			`can not get date without valid time (you may omit time to get "00:00" but you provided an invalid time ${from.time}`,
		)
		return undefined
	}

	const date_string = `${from.date}T${is_time_valid ? from.time : "00:00"}:00`
	return new Date(date_string)
}

export const get_date_format = (from: { date: string; time: string; timezone?: Timezone | undefined }): string | undefined => {
	const date = get_date(from)
	if (!date) return undefined
	return format(date, "d. MMM HH:mm")
}

export const get_date_date_now = (): string => format(new Date(), "yyyy-MM-dd")
export const get_date_time_now = (): string => format(new Date(), "HH:mm")

export const validate_date_date = (date: string): boolean => {
	if (!date || typeof date !== "string") return false
	const parts = date.split("-")
	if (parts.length !== 3) return false
	const year = Number.parseInt(parts[0] ?? "0")
	const month = Number.parseInt(parts[1] ?? "0")
	const day = Number.parseInt(parts[2] ?? "0")

	if (year < 1000 || year > 3000) return false
	if (month < 1 || month > 12) return false
	if (day < 1 || day > 31) return false
	return true
}

export const validate_date_time = (time: string): boolean => {
	if (!time || typeof time !== "string") return false
	const parts = time.split(":")
	if (parts.length !== 2) return false
	const hours = Number.parseInt(parts[0] ?? "0")
	const minutes = Number.parseInt(parts[1] ?? "0")
	const seconds = Number.parseInt(parts[2] ?? "0")

	if (hours < 0 || hours > 23) return false
	if (minutes < 0 || minutes > 59) return false
	if (seconds < 0 || seconds > 59) return false
	return true
}

export const get_date_string_locale = (date: string): string => {
	const d = new Date(date ?? "").toLocaleDateString("nb-NO")
	if (d === "Invalid Date") throw new Error("Invalid Date")
	return d
}
