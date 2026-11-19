/**
 * Reviews and store facts shown inside the configurator.
 *
 * REVIEWS: only real customer reviews that the customer authorised for
 * marketing use. Never invent, edit the meaning of, or "improve" a review.
 * Every review block renders nothing while this list is empty, so the UI
 * is safe to ship before reviews are collected.
 *
 * REVIEW_SUMMARY: the aggregate rating as published by the review app
 * (Judge.me). Leave it null until there are enough reviews to show — the
 * star line is hidden while it is null or below MIN_REVIEWS_FOR_SUMMARY.
 *
 * STORE_FACTS: copied from the published Shopify policies (Shipping and
 * Refund & Cancellation, effective June 2026). Update them together with the
 * policies.
 */

export interface Review {
  /** As the customer wants to be shown, e.g. "Sarah K." */
  name: string
  /** City and state, e.g. "Brooklyn, NY". Optional. */
  location?: string
  rating: 1 | 2 | 3 | 4 | 5
  /** The review text, verbatim. Keep the short ones for the email sheet. */
  text: string
  /** Customer photo, with permission. Hosted on the Shopify CDN. */
  photoUrl?: string
  /** What they bought, e.g. "Bookshelf · Walnut". */
  product?: string
}

export const REVIEWS: Review[] = [
  {
    name: "Leslie S.",
    location: "Raleigh, NC",
    rating: 5,
    text: "Fabulous shelf! So easy to put together! Looks stunning in my space!! Thank you!!!!",
  },
  {
    name: "Christine D.",
    rating: 5,
    text: "10 years of not knowing what we were going to do with this wall... And thanks to you, we knew.",
  },
  {
    name: "Andrea P.",
    rating: 5,
    text: "Two years ago we bought a bookcase from Perfect Bookshelf and we're very happy with the solution we've installed - we've just recommended two extra floors!",
  },
  {
    name: "Caroline P.",
    rating: 5,
    text: "Assembly in 45 minutes without any difficulties or tools, as in the video on the website.",
  },
]

export interface CustomerPhoto {
  url: string
  alt: string
  caption: string
}

/** Real installation photography already published on the Perfect Bookshelf store. */
export const CUSTOMER_PHOTOS: CustomerPhoto[] = [
  {
    url: "https://www.perfectbookshelf.com/cdn/shop/files/tpb-real-oak-stairs.jpg?v=1791245270&width=900",
    alt: "Oak bookshelf wall beside a staircase and piano in a customer's home",
    caption: "Oak · Customer home",
  },
  {
    url: "https://www.perfectbookshelf.com/cdn/shop/files/tpb-real-corner-living.jpg?v=1791245270&width=900",
    alt: "White and oak corner bookshelf in a customer's living room",
    caption: "White + Oak · Customer home",
  },
  {
    url: "https://www.perfectbookshelf.com/cdn/shop/files/tpb-real-oak-black-tv.jpg?v=1794205300&width=900",
    alt: "Oak and black bookshelf wall around a TV in a customer's home",
    caption: "Oak + Black · Customer home",
  },
]

export interface ReviewSummary {
  average: number
  count: number
  /** Where the numbers come from, e.g. "Judge.me". */
  source: string
}

export const REVIEW_SUMMARY: ReviewSummary | null = {
  average: 4.98,
  count: 57,
  source: "Perfect Bookshelf customer reviews",
}

export const MIN_REVIEWS_FOR_SUMMARY = 5

export const STORE_FACTS = {
  freeShippingThreshold: 600,
  freeShippingRegion: "contiguous US",
  productionBusinessDays: 25,
  transitBusinessDays: "2–7",
  madeIn: "Greenwich, CT",
  insuredThreshold: 600,
} as const

/** Short reviews (for tight spaces like the email sheet), best first. */
export function shortReviews(maxChars = 140): Review[] {
  return REVIEWS.filter((r) => r.rating >= 4 && r.text.length <= maxChars)
}

export function photoReviews(): Review[] {
  return REVIEWS.filter((r) => r.rating >= 4 && !!r.photoUrl)
}

export function visibleSummary(): ReviewSummary | null {
  if (!REVIEW_SUMMARY) return null
  if (REVIEW_SUMMARY.count < MIN_REVIEWS_FOR_SUMMARY) return null
  return REVIEW_SUMMARY
}
