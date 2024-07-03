import { z } from 'zod'

export const createRouteSchema = z.object({
  name: z.string().min(1).max(100),
  available: z.boolean().default(true),
  description: z.string().nullable(),
  prices: z.array(z.object({
    people: z.number().positive().optional(),
    price: z.number().positive().optional()
  })).min(1),
  circular: z.boolean().default(true),
  length: z.number().positive()
})

export const insertRouteSchema = z.object({
  name: z.string().min(1).max(100),
  available: z.boolean().default(true),
  description: z.string().nullable(),
  prices: z.string().min(1),
  circular: z.boolean().default(true),
  length: z.number().positive()
})
