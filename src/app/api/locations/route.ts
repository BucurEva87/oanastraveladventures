import prisma from "@/prisma/client"
import { createLocationSchema } from "@/schemas/locations"
import { Location } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body: Omit<Location, 'id'> = await request.json()
  const validation = createLocationSchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(
      validation.error.format(),
      { status: 400 }
    )

  console.log(validation.data)

  const newLocation = await prisma.location.create({
    data: validation.data
  })

  if (!newLocation)
    return NextResponse.json(null)

  revalidatePath("/admin/locations")

  return NextResponse.json(newLocation)
}
