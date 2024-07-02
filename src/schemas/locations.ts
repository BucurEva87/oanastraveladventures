import { z } from "zod"

export const createLocationSchema = z.object({
  name: z.string().min(1).max(100),
  cityId: z.string().min(25).max(25),
  type: z.string().max(100).nullable(),
  description: z.string().nullable(),
  website: z.string().max(255).nullable(),
  entryFee: z.number().positive().nullable(),
  latitude: z.number().positive().nullable(),
  longitude: z.number().positive().nullable()
})
