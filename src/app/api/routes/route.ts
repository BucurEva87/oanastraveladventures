import prisma from "@/prisma/client"
import { insertRouteSchema } from "@/schemas/routes"
import { Route } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json()

  if (!body.locationsIds.length)
    return NextResponse.json(
      null,
      { status: 400 }
    )

  const validation = insertRouteSchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(
      validation.error.format(),
      { status: 400 }
    )

  const newRoute = await prisma.route.create({
    data: validation.data
  })

  if (!newRoute)
    return NextResponse.json(null)

  await prisma.routeLocation.createMany({
    data: body.locationsIds.map((location, index) => ({
      locationId: location,
      routeId: newRoute.id,
      position: index + 1
    }))
  })

  return NextResponse.json(null)
}

type RequestBody = Omit<Route, 'id'> & { locationsIds: string[] }
