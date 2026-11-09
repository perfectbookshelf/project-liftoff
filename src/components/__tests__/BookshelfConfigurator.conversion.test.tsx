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

function parseRange(text: string): [number, number] {
  const nums = (text.match(/\$[\d,]+/g) ?? []).map((s) => Number(s.replace(/[$,]/g, "")))
  expect(nums.length).toBeGreaterThanOrEqual(2)
  return [nums[0], nums[1]]
}

function parseRange(text: string): [number, number] {
  const nums = (text.match(/\$[\d,]+/g) ?? []).map((s) => Number(s.replace(/[$,]/g, "")))
  expect(nums.length).toBeGreaterThanOrEqual(2)
  return [nums[0], nums[1]]
}

describe("BookshelfConfigurator — conversion features", () => {
  it("shows a named progress tracker and marks completed steps", () => {
    render(<BookshelfConfigurator />)
    const nav = screen.getByRole("navigation", { name: "Progress" })
    for (const label of ["Type", "Size", "Shelves", "Finish", "Review"]) {
      expect(within(nav).getByText(label)).toBeInTheDocument()
    }
    expect(within(nav).queryByRole("button")).toBeNull()

    clickNext()
    // Step 1 is now done and can be revisited from the tracker.
    const back = within(nav).getByRole("button", { name: /go back to type/i })
    fireEvent.click(back)
    expect(within(nav).queryByRole("button")).toBeNull()
  })

  it("Step 1 says how far the price is; Steps 2 and 3 show no pricing", () => {
    const { container } = render(<BookshelfConfigurator />)
    expect(screen.getByTestId("price-steps-left")).toHaveTextContent(/3 steps away/i)

    // Step 2 (Dimensions): no estimate box, no dollar amount anywhere.
    clickNext()
    expect(screen.queryByTestId("price-estimate")).toBeNull()
    expect(container.textContent).not.toMatch(/\$\s?\d/)

    // Step 3 (Shelves): still no pricing, even though "See Quote" is the CTA.
    clickNext()
    expect(screen.queryByTestId("price-estimate")).toBeNull()
    expect(container.textContent).not.toMatch(/\$\s?\d/)
  })

  it("the exact price first appears on the Finish step", () => {
    const { container } = render(<BookshelfConfigurator />)
    clickNext() // → Dimensions
    clickNext() // → Shelves
    expect(container.textContent).not.toMatch(/\$\s?\d/)
    clickNext() // → Finish (email already saved in setup)
    const priceText = screen.getAllByText(/^\$[\d.]+$/)[0].textContent ?? ""
    const exact = Number(priceText.replace("$", ""))
    expect(exact).toBeGreaterThan(0)
    // Never expose square footage or per-square-foot pricing.
    expect(container.textContent).not.toMatch(/sq|ft²|per square/i)
  })

  it("a preset applies its layout and jumps to Dimensions", () => {
    render(<BookshelfConfigurator />)
    fireEvent.click(screen.getByRole("button", { name: /start from slim tower/i }))
    // Header shows the preset width on the Dimensions step.
    expect(screen.getByText(/4' 2" wide/)).toBeInTheDocument()
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

  it("Review shows delivery timeline and shipping facts next to Checkout", () => {
    render(<BookshelfConfigurator />)
    for (let i = 0; i < 4; i++) clickNext()
    const trust = screen.getByTestId("trust-list")
    expect(trust).toHaveTextContent(/25 business days/i)
    expect(trust).toHaveTextContent(/Greenwich, CT/i)
    expect(trust).toHaveTextContent(/shipping/i)
    // No reviews are configured yet, so no review blocks render.
    expect(screen.queryByTestId("review-cards")).toBeNull()
    expect(screen.queryByTestId("review-summary")).toBeNull()
  })
})
