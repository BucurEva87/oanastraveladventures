"use server"

import prisma from "@/prisma/client"
import { revalidatePath } from "next/cache"

export async function getSettings() {
  return await prisma.setting.findFirst({
    select: {
      metric: true,
      percent: true
    }
  })
}

export async function updateMetric(metric: 'miles' | 'km') {
  const id = (await prisma.setting.findFirst({ select: { id: true } }))!.id

  await prisma.setting.update({
    where: { id },
    data: { metric }
  })

  revalidatePath('/admin/routes')
}

export async function updatePercent(percent: number) {
  if (percent < 0.01) return

  const { id, percent: oldPercent } = (await prisma.setting.findFirst({
    select: {
      id: true,
      percent: true
    }
  }))!
  const routes = await prisma.route.findMany()

  const updatePromises = routes.map(route => {
    const basePrice = Math.ceil(route.priceInCents / (1 + oldPercent / 100))

    return prisma.route.update({
      where: { id: route.id },
      data: { priceInCents: basePrice + basePrice / 100 * percent }
    })
  })

  await Promise.all([
    await prisma.setting.update({
      where: { id },
      data: { percent }
    }),
    ...updatePromises
  ])

  revalidatePath('/admin/routes')
}
