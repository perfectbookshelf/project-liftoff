import { describe, it, expect } from "vitest"
import { DesignMessageSchema } from "../design-message"

const ok = { name: "Ana", email: "ana@example.com", message: "Can you do 110 inches?" }

describe("DesignMessageSchema", () => {
  it("accepts name, email and message without a phone", () => {
    expect(DesignMessageSchema.safeParse(ok).success).toBe(true)
  })
  it("rejects a missing message", () => {
    expect(DesignMessageSchema.safeParse({ ...ok, message: "  " }).success).toBe(false)
  })
  it("rejects an invalid email", () => {
    expect(DesignMessageSchema.safeParse({ ...ok, email: "ana@" }).success).toBe(false)
  })
})
