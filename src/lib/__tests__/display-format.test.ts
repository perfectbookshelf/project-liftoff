import { expect, it } from "vitest"
import { formatPrice, formatInches } from "../display-format"

it("formats USD with en-US separators and cents", () => {
  expect(formatPrice(2622.67)).toBe("$2,622.67")
  expect(formatPrice(0)).toBe("$0.00")
})
it("formats dimensions only in inches", () => {
  expect(formatInches(69.75)).toBe('69 3/4"')
  expect(formatInches(168)).toBe('168"')
})