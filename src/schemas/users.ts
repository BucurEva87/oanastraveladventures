import { z } from 'zod'

const roles = ['ADMIN', 'MODERATOR', 'USER'] as const

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  emailVerified: z.string().datetime().optional(),
  role: z.enum(roles).optional()
})
