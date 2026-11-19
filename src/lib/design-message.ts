import { z } from "zod"

/** Shared validation for the "Talk to us" message form (browser + server). */
export const DesignMessageSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(40).regex(/^[0-9+()\-.\s]*$/, "Digits only").optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please write a short message").max(2000),
  productType: z.string().max(32).optional().nullable(),
  price: z.number().finite().min(0).max(1_000_000).optional().nullable(),
  config: z.record(z.string(), z.unknown()).optional().nullable(),
})

export type DesignMessageInput = z.infer<typeof DesignMessageSchema>
