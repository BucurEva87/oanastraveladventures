import prisma from "@/prisma/client"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params: { id } }: DeleteProps) {
  const city = await prisma.city.findUnique({
    where: { id }
  })

  if (!city)
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

type DeleteProps = {
  params: {
    id: string
  }
}
