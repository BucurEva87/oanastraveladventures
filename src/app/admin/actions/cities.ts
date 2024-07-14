"use server"

import prisma from "@/prisma/client"
import { createCitySchema, updateCitySchema } from "@/schemas/cities"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"

export async function createCity(prevState: unknown, formData: FormData) {
  const result = createCitySchema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success)
    return result.error.formErrors.fieldErrors

  const data = result.data

  await prisma.city.create({
    data: { ...data }
  })

  revalidatePath('/admin/cities')
  redirect('/admin/cities')
}

export async function updateCity(prevState: unknown, id: string, formData: FormData) {
  const result = updateCitySchema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success)
    return result.error.formErrors.fieldErrors

  const data = result.data

  const city = await prisma.city.findUnique({ where: { id } })

  if (!city) return notFound()

  await prisma.city.update({
    where: { id },
    data: { ...data }
  })

  revalidatePath('/admin/cities')
  redirect('/admin/cities')
}

export async function deleteCity(id: string) {
  try {
    await prisma.city.delete({ where: { id } })

    revalidatePath('/admin/cities')

    return true
  } catch (error) {
    return false
  }
}
