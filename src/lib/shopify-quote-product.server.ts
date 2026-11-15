// One hidden Shopify product per checkout quote, so the 3D render shows as the
// checkout thumbnail. Products are tagged "pbs-quote" and never published to a channel.
import { shopifyGraphQL } from "./shopify-files.server"

export const QUOTE_TAG = "pbs-quote"
const DRAFT_TAG_PREFIX = "pbs-draft-"

export async function createQuoteProduct(
  shop: string, token: string,
  input: { title: string; price: string; imageUrl: string | null },
): Promise<{ productId: string; variantId: number } | null> {
  const created = await shopifyGraphQL<any>(shop, token,
    `mutation($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
      productCreate(product: $product, media: $media) {
        product { id variants(first: 1) { nodes { id } } }
        userErrors { field message }
      }
    }`,
    {
      product: { title: input.title.slice(0, 255), status: "ACTIVE", tags: [QUOTE_TAG], productType: "Custom quote", vendor: "The Perfect Bookshelf" },
      media: input.imageUrl ? [{ originalSource: input.imageUrl, mediaContentType: "IMAGE", alt: input.title.slice(0, 255) }] : [],
    })
  const product = created?.productCreate?.product
  const variantGid: string | undefined = product?.variants?.nodes?.[0]?.id
  if (!product?.id || !variantGid) {
    console.warn("Quote productCreate failed", JSON.stringify(created?.productCreate?.userErrors))
    return null
  }
  const updated = await shopifyGraphQL<any>(shop, token,
    `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) { userErrors { field message } }
    }`,
    { productId: product.id, variants: [{ id: variantGid, price: input.price, taxable: true, inventoryPolicy: "CONTINUE", inventoryItem: { tracked: false, requiresShipping: true } }] })
  const errors = updated?.productVariantsBulkUpdate?.userErrors
  if (!updated || errors?.length) {
    console.warn("Quote variant price update failed", JSON.stringify(errors))
    await deleteProduct(shop, token, product.id)
    return null
  }
  return { productId: product.id, variantId: Number(variantGid.split("/").pop()) }
}

export async function tagQuoteWithDraft(shop: string, token: string, productId: string, draftId: number | string) {
  await shopifyGraphQL(shop, token,
    `mutation($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { message } } }`,
    { id: productId, tags: [`${DRAFT_TAG_PREFIX}${draftId}`] })
}

export async function deleteProduct(shop: string, token: string, productId: string) {
  await shopifyGraphQL(shop, token,
    `mutation($input: ProductDeleteInput!) { productDelete(input: $input) { deletedProductId } }`,
    { input: { id: productId } })
}

/** Deletes quote products older than `days` whose draft order is still open (or was never created). */
export async function cleanupStaleQuoteProducts(shop: string, token: string, days = 30, now = new Date()) {
  const cutoff = new Date(now.getTime() - days * 86_400_000).toISOString()
  const data = await shopifyGraphQL<any>(shop, token,
    `query($q: String!) { products(first: 50, query: $q) { nodes { id tags } } }`,
    { q: `tag:${QUOTE_TAG} AND created_at:<'${cutoff}'` })
  const result = { checked: 0, deleted: 0, kept: 0 }
  for (const p of data?.products?.nodes ?? []) {
    if (!p.tags.includes(QUOTE_TAG)) continue
    result.checked++
    const draftTag: string | undefined = p.tags.find((t: string) => t.startsWith(DRAFT_TAG_PREFIX))
    let open = true
    if (draftTag) {
      const res = await fetch(`https://${shop}.myshopify.com/admin/api/2025-01/draft_orders/${draftTag.slice(DRAFT_TAG_PREFIX.length)}.json`,
        { headers: { "X-Shopify-Access-Token": token } })
      if (res.ok) open = (await res.json())?.draft_order?.status === "open"
      else if (res.status !== 404) { result.kept++; continue }
    }
    if (open) { await deleteProduct(shop, token, p.id); result.deleted++ }
    else {
      // Ordered: keep the product for the order history, stop checking it.
      await shopifyGraphQL(shop, token,
        `mutation($id: ID!, $tags: [String!]!) { tagsRemove(id: $id, tags: $tags) { userErrors { message } } }`,
        { id: p.id, tags: [QUOTE_TAG] })
      await shopifyGraphQL(shop, token,
        `mutation($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { message } } }`,
        { id: p.id, tags: ["pbs-quote-ordered"] })
      result.kept++
    }
  }
  return result
}
