import { formatDate } from "@/lib/formatters"
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Tailwind,
  Link,
} from "@react-email/components"
import { tailwindConfig } from "./tailwindConfig"
import TemplateBody from "./components/TemplateBody"

const PurchaseConfirmationEmail = ({
  customerName,
  productName,
  purchaseDate,
  orderId,
  productId,
}: PurchaseConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your purchase confirmation</Preview>
    <Tailwind config={tailwindConfig}>
      <TemplateBody title="Thank you for your purchase! 🥳">
        <Text className="text-2xl font-bold text-deep-red mb-4">
          Purchase Confirmation
        </Text>
        <Text className="text-lg text-deep-red mb-2">Hi {customerName},</Text>
        <Text className="text-lg text-deep-red mb-2">
          Thank you for purchasing{" "}
          <Link
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/routes/${productId}`}
            target="_blank"
          >
            <span className="font-bold">{productName}</span>
          </Link>{" "}
          !
        </Text>
        <Text className="text-lg text-deep-red mb-2">
          Your order was placed on{" "}
          <span className="font-bold">{formatDate(purchaseDate)}</span>.
        </Text>
        <Text className="text-lg text-deep-red mb-2">
          Order ID: <span className="font-bold">{orderId}</span>
        </Text>
      </TemplateBody>
    </Tailwind>
  </Html>
)

type PurchaseConfirmationEmailProps = {
  customerName: string
  productName: string
  purchaseDate: string
  orderId: string
  productId: string
}

PurchaseConfirmationEmail.PreviewProps = {
  customerName: "Eva-Lavinia Bucur",
  productName: "Din Bucuresti in Sighisoara",
  purchaseDate: new Date().toString(),
  orderId: "cjx_204618273h98dh7192t9ghd",
  productId: "cjh_27t7g87gd268f28f6f6d822",
} satisfies PurchaseConfirmationEmailProps

export default PurchaseConfirmationEmail
