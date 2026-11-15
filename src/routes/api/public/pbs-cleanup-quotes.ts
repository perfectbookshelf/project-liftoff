import { createFileRoute } from "@tanstack/react-router"
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth"
import { cleanupStaleQuoteProducts } from "@/lib/shopify-quote-product.server"

// Daily job: delete hidden "pbs-quote" products whose draft order is still open after 30 days.
export const Route = createFileRoute("/api/public/pbs-cleanup-quotes")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await authenticateCronRequest(request)
        if (denied) return denied
        const store = process.env.SHOPIFY_STORE
        const token = process.env.SHOPIFY_ACCESS_TOKEN
        if (!store || !token) return Response.json({ error: "Missing Shopify configuration" }, { status: 500 })
        const shop = store.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/\.myshopify\.com$/i, "")
        const result = await cleanupStaleQuoteProducts(shop, token)
        return Response.json(result)
      },
    },
  },
})
