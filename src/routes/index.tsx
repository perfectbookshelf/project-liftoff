import { createFileRoute } from "@tanstack/react-router"
import { BookshelfConfigurator } from "@/components/BookshelfConfigurator"

const TITLE = "Perfect-Bookshelf — Custom Bookshelf Designer"
const DESCRIPTION =
  "Design your own custom bookshelf, cathedral, portal, or U-surround in minutes. Pick wood, finish, and dimensions, then order made-to-measure."
const URL = "https://create-yours.perfectbookshelf.com/"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Bookshelf Designer",
          description: DESCRIPTION,
          brand: { "@type": "Brand", name: "Perfect-Bookshelf" },
          url: URL,
        }),
      },
    ],
  }),
  component: Index,
})

function Index() {
  return (
    <main className="bg-background">
      <BookshelfConfigurator />
    </main>
  )
}
