import { beforeEach, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { Safe3DPreview } from "../Safe3DPreview"

vi.unmock("@/components/Safe3DPreview")
beforeEach(() => vi.restoreAllMocks())

it("does not mount 3D when WebGL2 is unavailable, leaving sibling controls usable", () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
  const model = vi.fn(() => <div>Model</div>)
  const onUnavailable = vi.fn()
  const Model = model
  render(<><Safe3DPreview onUnavailable={onUnavailable}><Model /></Safe3DPreview><input aria-label="Width" /></>)
  expect(model).not.toHaveBeenCalled()
  expect(onUnavailable).toHaveBeenCalledTimes(1)
  expect(screen.getByRole("status")).toHaveTextContent("3D preview unavailable")
  expect(screen.getByRole("textbox", { name: "Width" })).toBeEnabled()
})

it("contains model errors without unmounting configurator controls", () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ getExtension: () => null } as unknown as WebGL2RenderingContext)
  vi.spyOn(console, "error").mockImplementation(() => {})
  function BrokenModel(): never { throw new Error("Error creating WebGL context.") }
  const onUnavailable = vi.fn()
  render(<><Safe3DPreview onUnavailable={onUnavailable}><BrokenModel /></Safe3DPreview><input aria-label="Width" /></>)
  expect(onUnavailable).toHaveBeenCalledTimes(1)
  expect(screen.getByRole("status")).toHaveTextContent("3D preview unavailable")
  expect(screen.getByRole("textbox", { name: "Width" })).toBeEnabled()
})