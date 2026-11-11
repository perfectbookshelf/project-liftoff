import { describe, expect, it } from "vitest"
import { buildReturnPolicyRecord } from "../return-policy"

describe("Return Policy checkout requirement", () => {
  it("rejects checkout without explicit acceptance", () => {
    expect(() => buildReturnPolicyRecord(null)).toThrow(/agree/)
    expect(() => buildReturnPolicyRecord({ accepted: false, acceptedAt: "2026-11-11T19:16:00Z" })).toThrow(/agree/)
  })
  it("requires a valid timestamp", () => {
    expect(() => buildReturnPolicyRecord({ accepted: true })).toThrow(/agree/)
    expect(() => buildReturnPolicyRecord({ accepted: true, acceptedAt: "invalid" })).toThrow(/agree/)
  })
  it("records the acceptance time and exact policy URL on the draft", () => {
    const record = buildReturnPolicyRecord({ accepted: true, acceptedAt: "2026-11-11T19:16:00Z" }, new Date("2026-11-11T19:17:00Z"))
    expect(record.attributes).toContainEqual({ name: "Return Policy Accepted", value: "true" })
    expect(record.attributes).toContainEqual({ name: "Return Policy Accepted At", value: "2026-11-11T19:16:00.000Z" })
    expect(record.attributes).toContainEqual({ name: "Return Policy URL", value: "https://www.perfectbookshelf.com/policies/refund-policy" })
    expect(record.note).toContain("2026-11-11T19:16:00.000Z")
  })
})