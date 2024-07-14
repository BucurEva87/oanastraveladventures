"use client"

import { userOrderExists } from "@/app/actions/orders"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import { Route } from "@prisma/client"
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"
import { FormEvent, useState } from "react"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_TEST_KEY as string
)

const CheckoutForm = ({ route, clientSecret }: Props) => {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        {/* <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image src={route.imagePath} fill alt={route.name} />
        </div> */}
        <div>
          <div className="text-lg">{formatCurrency(route.priceInCents)}</div>
          <h1 className="text-2xl font-bold">{route.name}</h1>
          <div className="lime-clamp-3 text-muted-foreground">
            {route.description}
          </div>
        </div>
      </div>
      <Elements
        options={{ clientSecret }}
        stripe={stripePromise}
      >
        <Form
          price={route.priceInCents}
          productId={route.id}
        />
      </Elements>
    </div>
  )
}

function Form({ price, productId }: FormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [email, setEmail] = useState<string>()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !email) return

    setIsLoading(true)

    const orderExists = await userOrderExists(email, productId)

    if (orderExists) {
      setErrorMessage("You already purchased this product.")
      setIsLoading(false)
      return
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message as string)
        } else {
          setErrorMessage("An unknown error occurred")
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={!stripe || !elements || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(price)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

type Props = {
  route: Route
  clientSecret: string
}

type FormProps = {
  price: number
  productId: string
}

export default CheckoutForm
