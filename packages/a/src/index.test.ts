import { expect, test } from "bun:test"

test("function", () => {
  const result = () => {
    return 1
  }
  expect(result()).toStrictEqual(1)
})