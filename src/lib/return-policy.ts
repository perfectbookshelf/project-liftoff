export const RETURN_POLICY_URL = "https://www.perfectbookshelf.com/policies/refund-policy"

export interface ReturnPolicyAcceptance {
  accepted: true
  acceptedAt: string
}

export function buildReturnPolicyRecord(input: unknown, now = new Date()) {
  const acceptance = input as Partial<ReturnPolicyAcceptance> | null
  const acceptedAt = typeof acceptance?.acceptedAt === "string" ? new Date(acceptance.acceptedAt) : null
  if (acceptance?.accepted !== true || !acceptedAt || !Number.isFinite(acceptedAt.getTime()) ||
      acceptedAt.getTime() > now.getTime() + 300_000) {
    throw new Error("Please read and agree to the Return Policy before checkout.")
  }
  return {
    note: `Return Policy accepted at ${acceptedAt.toISOString()} | ${RETURN_POLICY_URL}`,
    attributes: [
      { name: "Return Policy Accepted", value: "true" },
      { name: "Return Policy Accepted At", value: acceptedAt.toISOString() },
      { name: "Return Policy URL", value: RETURN_POLICY_URL },
      { name: "Return Policy Recorded At", value: now.toISOString() },
    ],
  }
}