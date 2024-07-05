import { z } from 'zod'

const baseCreateRouteSchema = {
  name: z.string().min(1).max(100),
  available: z.boolean().default(true),
  description: z.string().nullable(),
  circular: z.boolean().default(true),
  length: z.number().positive()
}

export const createRouteSchema = z.object({
  ...baseCreateRouteSchema,
  prices: z.array(z.object({
    people: z.number().positive().optional(),
    price: z.number().positive().optional()
  })).min(1)
})

export const insertRouteSchema = z.object({
  ...baseCreateRouteSchema,
  prices: z.string().min(1)
})
