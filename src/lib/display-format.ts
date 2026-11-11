export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
}

export function formatInches(decimal: number): string {
  const eighths = Math.round(decimal * 8)
  const whole = Math.floor(eighths / 8)
  const fraction: Record<number, string> = { 1: "1/8", 2: "1/4", 3: "3/8", 4: "1/2", 5: "5/8", 6: "3/4", 7: "7/8" }
  return `${whole}${eighths % 8 ? ` ${fraction[eighths % 8]}` : ""}"`
}