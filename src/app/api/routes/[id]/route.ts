import prisma from '@/prisma/client'
import { insertRouteSchema } from '@/schemas/routes'
import { Route } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  const body: RequestBody = await request.json()
  const validation = insertRouteSchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(
      validation.error.format(),
      { status: 400 }
    )

  if (!await prisma.route.findUnique({
    where: { id }
  }))
    return NextResponse.json(
      null,
      { status: 404 }
    )

  await prisma.route.update({
    where: { id },
    data: validation.data
  })

  await prisma.routeLocation.deleteMany({
    where: { routeId: id }
  })

  await prisma.routeLocation.createMany({
    data: body.locationsIds.map((location, index) => ({
      locationId: location,
      routeId: id,
      position: index + 1
    }))
  })

  revalidatePath(`/admin/routes/${id}`, 'page')
  revalidatePath("/admin/routes")

  return NextResponse.json(null)
}

export async function DELETE(request: NextRequest, { params: { id } }: Props) {
  if (!await prisma.route.findUnique({
    where: { id }
  }))
  return NextResponse.json(
    null,
    { status: 404 }
  )

  await prisma.route.delete({
    where: { id }
  })

  revalidatePath(`/admin/routes/${id}`, 'page')
  revalidatePath('/admin/routes')

  return NextResponse.json(null)
}

type Props = {
  params: {
    id: string
  }
}

type RequestBody = Route & {
  locationsIds: string[]
}
