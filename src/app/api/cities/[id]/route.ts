import prisma from "@/prisma/client"
import { updateCitySchema } from "@/schemas/cities"
import { City } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  const body: RequestBody = await request.json()
  const validation = updateCitySchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(
      validation.error.format(),
      { status: 400 }
    )

  if (!await prisma.city.findUnique({
    where: { id }
  }))
    return NextResponse.json(
      null,
      { status: 404 }
    )

  await prisma.city.update({
    where: { id },
    data: validation.data
  })

  revalidatePath(`/admin/cities/${id}`, 'page')

  return NextResponse.json(null)
}

export async function DELETE(request: NextRequest, { params: { id } }: Props) {
  if (!await prisma.city.findUnique({
    where: { id }
  }))
  return NextResponse.json(
    null,
    { status: 404 }
  )

  await prisma.city.delete({
    where: { id }
  })

  revalidatePath(`/admin/cities/${id}`, 'page')
  revalidatePath('/admin/cities')

  return NextResponse.json(null)
}

type Props = {
  params: {
    id: string
  }
}

type RequestBody = Pick<
  City,
  'id' | 'latitude' | 'longitude' | 'description'
>
