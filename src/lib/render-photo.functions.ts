import { createServerFn } from "@tanstack/react-start";

interface RenderInput {
  imageDataUrl: string;
  finishLabel: string;
  typeLabel: string;
  dimensions: string;
  finishId?: string;
}

export const renderPhotoreal = createServerFn({ method: "POST" })
  .inputValidator((input: RenderInput) => {
    if (!input || typeof input.imageDataUrl !== "string" || !input.imageDataUrl.startsWith("data:image/")) {
      throw new Error("Invalid image input");
    }
    if (input.imageDataUrl.length > 8_000_000) {
      throw new Error("Image too large");
    }
    return {
      imageDataUrl: input.imageDataUrl,
      finishLabel: String(input.finishLabel || "").slice(0, 120),
      typeLabel: String(input.typeLabel || "").slice(0, 120),
      dimensions: String(input.dimensions || "").slice(0, 120),
      finishId: String(input.finishId || "").slice(0, 60),
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const { photoRenderForm } = await import("./photo-render-request")
    const res = await fetch("https://ai.gateway.lovable.dev/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: photoRenderForm(data),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      let message = ""
      try {
        const error = JSON.parse(body)
        message = error.error?.message || error.message || ""
      } catch { /* Do not expose an HTML error page. */ }
      if (res.status === 402 || res.status === 403 || res.status === 401 || res.status === 404) {
        throw new Error(message || `Photo service unavailable (${res.status}).`)
      }
      throw new Error(`Render failed (${res.status}): ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as {
      data?: Array<{ b64_json?: string }>;
    };

    const base64 = json.data?.[0]?.b64_json;
    if (!base64) throw new Error("No image returned by AI");
    return { imageDataUrl: `data:image/png;base64,${base64}` };
  });
