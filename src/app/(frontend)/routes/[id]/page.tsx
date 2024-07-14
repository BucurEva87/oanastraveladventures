import prisma from "@/prisma/client"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import CheckoutForm from "./_components/CheckoutForm"

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY as string)

const RoutePage = async ({ params: { id } }: Props) => {
  const route = await prisma.route.findUnique({
    where: { id },
  })

  if (!route) return notFound()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: JSON.parse(route.prices)[0].price * 100,
    currency: "USD",
    metadata: { productId: route.id },
  })

  if (!paymentIntent.client_secret)
    throw Error("Stripe failed to create payment intent")

  return (
    <CheckoutForm
      route={route}
      clientSecret={paymentIntent.client_secret}
    />
  )
}

type Props = {
  params: {
    id: string
  }
}

export default RoutePage
