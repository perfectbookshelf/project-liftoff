export interface PhotoRenderInput {
  imageDataUrl: string
  finishLabel: string
  typeLabel: string
  dimensions: string
  finishId?: string
}

export function photoRenderForm(data: PhotoRenderInput): FormData {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(data.imageDataUrl)
  if (!match) throw new Error("Invalid image input")
  const binary = atob(match[2])
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  const [structure, front] = (data.finishId || "").split("/")
  const materials = structure && front
    ? `Structural shelves, sides and backs: ${structure}. Front vertical baguettes/trim only: ${front}. White Oak means natural white oak wood, NOT white paint. White trim is solid matte white, black trim is solid matte black. Do not reverse these finishes.`
    : `Match the material placement in the reference and the selected finish: ${data.finishLabel}.`
  const form = new FormData()
  form.set("model", "openai/gpt-image-2.5-sunburst")
  form.set("image", new File([bytes], "grounded-furniture.png", { type: match[1] }))
  form.set("size", "1536x1024")
  form.set("quality", "high")
  form.set("output_format", "png")
  form.set("prompt", `Edit the reference into a photorealistic furniture catalogue photograph.
REFERENCE ROLE: the supplied image is the exact furniture design with its base already grounded. Furniture: ${data.typeLabel}, dimensions in inches: ${data.dimensions}, finish: ${data.finishLabel}.
KEEP UNCHANGED: the exact silhouette, proportions, shelf count, stepped/sloped profile, divisions, open gaps between modules, panel thickness and material assignment. Do not add, remove or rearrange pieces. ${materials}
CHANGE ONLY: the surrounding room, lighting and material realism. Show natural wood grain with clean handcrafted joinery, a modest modern residential room, daylight, off-white wall and light wood plank floor. No gallery, oversized loft or dramatic low-angle perspective.
FLOOR CONTACT: preserve the grounded reference. The lowest existing board rests directly on the floor; its underside and floor meet with a tight contact shadow and absolutely no air gap. No levitation, wall mounting, feet, legs, pedestal, plinth or invented support. Keep the entire base and floor contact visible.
COMPOSITION: full furniture clearly visible, approximately 75% of image height, natural eye-level three-quarter view, crisp furniture detail. No people, text, logos, books or decorations. Do not crop the top or base.`)
  return form
}