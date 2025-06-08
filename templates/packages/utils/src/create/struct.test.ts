import { describe, expect, it } from "bun:test"
import { create_data, deep_freeze, structured_clone_as_mutable } from "./fort"

describe("create_data", () => {
	/** test basic object creation with primitive values */
	it("creates a data with primitive values", () => {
		type TCatalog = {
			running: { id: "running"; label: string }
			swimming: { id: "swimming"; label: string }
		}

		const data = create_data<{ label: string }>()({
			running: { label: "Running" },
			swimming: { label: "Swimming" },
		}) as TCatalog

		expect(data["running"].id).toBe("running")
		expect(data["running"].label).toBe("Running")
		expect(data["swimming"].id).toBe("swimming")
		expect(data["swimming"].label).toBe("Swimming")

		// Test readonly properties
		const running_data = data["running"]
		expect(() => {
			// Type error caught by TS: Cannot assign to readonly property
			Object.defineProperty(running_data, "id", { value: "walking" })
		}).toThrow()

		expect(() => {
			// Type error caught by TS: Cannot assign to readonly property
			Object.defineProperty(running_data, "label", { value: "Walking" })
		}).toThrow()
	})

	/** test nested object structures */
	it("creates a data with nested objects", () => {
		type TCatalog = {
			settings: {
				id: "settings"
				config: {
					options: Array<{ value: number }>
				}
			}
		}

		const data = create_data<{
			config: {
				options: Array<{ value: number }>
			}
		}>()({
			settings: {
				config: {
					options: [{ value: 1 }, { value: 2 }],
				},
			},
		})

		const settings = data["settings"]
		const first_option = settings.config.options[0]
		const second_option = settings.config.options[1]

		expect(settings.id).toBe("settings")
		expect(first_option?.value).toBe(1)
		expect(second_option?.value).toBe(2)

		// Test deep readonly properties
		expect(() => {
			// Type error caught by TS: Cannot assign to readonly property
			Object.defineProperty(settings.config, "options", { value: [] })
		}).toThrow()

		if (first_option) {
			expect(() => {
				// Type error caught by TS: Cannot assign to readonly property
				Object.defineProperty(first_option, "value", { value: 3 })
			}).toThrow()
		}
	})

	it("TODO creates a data with jsx/react icons", () => {
		// const data = create_data()({
		// 	running: { label: "Running", icon: SvgBikingLine },
		// })

		// expect(data["running"].icon).toBe(SvgBikingLine)
	})

	/** test empty objects */
	it("creates a data with empty objects", () => {
		type TMinimalShape = { _tag: never }
		const data = create_data<TMinimalShape>()({})
		expect(Object.keys(data)).toHaveLength(0)
	})

	/** test optional properties */
	it("creates a data with optional properties", () => {
		type TCatalog = {
			item1: { id: "item1"; label: string; description: string }
			item2: { id: "item2"; label: string; description?: string }
		}

		const data = create_data<{
			label: string
			description?: string
		}>()({
			item1: { label: "Item 1", description: "Description 1" },
			item2: { label: "Item 2" },
		}) as TCatalog

		expect(data["item1"].description).toBe("Description 1")
		expect(data["item2"].description).toBeUndefined()
	})

	/** test with complex types including functions */
	it("creates a data with function properties", () => {
		type Handler = () => void
		const handler = () => {}

		type TCatalog = {
			button: { id: "button"; label: string; handler: Handler }
		}

		const data = create_data<{
			label: string
			handler: Handler
		}>()({
			button: {
				label: "Click me",
				handler,
			},
		}) as TCatalog

		expect(data["button"].id).toBe("button")
		expect(data["button"].label).toBe("Click me")
		expect(data["button"].handler).toBe(handler)

		// Functions should remain callable even though object is frozen
		expect(() => data["button"].handler()).not.toThrow()
	})

	/** test with union types */
	it("creates a data with union types", () => {
		type Status = "active" | "inactive"

		type TCatalog = {
			item1: { id: "item1"; status: Status; value: string | number }
			item2: { id: "item2"; status: Status; value: string | number }
		}

		const data = create_data<{
			status: Status
			value: string | number
		}>()({
			item1: { status: "active", value: "test" },
			item2: { status: "inactive", value: 42 },
		}) as TCatalog

		expect(data["item1"].status).toBe("active")
		expect(data["item1"].value).toBe("test")
		expect(data["item2"].status).toBe("inactive")
		expect(data["item2"].value).toBe(42)
	})

	/** test with null and undefined */
	it("handles null and undefined in optional properties", () => {
		type TCatalog = {
			item1: { id: "item1"; required: string; optional: null }
			item2: { id: "item2"; required: string; optional: undefined }
			item3: { id: "item3"; required: string; optional?: null | string }
		}

		const data = create_data<{
			required: string
			optional?: null | string
		}>()({
			item1: { required: "value", optional: null },
			item2: { required: "value", optional: undefined },
			item3: { required: "value" },
		}) as TCatalog

		expect(data["item1"].optional).toBeNull()
		expect(data["item2"].optional).toBeUndefined()
		expect(data["item3"].optional).toBeUndefined()
	})

	/** test with array types */
	it("creates a data with array properties", () => {
		type TCatalog = {
			data: {
				id: "data"
				items: readonly string[]
				matrix: readonly (readonly number[])[]
			}
		}

		const _data = create_data<{
			items: string[]
			matrix: number[][]
		}>()({
			data: {
				items: ["a", "b", "c"],
				matrix: [
					[1, 2],
					[3, 4],
				],
			},
		}) as TCatalog

		expect(_data["data"].items).toEqual(["a", "b", "c"])
		expect(_data["data"].matrix).toEqual([
			[1, 2],
			[3, 4],
		])

		// Test array immutability
		const _data_2 = _data["data"]
		expect(() => {
			// Type error caught by TS: Cannot assign to readonly property
			Object.defineProperty(_data_2, "items", { value: [] })
		}).toThrow()

		expect(() => {
			// Type error caught by TS: Cannot assign to readonly property
			Object.defineProperty(_data_2.items, "0", { value: "d" })
		}).toThrow()
	})
})

describe("deep_freeze", () => {
	it("should freeze an object", () => {
		const obj = { a: "no" }
		const frozen = deep_freeze(obj)
		expect(frozen).toBe(obj)
		expect(() => {
			// @ts-expect-error
			frozen.a = "yes" // should error
		}).toThrow()
	})
})

describe("structured_clone_as_mutable", () => {
	it("should clone an object", () => {
		const obj = deep_freeze({ a: "no" })
		const cloned = structured_clone_as_mutable(obj)
		expect(cloned).toStrictEqual(obj)
		expect(cloned).not.toBe(obj)
		expect(() => {
			cloned.a = "yes"
		}).not.toThrow()
	})
})
