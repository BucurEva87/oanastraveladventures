"use server"

import prisma from "@/prisma/client"
import { createRouteSchema, updateRouteSchema } from "@/schemas/routes"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"

export async function createRoute(prevState: unknown, locationsIds: string[], formData: FormData) {
  if (locationsIds.length < 2) return false

  const result = createRouteSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success)
    return result.error.formErrors.fieldErrors

  const data = result.data
  const price = data.priceInCents
  const settings = await prisma.setting.findFirst({ select: { percent: true } }) as { percent: number }

  const route = await prisma.route.create({
    data: {
      ...data,
      priceInCents: price + price / 100 * settings.percent
    }
  })

  await prisma.routeLocation.createMany({
    data: locationsIds.map((location, index) => ({
      locationId: location,
      routeId: route.id,
      position: index + 1
    }))
  })

  revalidatePath('/admin/routes')
  redirect('/admin/routes')
}

export async function updateRoute(prevState: unknown, id: string, locationIds: string[], formData: FormData) {
  const result = updateRouteSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success)
    return result.error.formErrors.fieldErrors

  const data = result.data

  const [route, settings] = await Promise.all([
    await prisma.route.findUnique({ where: { id } }),
    await prisma.setting.findFirst({ select: { percent: true } }) as { percent: number }
  ])
  const price = data.priceInCents

  if (!route) return notFound()

  await Promise.all([
    await prisma.route.update({
      where: { id },
      data: {
        ...data,
        priceInCents: price + price / 100 * settings.percent
      }
    }),
    await prisma.routeLocation.deleteMany({ where: { routeId: id }}),
    await prisma.routeLocation.createMany({
      data: locationIds.map((location, index) => ({
        locationId: location,
        routeId: id,
        position: index + 1
      }))
    })
  ])

  revalidatePath('/admin/routes')
  redirect('/admin/routes')
}

export async function deleteRoute(id: string) {
  try { 
    await prisma.route.delete({ where: { id } })

    revalidatePath('/admin/routes')

    return true
  } catch (error) {
    return false
  }
}

export async function toggleRouteAvailability(id: string, available: boolean) {
  await prisma.route.update({
    where: { id },
    data: { available }
  })

  revalidatePath('/admin/routes')
}
