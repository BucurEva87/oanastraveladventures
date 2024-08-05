import PurchaseConfirmationEmail from "@/emails/PurchaseConfirmationEmail"
import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY as string)
const resend = new Resend(process.env.RESEND_KEY)

export async function POST(request: NextRequest) {
  try {
    const event = stripe.webhooks.constructEvent(
      await request.text(),
      request.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )

    if (event.type === "charge.succeeded") {
      const charge = event.data.object
      const routeId = charge.metadata.productId
      const email = charge.billing_details.email
      const pricePaidInCents = charge.amount

      if (!email) return NextResponse.json(null, { status: 404 })

      const [route, user] = await Promise.all([
        await prisma.route.findUnique({
          where: {
            id: routeId,
          },
        }),
        await prisma.user.findUnique({
          where: {
            email: email,
          },
        }),
      ])

      if (!route || !user) return NextResponse.json(null, { status: 404 })

      const userFields = {
        email,
        orders: {
          create: {
            routeId,
            pricePaidInCents,
          },
        },
      }

      const {
        orders: [order],
      } = await prisma.user.upsert({
        where: { email },
        create: userFields,
        update: userFields,
        select: {
          orders: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      })

      try {
        await resend.emails.send({
          from: "Spokeswoman <spokeswoman@oanastraveladventures.com>",
          // from: "onboarding@resend.dev",
          to: email,
          subject: "Purchase confirmation ${route.name}",
          react: (
            <PurchaseConfirmationEmail
              customerName={user.name as string}
              productName={route.name}
              purchaseDate={order.createdAt as unknown as string}
              orderId={order.id}
              productId={route.id}
            />
          ),
        })
      } catch (error: any) {
        console.log("Error:", JSON.stringify(error))
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json(`Webhook Error: ${error.message}`, { status: 400 })
  }
}
