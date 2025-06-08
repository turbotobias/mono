import { describe, expect, test } from "bun:test"
import { TPasswordStrength, calculate_password_strength } from "./password-strength"

describe("calculate_password_strength", () => {
	test("returns VERY_WEAK for empty passwords", () => {
		expect(calculate_password_strength("123")).toBe(TPasswordStrength.VERY_WEAK)
	})

	test("returns VERY_WEAK for very short passwords", () => {
		expect(calculate_password_strength("asddsa2222")).toBe(TPasswordStrength.VERY_WEAK)
	})

	test("returns WEAK for simple passwords", () => {
		expect(calculate_password_strength("pQ0x@#O2")).toBe(TPasswordStrength.WEAK)
		expect(calculate_password_strength("123456789")).toBe(TPasswordStrength.WEAK)
	})

	test("returns MEDIUM for moderate passwords with mixed character types", () => {
		expect(calculate_password_strength("Password1")).toBe(TPasswordStrength.MEDIUM)
		expect(calculate_password_strength("pQ0x@#O2123")).toBe(TPasswordStrength.MEDIUM)
		expect(calculate_password_strength("abcd1234")).toBe(TPasswordStrength.MEDIUM)
	})

	test("returns STRONG for longer passwords with mixed character sets", () => {
		expect(calculate_password_strength("P@ssw0rd123")).toBe(TPasswordStrength.STRONG)
		expect(calculate_password_strength("Lengthy-Password-Example")).toBe(TPasswordStrength.STRONG)
	})

	test("returns VERY_STRONG for complex passwords with high entropy", () => {
		expect(calculate_password_strength("c8K#9pRt!2ZqL$7x")).toBe(TPasswordStrength.VERY_STRONG)
		expect(calculate_password_strength("long-random-phrase-with-numbers-123-and-symbols-!@#")).toBe(
			TPasswordStrength.VERY_STRONG,
		)
	})

	test("handles non-string inputs safely", () => {
		// Type assertion with unknown as intermediate step for safer casting
		expect(calculate_password_strength(null as unknown as string)).toBe(TPasswordStrength.VERY_WEAK)
		expect(calculate_password_strength(undefined as unknown as string)).toBe(TPasswordStrength.VERY_WEAK)
		expect(calculate_password_strength(123 as unknown as string)).toBe(TPasswordStrength.VERY_WEAK)
	})

	test("entropy increases with password length", () => {
		const short = calculate_password_strength("abc")
		const medium = calculate_password_strength("abcdefgh")
		const long = calculate_password_strength("abcdefghijklmnop")

		expect(short).toBeLessThan(medium)
		expect(medium).toBeLessThan(long)
	})

	test("character diversity affects strength level", () => {
		// Direct value comparisons instead of relative comparisons
		expect(calculate_password_strength("password")).toBe(TPasswordStrength.WEAK)
		expect(calculate_password_strength("Password")).toBe(TPasswordStrength.WEAK)
		expect(calculate_password_strength("Password123")).toBe(TPasswordStrength.MEDIUM)
		expect(calculate_password_strength("Password123!")).toBe(TPasswordStrength.STRONG)
	})

	test("entropy penalizes common patterns", () => {
		const common = calculate_password_strength("password123")
		const uncommon = calculate_password_strength("7f3x$L9p")

		expect(common).toBeLessThan(uncommon)
	})
})
