import { NextResponse } from "next/server"
import prisma from "../../prisma/client"

export async function findUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id }
  })

  if (!user) return false

  return user
}

export function Error({ error, status, type }: ErrorProps) {
  return NextResponse.json(
    { error, type },
    { status }
  )
}

type ErrorProps = {
  error: string,
  status: number,
  type: string
}
