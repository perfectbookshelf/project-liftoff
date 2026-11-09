import { describe, it, expect } from "vitest"
import { buildOrderProperties } from "../order-properties"
const get = (p: any[], n: string) => p.find((x) => x.name === n)?.value
const s = (n: number) => Array.from({ length: n }, () => ({ height: 14, depth: 12 }))
describe("order properties", () => {
  it("corner order lists both arms", () => {
    const { properties } = buildOrderProperties({ mainType: "corner", cornerVariant: "outside", width: 60, width2: 48, shelves: s(2), shelves2: s(2), dimensions: { height: 30 } })
    expect(get(properties, "Type")).toBe("Corner (outside)")
    expect(get(properties, "Arm 2 Width")).toBe('48"')
    expect(get(properties, "Arm 2 Shelf 2")).toBeDefined()
    expect(get(properties, "Number of Shelves")).toBe("4")
  })
  it("U-Surround order lists three widths", () => {
    const { properties } = buildOrderProperties({ mainType: "usurround", uSurround: { w1: 72, w: 168, w2: 72 }, shelves: s(3) })
    expect(get(properties, "Left Width")).toBe('72"')
    expect(get(properties, "Back Width")).toBe('168"')
    expect(get(properties, "Right Width")).toBe('72"')
    expect(get(properties, "Shelf 3")).toBeDefined()
  })
  it("bookshelf always has a type", () => {
    expect(get(buildOrderProperties({ mainType: "bookshelf", width: 60, shelves: s(1) }).properties, "Type")).toBe("Bookshelf")
  })
})
