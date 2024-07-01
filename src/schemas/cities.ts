import { z } from 'zod'

export const createCitySchema = z.object({
  name: z.string().max(100),
  country: z.string().max(100),
  countryFlag: z.string().max(10),
  countryCode: z.string().length(2),
  sector: z.string().max(100),
  sectorAuto: z.string().max(100),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  description: z.string().nullable()
})

export const updateCitySchema = z.object({
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  description: z.string().nullable()
})
