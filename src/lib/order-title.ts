// Customer-facing design summary shared by the review step and the Shopify line item title.
const FRACTIONS: Record<number, string> = { 1: "⅛", 2: "¼", 3: "⅜", 4: "½", 5: "⅝", 6: "¾", 7: "⅞" }

export function inchesLabel(value: unknown): string {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return "?″"
  const eighths = Math.round(n * 8)
  return `${Math.floor(eighths / 8)}${FRACTIONS[eighths % 8] ?? ""}″`
}

const TITLE_LABELS: Record<string, string> = {
  bookshelf: "Bookshelf", corner: "Corner", usurround: "U-Surround", cathedral: "Cathedral", rack: "Bookshelf",
}

export function designSizeLine(config: any): string {
  const type: string = config?.mainType || "bookshelf"
  const shelves = Array.isArray(config?.shelves) ? config.shelves.length : 0
  const height = config?.dimensions?.height ?? config?.height
  const shelfText = `${shelves} ${shelves === 1 ? "shelf" : "shelves"}`
  let size: string
  if (type === "corner") {
    size = `${inchesLabel(config?.width)} + ${inchesLabel(config?.width2 ?? config?.dimensions?.width2)} W × ${inchesLabel(height)} H`
  } else if (type === "usurround") {
    const u = config?.uSurround || {}
    size = `${inchesLabel(u.w1)} + ${inchesLabel(u.w)} + ${inchesLabel(u.w2)} W × ${inchesLabel(height)} H`
  } else if (type === "cathedral") {
    const c = config?.cathedral || {}
    size = `${inchesLabel(c.width ?? config?.width)} W × ${inchesLabel(c.lowHeight)}–${inchesLabel(c.highHeight)} H`
  } else {
    size = `${inchesLabel(config?.width)} W × ${inchesLabel(height)} H`
  }
  return `${size} · ${shelfText}`
}

export function lineItemTitle(config: any): string {
  const label = TITLE_LABELS[config?.mainType] ?? "Bookshelf"
  const finish = config?.finish ? ` · ${config.finish}` : ""
  return `Custom ${label}${finish} · ${designSizeLine(config)}`
}
