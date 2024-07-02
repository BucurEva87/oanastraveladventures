import prisma from "@/prisma/client"
import { updateCitySchema } from "@/schemas/cities"
import { City } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

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
