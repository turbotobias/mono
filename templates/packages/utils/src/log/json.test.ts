import { describe, expect, it, test } from "bun:test"
// eslint-disable no-thenable
import { log_bit_size } from "./increment"
import { is_proxy, js } from "./json"

describe("js", () => {
	it("jss primitives", () => {
		expect(js(1)).toBe("1")
		expect(js("foo")).toBe('"foo"')
		expect(js(true)).toBe("true")
		expect(js(false)).toBe("false")
		expect(js(null)).toBe("null")
		expect(js(undefined)).toBe("undefined")
		expect(js(BigInt(123))).toBe("123n")
		expect(js(Symbol("sym"))).toBe("Symbol(sym)")
	})

	it("jss functions", () => {
		const anon = () => { }
		expect(js(foo)).toBe("[Function: foo]")
		expect(js(anon)).toBe("[Function: anonymous]")
	})

	it("jss Date and RegExp", () => {
		const d = new Date("2020-01-01T00:00:00.000Z")
		expect(js(d)).toBe(d.toISOString())
		expect(js(/abc/i)).toBe("/abc/i")
	})

	it("jss arrays", () => {
		expect(js([1, "a", null])).toBe('[1, "a", null]')
		expect(js([])).toBe("[]")
	})

	it("jss objects", () => {
		expect(js({ a: 1, b: "x" })).toBe('{ a: 1, b: "x" }')
		expect(js({})).toBe("{}")
	})

	it("jss nested structures", () => {
		expect(js({ a: [1, { b: 2 }] })).toBe("{ a: [1, { b: 2 }] }")
	})

	it("jss Map and Set", () => {
		const m = new Map([
			["a", 1],
			["b", 2],
		])
		expect(js(m)).toBe('Map { "a" => 1, "b" => 2 }')
		const s = new Set([1, 2])
		expect(js(s)).toBe("Set { 1, 2 }")
	})

	it("jss circular references", () => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const obj: any = { a: 1 }
		obj.self = obj
		expect(js(obj)).toBe("{ a: 1, self: [Circular] }")
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const arr: any[] = []
		arr.push(arr)
		expect(js(arr)).toBe("[ [Circular] ]")
	})

	it("jss Promise and thenable", () => {
		const p = Promise.resolve(42)
		expect(js(p)).toBe("[Promise]")
		// biome-ignore lint/suspicious/noThenProperty: <explanation>
		const thenable = { then: () => { } }
		expect(js(thenable)).toBe("[Thenable]")
	})

	it("jss deeply nested objects", () => {
		const deep = { a: { b: { c: { d: 1 } } } }
		expect(js(deep)).toBe("{ a: { b: { c: { d: 1 } } } }")
	})

	it("jss objects with symbol keys", () => {
		const sym = Symbol("foo")
		const obj = { [sym]: 1, a: 2 }
		expect(js(obj)).toBe("{ a: 2, [Symbol(foo)]: 1 }")
	})
})

describe("js insane edge cases", () => {
	it("jss deeply nested and circular structures", () => {
		type TDeep = { b?: TDeep }
		const a: TDeep = {}
		const b: TDeep = { a } as unknown as TDeep & { a: TDeep }
		a.b = b
		expect(js(a)).toContain("[Circular]")
		const arr: unknown[] = [1]
		arr.push(arr)
		expect(js(arr)).toBe("[1, [Circular]]")
		const deep = { x: { y: { z: { w: { v: { u: { t: { s: { r: { q: 1 } } } } } } } } } }
		expect(js(deep)).toContain("q: 1")
	})

	it("jss objects with prototype chains and null prototype", () => {
		const proto = { foo: 1 }
		const obj = Object.create(proto)
		obj.bar = 2
		expect(js(obj)).toContain("bar: 2")
		const nullProto = Object.create(null) as { x?: number }
		nullProto.x = 42
		expect(js(nullProto)).toBe("{ x: 42 }")
	})

	it("jss objects with non-enumerable, getter, and setter properties", () => {
		const obj: { a: number; c?: number } = { a: 1 }
		Object.defineProperty(obj, "b", { value: 2, enumerable: false })
		let _c = 3
		Object.defineProperty(obj, "c", {
			get() {
				return _c
			},
			set(v) {
				_c = v
			},
			enumerable: true,
		})
		expect(js(obj)).toContain("a: 1")
		expect(js(obj)).toContain("c: 3")
		expect(js(obj)).not.toContain("b: 2")
	})

	it("jss arrays with holes and sparse arrays", () => {
		const arr: (number | undefined)[] = [undefined, undefined, 5]
		expect(js(arr)).toBe("[undefined, undefined, 5]")
		const arr2: (number | undefined)[] = [1, undefined, 3]
		expect(js(arr2)).toBe("[1, undefined, 3]")
	})

	it("jss objects with both string and symbol keys, and symbol-keyed properties", () => {
		const sym = Symbol("s")
		const obj: Record<string | symbol, number> = { a: 1, [sym]: 2 }
		expect(js(obj)).toBe("{ a: 1, [Symbol(s)]: 2 }")
	})

	it("jss objects with BigInt, Symbol, Map, Set as values and keys", () => {
		const sym = Symbol("k")
		const m = new Map<unknown, unknown>([
			[sym, 1],
			[123n, "big"],
			["x", new Set([2, 3])],
		])
		expect(js(m)).toContain("Symbol(k) => 1")
		expect(js(m)).toContain('123n => "big"')
		expect(js(m)).toContain('"x" => Set { 2, 3 }')
	})

	it("jss objects with custom toString and valueOf", () => {
		const obj = {
			toString() {
				return "custom!"
			},
			valueOf() {
				return 42
			},
		}
		expect(js(obj)).toBe("{}")
	})

	it("jss objects with self-references in Map/Set", () => {
		const m = new Map<object, string>()
		m.set(m as unknown as object, "self")
		expect(js(m)).toContain('[Circular] => "self"')
		const s = new Set<object>()
		s.add(s as unknown as object)
		expect(js(s)).toContain("[Circular]")
	})

	it("jss frozen, sealed, and extensible objects", () => {
		const frozen = Object.freeze({ a: 1 })
		const sealed = Object.seal({ b: 2 })
		const extensible = { c: 3 }
		expect(js(frozen)).toBe("{ a: 1 }")
		expect(js(sealed)).toBe("{ b: 2 }")
		expect(js(extensible)).toBe("{ c: 3 }")
	})

	it("jss objects with weird function names and anonymous classes", () => {
		const weirdFn = Object.defineProperty(() => { }, "name", { value: "" })
		expect(js(weirdFn)).toBe("[Function: anonymous]")
		const anonClass = class {
			dummy() { }
		}
		expect(js(anonClass)).toBe("[Function: anonymous]")
	})

	it("jss objects with deeply nested symbol keys and circular symbol values", () => {
		const sym = Symbol("deep")
		const obj: Record<symbol, unknown> = { [sym]: {} }
		const inner = obj[sym] as Record<symbol, unknown>
		inner[sym] = obj
		expect(js(obj)).toContain("[Circular]")
	})

	it("jss objects with getter that throws", () => {
		const obj: Record<string, unknown> = {}
		Object.defineProperty(obj, "x", {
			get() {
				throw new Error("fail")
			},
			enumerable: true,
		})
		expect(() => js(obj)).not.toThrow()
		expect(js(obj)).toContain("x: [Thrown: fail]")
	})
})

describe("js proxy edge cases", () => {
	// Vanilla Proxy-wrapped objects/functions are indistinguishable from their targets in JS.
	// Only revoked proxies can be reliably detected.
	it("prints Proxy(Function) as a function (vanilla proxy)", () => {
		const fn = () => 42
		const proxyFn = new Proxy(fn, {})
		expect(js(proxyFn)).toBe("[Function: anonymous]")
		expect(is_proxy(proxyFn)).toBe(false)
	})

	it("prints Proxy(object) as the underlying object (vanilla proxy)", () => {
		const obj = { a: 1 }
		const proxyObj = new Proxy(obj, {})
		expect(js(proxyObj)).toBe("{ a: 1 }")
		expect(is_proxy(proxyObj)).toBe(false)
	})

	it("prints revoked Proxy(object) as [Proxy]", () => {
		const target = { a: 1 }
		const { proxy, revoke } = Proxy.revocable(target, {})
		revoke()
		expect(js(proxy)).toBe("[Proxy]")
		expect(is_proxy(proxy)).toBe(true)
	})

	it("prints revoked Proxy(Function) as [Proxy(Function)]", () => {
		const fn = () => 1
		const { proxy, revoke } = Proxy.revocable(fn, {})
		revoke()
		expect(js(proxy)).toBe("[Proxy(Function)]")
		expect(is_proxy(proxy)).toBe(true)
	})

	it("prints non-proxy function and object as normal", () => {
		expect(js(foo)).toBe("[Function: foo]")
		expect(is_proxy(foo)).toBe(false)
		const obj = { a: 1 }
		expect(js(obj)).toBe("{ a: 1 }")
		expect(is_proxy(obj)).toBe(false)
	})
})
function foo() { }

test("log_bit_size", () => {
	expect(log_bit_size(1024)).toBe("1 kb")
	expect(log_bit_size(1024 * 1024)).toBe("1 mb")
	expect(log_bit_size(1024 * 1024 * 1024)).toBe("1 gb")
})
