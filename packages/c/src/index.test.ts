import { expect, test } from "bun:test"

test("function", () => {
  const result = () => {
    return 3
  }
  expect(result()).toStrictEqual(3)
})