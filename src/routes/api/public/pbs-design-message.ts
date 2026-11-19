import { createFileRoute } from "@tanstack/react-router"
import { DesignMessageSchema } from "@/lib/design-message"

/**
 * Public "Talk to us" sink. Validates strictly, caps body size, rate-limits
 * per IP, and writes to `design_messages` (RLS on, service role only).
 */
const MAX_BODY_BYTES = 32_000
const hits = new Map<string, { count: number; resetAt: number }>()
function limited(key: string, now = Date.now()) {
  const e = hits.get(key)
  if (!e || e.resetAt <= now) { hits.set(key, { count: 1, resetAt: now + 10 * 60_000 }); return false }
  e.count += 1
  return e.count > 5
}

export const Route = createFileRoute("/api/public/pbs-design-message")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const raw = await request.text()
        if (raw.length > MAX_BODY_BYTES) return Response.json({ error: "Too large" }, { status: 413 })
        let json: unknown
        try { json = JSON.parse(raw) } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }) }
        const parsed = DesignMessageSchema.safeParse(json)
        if (!parsed.success) return Response.json({ error: "Please check the form." }, { status: 400 })
        const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "?"
        if (limited(ip)) return Response.json({ error: "Too many messages, please try again later." }, { status: 429 })
        const d = parsed.data
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server")
        const { data, error } = await supabaseAdmin.from("design_messages").insert({
          name: d.name, email: d.email, phone: d.phone || null, message: d.message,
          product_type: d.productType ?? null, price: d.price ?? null,
          config: (d.config ?? null) as never,
        }).select("id").single()
        if (error) {
          console.error("[pbs-design-message] insert failed", error.message)
          return Response.json({ error: "Could not send your message." }, { status: 500 })
        }
        return Response.json({ ok: true, id: data.id })
      },
    },
  },
})
