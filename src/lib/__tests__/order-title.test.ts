import { describe, it, expect } from "vitest"
import { lineItemTitle, designSizeLine } from "../order-title"
const s = (n: number) => Array.from({ length: n }, () => ({ height: 14, depth: 12 }))
describe("line item title", () => {
  it("straight bookshelf has finish, size and shelves", () => {
    expect(lineItemTitle({ mainType: "bookshelf", finish: "Maple", width: 69.75, dimensions: { height: 59.75 }, shelves: s(4) }))
      .toBe("Custom Bookshelf · Maple · 69¾″ W × 59¾″ H · 4 shelves")
  })
  it("corner lists both arms", () => {
    expect(lineItemTitle({ mainType: "corner", finish: "Walnut", width: 66, width2: 57, dimensions: { height: 30.25 }, shelves: s(4), shelves2: s(4) }))
      .toBe("Custom Corner · Walnut · 66″ + 57″ W × 30¼″ H · 4 shelves")
  })
  it("one shelf is singular", () => {
    expect(designSizeLine({ mainType: "bookshelf", width: 40, dimensions: { height: 14 }, shelves: s(1) })).toBe("40″ W × 14″ H · 1 shelf")
  })
})
