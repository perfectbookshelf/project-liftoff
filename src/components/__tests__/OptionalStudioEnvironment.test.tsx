import { render, screen, cleanup } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import { Suspense } from "react"
import { OptionalStudioEnvironment } from "../OptionalStudioEnvironment"

const lighting = vi.hoisted(() => ({ mode: "pending" }))
vi.mock("@react-three/drei", () => ({
  Environment: () => {
    if (lighting.mode === "pending") throw new Promise(() => {})
    throw new Error("HDR unavailable")
  },
}))
afterEach(() => { cleanup(); vi.restoreAllMocks() })

it("keeps furniture visible while external lighting is pending", () => {
  lighting.mode = "pending"
  render(<Suspense fallback={<div>Scene loading</div>}><div>Furniture</div><OptionalStudioEnvironment /></Suspense>)
  expect(screen.getByText("Furniture")).toBeVisible()
  expect(screen.queryByText("Scene loading")).toBeNull()
})

it("keeps furniture visible when external lighting fails", () => {
  lighting.mode = "failed"
  vi.spyOn(console, "error").mockImplementation(() => {})
  render(<><div>Furniture</div><OptionalStudioEnvironment /></>)
  expect(screen.getByText("Furniture")).toBeVisible()
})