import { NextResponse } from "next/server"
import prisma from "../../../../../prisma/client"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    const bcrypt = require('bcrypt')
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json(
      { success: 'Account created' },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
