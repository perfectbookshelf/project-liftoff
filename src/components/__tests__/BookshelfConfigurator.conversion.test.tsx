/**
 * Conversion features: progress tracker, early price estimate, presets,
 * consultation link and trust list.
 */
import { describe, expect, it, beforeEach } from "vitest"
import { render, screen, fireEvent, within } from "@testing-library/react"
import { BookshelfConfigurator } from "@/components/BookshelfConfigurator"

beforeEach(() => {
  try {
    localStorage.clear()
    localStorage.setItem("pbs_quote_email", "test@example.com")
  } catch {
    /* ignore */
  }
})

function clickNext() {
  const nav = screen
    .getAllByRole("button")
    .find((b) => /^next$|^review$|^see quote$/i.test(b.textContent?.trim() ?? ""))
  expect(nav).toBeTruthy()
  fireEvent.click(nav!)
}

describe("BookshelfConfigurator — conversion features", () => {
  it("shows a named progress tracker and marks completed steps", () => {
    render(<BookshelfConfigurator />)
    const nav = screen.getByRole("navigation", { name: "Progress" })
    for (const label of ["Type", "Size", "Shelves", "Preview", "Review"]) {
      expect(within(nav).getByText(label)).toBeInTheDocument()
    }
    expect(within(nav).queryByRole("button")).toBeNull()

    clickNext()
    // Step 1 is now done and can be revisited from the tracker.
    const back = within(nav).getByRole("button", { name: /go back to type/i })
    fireEvent.click(back)
    expect(within(nav).queryByRole("button")).toBeNull()
  })

  it("shows the exact default-size estimate before the email gate", () => {
    render(<BookshelfConfigurator />)
    expect(screen.getByTestId("price-steps-left")).toHaveTextContent(/3 steps away/i)

    // 69.75 × 59.75 in = 28.9427 sq ft. At $74.37–$99.24/sq ft,
    // rounded outwards to $50, the estimate must be $2,150–$2,900.
    clickNext()
    expect(screen.getByTestId("price-estimate")).toHaveTextContent("$2,150")
    expect(screen.getByTestId("price-estimate")).toHaveTextContent("$2,900")

    clickNext()
    expect(screen.getByTestId("price-estimate")).toHaveTextContent("$2,150")
    expect(screen.getByTestId("price-estimate")).toHaveTextContent("$2,900")
  })

  it("the exact finish price first appears on the Preview step", () => {
    const { container } = render(<BookshelfConfigurator />)
    clickNext() // → Dimensions
    clickNext() // → Shelves
    expect(screen.getByTestId("price-estimate")).toHaveTextContent("$2,150 – $2,900")
    clickNext() // → Preview (email already saved in setup)
    const priceText = screen.getAllByText(/^\$[\d,.]+$/)[0].textContent ?? ""
    const exact = Number(priceText.replace(/[$,]/g, ""))
    expect(exact).toBeGreaterThan(0)
    // Never expose square footage or per-square-foot pricing.
    expect(container.textContent).not.toMatch(/sq|ft²|per square/i)
  })

  it("Step 4 is named Preview and the photo card invites the click", () => {
    render(<BookshelfConfigurator />)
    clickNext() // → Dimensions
    clickNext() // → Shelves
    clickNext() // → Preview (email already saved in setup)
    // Both the step header and the progress tracker say Preview; nothing says Finish.
    expect(screen.getAllByText("Preview").length).toBeGreaterThan(1)
    expect(screen.queryByText("Finish")).toBeNull()
    // The word "Preview" is called out in the photo card with a click prompt.
    expect(screen.getByTestId("preview-word")).toHaveTextContent("Preview")
    expect(screen.getByText(/click here to see it in a real room/i)).toBeInTheDocument()
  })

  it("a preset applies its layout and jumps to Dimensions", () => {
    render(<BookshelfConfigurator />)
    fireEvent.click(screen.getByRole("button", { name: /start from slim tower/i }))
    // Header shows the preset width on the Dimensions step.
    expect(screen.getByText(/50" wide/)).toBeInTheDocument()
    clickNext()
    // Six shelves, with the depth stepping down.
    expect(screen.getByText("Shelf 6")).toBeInTheDocument()
  })

  it("a preset of a different type keeps its own shelf count", () => {
    render(<BookshelfConfigurator />)
    fireEvent.click(screen.getByRole("button", { name: /start from library wall/i }))
    fireEvent.click(screen.getByRole("button", { name: /go back to type/i }))
    fireEvent.click(screen.getByRole("button", { name: /start from low console/i }))
    clickNext()
    expect(screen.getByText("Shelf 2")).toBeInTheDocument()
    expect(screen.queryByText("Shelf 3")).toBeNull()
  })

  it("Dimensions offers the free consultation", () => {
    render(<BookshelfConfigurator />)
    clickNext()
    expect(screen.getByRole("button", { name: /book a free consultation/i })).toBeInTheDocument()
  })

  it("Review shows the warranty, shipping, real reviews and installation photos", () => {
    render(<BookshelfConfigurator />)
    expect(screen.getByTestId("review-summary")).toHaveTextContent("4.98")
    expect(screen.getByTestId("review-summary")).toHaveTextContent("57 reviews")
    for (let i = 0; i < 4; i++) clickNext()
    const trust = screen.getByTestId("trust-list")
    expect(trust).toHaveTextContent(/5-year warranty/i)
    expect(trust).not.toHaveTextContent(/25 business days|24 hours/i)
    expect(trust).toHaveTextContent(/shipping/i)
    expect(screen.getByTestId("review-cards")).toHaveTextContent("Leslie S.")
    expect(screen.getByTestId("customer-photos").querySelectorAll("img")).toHaveLength(3)
  })
})
