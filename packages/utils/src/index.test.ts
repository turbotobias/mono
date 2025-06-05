import { expect, test } from "bun:test"

test("function", () => {
  const result = () => {
    return 2
  }
  expect(result()).toStrictEqual(2)
})