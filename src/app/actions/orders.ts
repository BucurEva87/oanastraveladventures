"use server"

import prisma from "@/prisma/client"

export async function userOrderExists(email: string, routeId: string) {
  return (await prisma.order.findFirst({
    where: {
      user: {
        email
      },
      routeId
    },
    select: {
      id: true
    }
  })) !== null
}
