import { formatCurrency } from "@/lib/formatters"
import prisma from "@/prisma/client"
import { notFound } from "next/navigation"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY as string)

export default async function SuccessPage({
  searchParams: { payment_intent },
}: Props) {
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

  if (!paymentIntent.metadata.productId) return notFound()

  const route = await prisma.route.findUnique({
    where: {
      id: paymentIntent.metadata.productId,
    },
  })

  if (!route) return notFound()

  const isSuccess = paymentIntent.status === "succeeded"

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "Success!" : "Error!"}
      </h1>
      <div className="flex gap-4 items-center">
        {/* <div className="aspect-video flex-shrink-0 w-1/3 relative">
      <Image src={route.imagePath} fill alt={route.name} />
    </div> */}
        <div>
          <div className="text-lg">
            {formatCurrency(route.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{route.name}</h1>
          <div className="lime-clamp-3 text-muted-foreground">
            {route.description}
          </div>
        </div>
      </div>
    </div>
  )
}

type Props = {
  searchParams: {
    payment_intent: string
  }
}
