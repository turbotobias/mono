import { expect, test } from "bun:test"
import { create_array } from "./array"

test("create_array", () => {
    expect(create_array(0).length).toStrictEqual(0)
    expect(create_array(1.5).length).toStrictEqual(2)
    expect(create_array(26).length).toStrictEqual(26)
    expect(create_array(1_27_99).length).toStrictEqual(12799)
    expect(() => create_array({} as unknown as number)).toThrow()
    expect(() => create_array([] as unknown as number)).toThrow()
    expect(() => create_array("" as unknown as number)).toThrow()
    expect(() => create_array(undefined as unknown as number)).toThrow()
    expect(() => create_array(null as unknown as number)).toThrow()
    expect(() => create_array(true as unknown as number)).toThrow()
    expect(() => create_array(false as unknown as number)).toThrow()
    expect(() => create_array(Number.NaN as unknown as number)).toThrow()
    expect(() => create_array(Number.POSITIVE_INFINITY as unknown as number)).toThrow()
    expect(() => create_array(Number.NEGATIVE_INFINITY as unknown as number)).toThrow()
    expect(() => create_array(-1 as unknown as number)).toThrow()
    expect(() => create_array((Number.MAX_SAFE_INTEGER + 1) as unknown as number)).toThrow()
})
