import { beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { BookshelfConfigurator } from "../BookshelfConfigurator"

const mocks = vi.hoisted(() => ({ render: vi.fn(), capture: vi.fn() }))
vi.mock("@tanstack/react-start", async (original) => ({ ...(await original<typeof import("@tanstack/react-start")>()), useServerFn: () => mocks.render }))
vi.mock("@/components/Bookshelf3DView", async () => {
  const React = await import("react")
  return { Bookshelf3DView: React.forwardRef((_, ref) => {
    React.useImperativeHandle(ref, () => ({ captureImage: mocks.capture }))
    return null
  }) }
})

function click(name: string) { fireEvent.click(screen.getByRole("button", { name, exact: true })) }
async function finish() {
  render(<BookshelfConfigurator />)
  click("Next"); click("Next"); click("See Quote")
  await waitFor(() => expect(screen.getByRole("button", { name: "Generate AI photo render of your bookshelf" })).toBeInTheDocument())
}
const trigger = () => click("Generate AI photo render of your bookshelf")
const image = "data:image/png;base64,bmV3"

beforeEach(() => {
  localStorage.removeItem("bookshelf-config")
  mocks.render.mockReset()
  mocks.capture.mockReset().mockResolvedValue("data:image/png;base64,aGk=")
})

describe("Finish photos", () => {
  it("generates only on click, uses grounded capture, and is absent from Review", async () => {
    mocks.render.mockResolvedValue({ imageDataUrl: image })
    await finish()
    expect(mocks.render).not.toHaveBeenCalled()
    trigger()
    await screen.findByAltText("Photoreal bookshelf render")
    expect(mocks.capture).toHaveBeenCalledWith({ grounded: true })
    click("Close")
    click("Maple")
    expect(screen.queryByRole("button", { name: "View generated photo" })).toBeNull()
    expect(mocks.render).toHaveBeenCalledTimes(1)
    click("Review")
    expect(screen.queryByRole("button", { name: "Generate AI photo render of your bookshelf" })).toBeNull()
    expect(screen.getByRole("button", { name: "Checkout", exact: true })).toBeInTheDocument()
  })
  it("discards late responses after switching wood even when a new photo has finished", async () => {
    let resolveOld: ((value: { imageDataUrl: string }) => void) | undefined
    mocks.render.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve }))
      .mockResolvedValueOnce({ imageDataUrl: image })
    await finish(); trigger()
    await waitFor(() => expect(mocks.render).toHaveBeenCalledTimes(1))
    click("Close"); click("Maple"); trigger()
    await screen.findByAltText("Photoreal bookshelf render")
    await act(async () => { resolveOld?.({ imageDataUrl: "old-image" }) })
    expect(screen.getByAltText("Photoreal bookshelf render")).toHaveAttribute("src", image)
    expect(mocks.render.mock.calls[1][0].data.finishId).toBe("Maple/Maple")
  })
  it("allows a new user click after an error", async () => {
    mocks.render.mockRejectedValueOnce(new Error("Photo service unavailable"))
      .mockResolvedValueOnce({ imageDataUrl: image })
    await finish(); trigger()
    await screen.findByText("Photo service unavailable")
    fireEvent.click(screen.getByRole("button", { name: /Regenerate/ }))
    await screen.findByAltText("Photoreal bookshelf render")
    expect(mocks.render).toHaveBeenCalledTimes(2)
  })
})