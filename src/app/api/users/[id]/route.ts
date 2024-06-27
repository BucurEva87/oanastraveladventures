import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../../prisma/client"
import { updateUserSchema } from "@/schemas/users"
import { Error, findUser } from "@/lib/server"

export async function GET(request: NextRequest, { params: { id }}: Props) {
  const user = await findUser(id)

  return user
    ? NextResponse.json(user)
    : Error({
      error: `An user with the id ${id} was not found`,
      status: 404,
      type: 'NO_USER'
    })
}

export async function PUT(request: NextRequest, { params: { id }}: Props) {
  const body = await request.json()
  const user = await findUser(id)

  if (!user)
    return Error({
      error: `An user with the id ${id} was not found`,
      status: 404,
      type: 'NO_USER_ERROR'
    })

  const validation = updateUserSchema.safeParse(body)

  if (!validation.success)
    return Error({
      error: 'Zod encountered some validation schema errors with your request. Please do not try to forge the request',
      status: 400,
      type: 'ZOD_ISSUE_ERROR'
    })

  const updateData = validation.data
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData
  })

  return NextResponse.json(updatedUser)
}

type Props = {
  params: {
    id: string
  }
}
