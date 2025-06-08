import { render } from "@testing-library/react"
import { expect, test } from "bun:test"
import "react"
import { register_happy_dom_globally } from "./dom"

test("test", () => {
  register_happy_dom_globally()
  const screen = render(<div>Hello World </div>)
  expect(screen).toBeInTheDocument()
})