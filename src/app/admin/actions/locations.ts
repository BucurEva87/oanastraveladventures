"use server"

import prisma from "@/prisma/client"
import { createLocationSchema, updateLocationschema } from "@/schemas/locations"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"

export async function createLocation(prevState: unknown, formData: FormData) {
  const result = createLocationSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success)
    return result.error.formErrors.fieldErrors

  const data = result.data

  await prisma.location.create({
    data: { ...data }
  })

  revalidatePath('/admin/locations')
  redirect('/admin/locations')
}

export async function updateLocation(prevState: unknown, id: string, formData: FormData) {
  const result = updateLocationschema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success)
    return result.error.formErrors.fieldErrors

  const data = result.data

  const location = await prisma.location.findUnique({ where: { id } })

  if (!location) return notFound()

  await prisma.location.update({
    where: { id },
    data: { ...data }
  })

  revalidatePath('/admin/locations')
  redirect('/admin/locations')
}

export async function deleteLocation(id: string) {
  try {
    await prisma.location.delete({ where: { id } })

    revalidatePath('/admin/locations')

    return true
  } catch (error) {
    return false
  }
}
