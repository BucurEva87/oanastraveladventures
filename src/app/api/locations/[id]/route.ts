import prisma from "@/prisma/client"
import { updateLocationschema } from "@/schemas/locations"
import { Location } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  const body: RequestBody = await request.json()
  const validation = updateLocationschema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(
      validation.error.format(),
      { status: 400 }
    )

  if (!await prisma.location.findUnique({
    where: { id }
  }))
    return NextResponse.json(
      null,
      { status: 404 }
    )

  await prisma.location.update({
    where: { id },
    data: validation.data
  })

  revalidatePath(`/admin/cities/${id}`, 'page')
  revalidatePath("/admin/locations")

  return NextResponse.json(null)
}

export async function DELETE(request: NextRequest, { params: { id } }: Props) {
  if (!await prisma.location.findUnique({
    where: { id }
  }))
  return NextResponse.json(
    null,
    { status: 404 }
  )

  await prisma.location.delete({
    where: { id }
  })

  revalidatePath(`/admin/locations/${id}`, 'page')
  revalidatePath('/admin/locations')

  return NextResponse.json(null)
}

type Props = {
  params: {
    id: string
  }
}

type RequestBody = Omit<Location, 'id' | 'name' | 'cityId'>
