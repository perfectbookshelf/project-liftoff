// Builds the production-facing line-item properties for a Shopify order.
// Every product type writes all the geometry the workshop needs.

type Shelf = { height: number; depth: number }
type Prop = { name: string; value: string }

const TYPE_LABELS: Record<string, string> = {
  bookshelf: "Bookshelf",
  corner: "Corner",
  usurround: "U-Surround",
  cathedral: "Cathedral",
  rack: "Rack",
}

const shelfList = (shelves: Shelf[]) => (Array.isArray(shelves) ? shelves : [])

export function buildOrderProperties(config: any): { properties: Prop[]; summary: string; title: string } {
  const mainType: string = config?.mainType || config?.bookshelfType || "bookshelf"
  const dims = config?.dimensions || {}
  const width = config?.width ?? dims.width ?? dims.W
  const height = config?.height ?? dims.height ?? dims.H
  const shelves = shelfList(config?.shelves)
  const props: Prop[] = []
  let typeLabel = TYPE_LABELS[mainType] || "Bookshelf"
  if (mainType === "corner" && config?.cornerVariant) typeLabel += ` (${config.cornerVariant})`
  props.push({ name: "Type", value: typeLabel })
  props.push({ name: "Total Height", value: height ? `${Number(height).toFixed(2)}"` : "Not specified" })

  const pushShelves = (prefix: string, list: Shelf[]) =>
    list.forEach((s, i) => props.push({ name: `${prefix}Shelf ${i + 1}`, value: `${s.height}" H x ${s.depth}" D` }))

  let summary = ""
  let count = shelves.length
  if (mainType === "corner") {
    const shelves2 = shelfList(config?.shelves2).length ? shelfList(config?.shelves2) : shelves
    const width2 = config?.width2 ?? dims.width2
    count = shelves.length + shelves2.length
    props.push({ name: "Number of Shelves", value: String(count) })
    props.push({ name: "Arm 1 Width", value: `${width ?? "?"}"` })
    pushShelves("Arm 1 ", shelves)
    props.push({ name: "Arm 2 Width", value: `${width2 ?? "?"}"` })
    pushShelves("Arm 2 ", shelves2)
    summary = `Arm 1 ${width}" + Arm 2 ${width2}"`
  } else if (mainType === "usurround") {
    const u = config?.uSurround || {}
    props.push({ name: "Number of Sides", value: "3" })
    props.push({ name: "Left Width", value: `${u.w1 ?? "?"}"` })
    props.push({ name: "Back Width", value: `${u.w ?? "?"}"` })
    props.push({ name: "Right Width", value: `${u.w2 ?? "?"}"` })
    props.push({ name: "Shelves per Wall", value: String(shelves.length) })
    pushShelves("", shelves)
    summary = `Left ${u.w1}" / Back ${u.w}" / Right ${u.w2}"`
  } else if (mainType === "cathedral") {
    const c = config?.cathedral || {}
    props.push({ name: "Width", value: `${c.width ?? width ?? "?"}"` })
    props.push({ name: "Low Height", value: `${c.lowHeight ?? "?"}"` })
    props.push({ name: "High Height", value: `${c.highHeight ?? "?"}"` })
    props.push({ name: "Direction", value: String(c.direction ?? "?") })
    props.push({ name: "Number of Shelves", value: String(count) })
    pushShelves("", shelves)
    summary = `${c.width ?? width}" W, ${c.lowHeight}"–${c.highHeight}" H`
  } else {
    props.push({ name: "Width", value: width ? `${width}"` : "Not specified" })
    props.push({ name: "Number of Shelves", value: String(count) })
    pushShelves("", shelves)
    summary = `${width ?? "?"}" W`
  }
  if (!count) props.push({ name: "Shelf Configuration", value: "No shelves configured" })
  props.push({ name: "Finish", value: config?.finish || "Not selected" })

  return {
    properties: props,
    title: `Custom ${typeLabel} - Configuration`,
    summary: `${typeLabel} | ${config?.finish || "N/A"} | ${summary} x ${height ?? "?"}" H | ${count} shelves`,
  }
}
