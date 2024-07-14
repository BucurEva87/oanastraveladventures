import { z } from "zod"

const updateCityFields = {
  latitude: z.coerce.number().nullable(),
  longitude: z.coerce.number().nullable(),
  description: z.string().nullable(),
}

export const createCitySchema = z.object({
  name: z.string().max(100),
  country: z.string().max(100),
  countryFlag: z.string().max(10),
  countryCode: z.string().length(2),
  sector: z.string().max(100),
  sectorAuto: z.string().max(100),
  ...updateCityFields,
})

export const updateCitySchema = z.object(updateCityFields)
