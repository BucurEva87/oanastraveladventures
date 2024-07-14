import { z } from 'zod'

const booleanString = z.preprocess(value => {
  if (typeof value === 'string')
    return value === 'true'

  return false
}, z.boolean())

export const createRouteSchema = z.object({
  name: z.string().min(1).max(100),
  available: booleanString.default(false),
  description: z.string().nullable(),
  circular: booleanString.default(false),
  length: z.coerce.number().positive(),
  priceInCents: z.coerce.number().min(1)
})

export const updateRouteSchema = createRouteSchema
