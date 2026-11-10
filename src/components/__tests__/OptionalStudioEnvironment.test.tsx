import { readFileSync } from "node:fs"
import { expect, it } from "vitest"

it("lighting never downloads an external HDR (githack)", () => {
  const src = readFileSync("src/components/OptionalStudioEnvironment.tsx", "utf8")
  expect(src).not.toMatch(/Environment|preset=|githack|\.hdr/)
})
