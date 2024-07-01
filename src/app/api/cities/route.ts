import prisma from "@/prisma/client"
import { createCitySchema } from "@/schemas/cities"
import { City } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body: Omit<City, 'id'> = await request.json()
  const validation = createCitySchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(
      validation.error.format(),
      { status: 400 }
    )

  const newCity = await prisma.city.create({
    data: validation.data
  })

  if (!newCity)
      return NextResponse.json(null)

  revalidatePath("/admin/cities")

  return NextResponse.json(newCity)
}
