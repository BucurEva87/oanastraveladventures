import { z } from "zod"

const updateLocationFields = {
  type: z.string().max(100).nullable(),
  description: z.string().nullable(),
  website: z.string().max(255).nullable(),
  entryFee: z.coerce.number().positive().nullable(),
  latitude: z.coerce.number().positive().nullable(),
  longitude: z.coerce.number().positive().nullable()
}

export const createLocationSchema = z.object({
  name: z.string().min(1).max(100),
  cityId: z.string().min(25).max(25),
  ...updateLocationFields
})

export const updateLocationschema = z.object(updateLocationFields)
