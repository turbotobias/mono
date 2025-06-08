import { expect, test } from "bun:test"

import {
	capitalize,
	get_alphanumeric,
	get_name,
	get_name_display,
	get_name_parts,
	get_readable_string,
	get_safe_string,
	slugify,
} from "./string"
test("get_safe_string", () => {
	expect(get_safe_string("hello_world")).toBe("hello_world")
	expect(get_safe_string("hello-world")).toBe("hello-world")
	expect(get_safe_string("$%^&*(hell$%^&*(o-wo$%^&*(rld!")).toBe("hello-world")
})

test("get_safe_string with empty string", () => {
	expect(get_safe_string("")).toBe("")
})

test("get_safe_string with special characters", () => {
	expect(get_safe_string("hello!@#$%^&*()_+")).toBe("hello_")
})

test("get_safe_string for image filename", () => {
	expect(get_safe_string("hello_world.png")).toBe("hello_world.png")
	expect(get_safe_string("hello-world.png")).toBe("hello-world.png")
	expect(get_safe_string("$%^&*(hello-world.png")).toBe("hello-world.png")
})

test("get_readable_string", () => {
	expect(get_readable_string("hi")).toBe("hi")
	expect(get_readable_string("hi-mom")).toBe("hi mom")
	expect(get_readable_string("8er-~^@.//3000   :mkay")).toBe("8er 3000 mkay")
})

test("get_alphanumeric", () => {
	expect(get_alphanumeric("this-is_a//\\text")).toBe("this is a text")
	expect(get_alphanumeric("_number@!~12")).toBe("number 12")
	expect(get_alphanumeric("@!~12")).toBe("12")
	expect(get_alphanumeric("  2  ")).toBe("2")
	expect(get_alphanumeric("    ")).toStrictEqual("")
	expect(get_alphanumeric("  .  ")).toStrictEqual("")
	expect(get_alphanumeric(" Tob I as G. schultz")).toStrictEqual("Tob I as G schultz")
	expect(get_alphanumeric("https://pacepacepace.com/events/amazing-slug-21km")).toBe(
		"https pacepacepace com events amazing slug 21km",
	)
})

test("capitalize", () => {
	expect(capitalize("t")).toBe("T")
	expect(capitalize("this")).toBe("This")
	expect(capitalize("this too")).toBe("This too")
	expect(capitalize("2 this though?")).toBe("2 this though?")
})

test("slugify", () => {
	expect(slugify(" ")).toStrictEqual("")
	expect(slugify(".")).toStrictEqual("")
	expect(slugify("  ....  ")).toStrictEqual("")
	expect(slugify("///")).toStrictEqual("")
	expect(slugify("\\//..  . .@+=)\"'^~`")).toStrictEqual("")
	expect(slugify("abc")).not.toStrictEqual("")
	expect(slugify("abc")).toStrictEqual("abc")
	expect(slugify(" 1_a_bc24 . \\ p _ 1 - 2 d ")).toStrictEqual("1_a_bc24-p-_-1-2-d")
	expect(slugify("hello-world")).toStrictEqual("hello-world")
	expect(slugify("!@#$%^&*()_+hello-world!@#$%^&*()_+")).toStrictEqual("_hello-world_")
})

test("get_name_parts", () => {
	expect(get_name_parts("")).toStrictEqual([])
	expect(get_name_parts(" ")).toStrictEqual([])
	expect(get_name_parts("-:.<@")).toStrictEqual([])
	expect(get_name_parts("John")).toStrictEqual(["John"])
	expect(get_name_parts("John Doe")).toStrictEqual(["John", "Doe"])
	expect(get_name_parts("John Doe Smith")).toStrictEqual(["John", "Doe", "Smith"])
	expect(get_name_parts("John Doe SmithDe_D")).toStrictEqual(["John", "Doe", "SmithDe", "D"])
})

test("get_name_display", () => {
	expect(get_name_display("")).toStrictEqual("")
	expect(get_name_display("John")).toStrictEqual("John")
	expect(get_name_display("John Doe")).toStrictEqual("John D.")
	expect(get_name_display("John Doe Smith")).toStrictEqual("John D.S.")
	expect(get_name_display("John Doe SmithDe_D")).toStrictEqual("John D.S.D.")
})

test("get_name", () => {
	const empty = get_name("")
	expect(empty.ok).toBe(false)

	const space = get_name(" ")
	expect(space.ok).toBe(false)

	const dash = get_name("-:.<@")
	expect(dash.ok).toBe(false)

	const john = get_name("John")
	if (john.ok) {
		expect(john.value).toStrictEqual({
			first: "John",
			last: "",
			full: "John",
			display: "John",
			middle: undefined,
			initials: "J",
		})
	}

	const john_doe = get_name("John Doe")
	expect(john_doe.ok).toBe(true)
	if (john_doe.ok) {
		expect(john_doe.value).toStrictEqual({
			first: "John",
			last: "Doe",
			full: "John Doe",
			display: "John D.",
			middle: undefined,
			initials: "JD",
		})
	}

	const john_doe_smith = get_name("John Doe- Smith")
	if (john_doe_smith.ok) {
		expect(john_doe_smith.value).toStrictEqual({
			first: "John",
			last: "Smith",
			full: "John Doe Smith",
			display: "John D.S.",
			initials: "JDS",
			middle: "Doe",
		})
	}
	const john_doe_smith_de_d = get_name("John Doe SmithDe_D")
	if (john_doe_smith_de_d.ok) {
		expect(john_doe_smith_de_d.value).toStrictEqual({
			first: "John",
			last: "D",
			full: "John Doe SmithDe D",
			display: "John D.S.D.",
			initials: "JDSD",
			middle: "Doe SmithDe",
		})
	}
})
