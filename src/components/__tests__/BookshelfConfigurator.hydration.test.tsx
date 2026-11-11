import { beforeEach, describe, expect, it } from "vitest"
import { render, waitFor } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { BookshelfConfigurator } from "@/components/BookshelfConfigurator"

const savedDesign = {
  mainType: "usurround", uW: 168, uW1: 72, uW2: 72,
  selectedFinish: "Maple/Maple", stepIndex: 3,
  shelves: Array.from({ length: 3 }, () => ({ height: 14, depth: 14 })),
}

beforeEach(() => localStorage.clear())

describe("saved design hydration", () => {
  it("does not read browser storage into the server or first-render markup", () => {
    const fresh = renderToString(<BookshelfConfigurator />)
    localStorage.setItem("bookshelf-config", JSON.stringify(savedDesign))
    localStorage.setItem("pbs_quote_email", "returning@example.com")
    expect(renderToString(<BookshelfConfigurator />)).toBe(fresh)
  })

  it("restores the U dimensions and three tiers without overwriting them with defaults", async () => {
    localStorage.setItem("bookshelf-config", JSON.stringify(savedDesign))
    localStorage.setItem("pbs_quote_email", "returning@example.com")
    render(<BookshelfConfigurator />)
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("bookshelf-config") ?? "{}")
      expect(stored).toMatchObject({
        mainType: "usurround", uW: 168, uW1: 72, uW2: 72,
        shelves: savedDesign.shelves, selectedFinish: "Maple/Maple", stepIndex: 3,
      })
    })
  })
})