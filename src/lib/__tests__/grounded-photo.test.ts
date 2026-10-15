import { describe, it, expect } from "vitest"
import * as THREE from "three"
import { prepareGroundedPhoto } from "../grounded-photo"
import { photoRenderForm } from "../photo-render-request"

describe("photo reference", () => {
  it("grounds even elevated furniture without changing the preview", () => {
    const group = new THREE.Group()
    group.position.y = 10
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(70, 60, 14))
    mesh.position.y = 30
    group.add(mesh)
    const before = new THREE.Box3().setFromObject(group)
    const photo = prepareGroundedPhoto(group, null, "hsl(0 0% 96%)")
    const after = new THREE.Box3().setFromObject(photo.model)
    expect(after.min.y).toBeCloseTo(0)
    expect(after.getSize(new THREE.Vector3()).toArray()).toEqual(before.getSize(new THREE.Vector3()).toArray())
    expect(group.position.y).toBe(10)
    expect(photo.floor.position.y).toBeCloseTo(-0.005)
    expect(photo.floor.receiveShadow).toBe(true)
  })
  it("uploads real image bytes and preserves oak structure with white baguettes", () => {
    const form = photoRenderForm({ imageDataUrl: "data:image/png;base64,aGk=", finishId: "Oak/White", finishLabel: "White Oak / White", typeLabel: "Bookshelf", dimensions: "70 × 60" })
    expect(form.get("model")).toBe("openai/gpt-image-2.5-sunburst")
    expect(form.get("image")).toBeInstanceOf(File)
    expect(form.get("prompt")).toContain("Structural shelves, sides and backs: Oak")
    expect(form.get("prompt")).toContain("baguettes/trim only: White")
    expect(form.has("response_format")).toBe(false)
  })
})