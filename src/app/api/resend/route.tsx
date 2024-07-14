import { Resend } from "resend"
import { getServerSession } from "next-auth"
import prisma from "@/prisma/client"
import { NextResponse } from "next/server"
import UserRegistrationEmail from "@/emails/UserRegistrationEmail"

const resend = new Resend(process.env.RESEND_KEY)

export async function POST() {
  const session = await getServerSession()

  if (!session?.user) return NextResponse.json(null, { status: 400 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  })

  if (!user) return NextResponse.json(null, { status: 400 })

  try {
    const data = await resend.emails.send({
      // from: 'Hello <spokeswoman@oanastraveladventures.com>',
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Hello, world!",
      react: (
        <UserRegistrationEmail
          name={user.name as string}
          verificationLink={crypto.randomUUID()}
        />
      ),
    })
    console.log("Data:", data)
  } catch (error) {
    console.log("Error:", error)
  }

  return NextResponse.json(null)
}
