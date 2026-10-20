/**
 * Two-tone finish convention: "Wood/Accent".
 * - First part = wood (sides, back, horizontal boards)
 * - Second part = baguette / front accent
 * Oak/White is the exception: white sides/boards, oak backs/baguettes.
 * Single-tone finishes (no slash) use the same value for everything.
 */
export interface SplitFinish {
  internalFinish: string // sides + boards
  frameFinish: string // baguettes (front accent)
  backFinish: string // back panel
}

export function splitFinish(finish: string): SplitFinish {
  const parts = finish.includes("/") ? finish.split("/").map((s) => s.trim()) : null
  if (!parts) {
    return { internalFinish: finish, frameFinish: finish, backFinish: finish }
  }
  if (parts[0] === "Oak" && parts[1] === "White") {
    return { internalFinish: "White", frameFinish: "Oak", backFinish: "Oak" }
  }
  return {
    internalFinish: parts[0],
    frameFinish: parts[1],
    backFinish: parts[0],
  }
}
