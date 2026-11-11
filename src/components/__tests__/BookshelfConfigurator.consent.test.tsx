import { beforeEach, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { BookshelfConfigurator } from "../BookshelfConfigurator"

const mocks = vi.hoisted(() => ({ checkout: vi.fn() }))
vi.mock("@/lib/shopify-checkout", () => ({ createShopifyCheckout: mocks.checkout }))
vi.mock("@/lib/redirect-to-checkout", () => ({ redirectToCheckout: vi.fn() }))

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem("pbs_quote_email", "test@example.com")
  mocks.checkout.mockReset().mockResolvedValue("https://www.perfectbookshelf.com/checkouts/test")
})

it("blocks checkout until policy acceptance and submits its timestamp", async () => {
  render(<BookshelfConfigurator />)
  for (let i = 0; i < 4; i++) {
    const button = screen.getAllByRole("button").find(b => /^(next|see quote|review)$/i.test(b.textContent?.trim() ?? ""))
    if (!button) throw new Error("Next button missing")
    fireEvent.click(button)
  }
  const checkout = screen.getByRole("button", { name: "Checkout" })
  expect(checkout).toBeDisabled()
  fireEvent.click(checkout)
  expect(mocks.checkout).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole("checkbox"))
  expect(checkout).toBeEnabled()
  fireEvent.click(checkout)
  await waitFor(() => expect(mocks.checkout).toHaveBeenCalledTimes(1))
  const acceptance = mocks.checkout.mock.calls[0][0].returnPolicyAcceptance
  expect(acceptance.accepted).toBe(true)
  expect(Number.isFinite(Date.parse(acceptance.acceptedAt))).toBe(true)
  fireEvent.click(screen.getByRole("checkbox"))
  expect(checkout).toBeDisabled()
})