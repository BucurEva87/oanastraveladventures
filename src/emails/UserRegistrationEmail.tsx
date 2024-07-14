import {
  Head,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components"
import TemplateBody from "./components/TemplateBody"
import { tailwindConfig } from "./tailwindConfig"

export default function UserRegistrationEmail({
  name,
  verificationLink,
}: UserRegistrationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Oana&apos;s Travel Adventures!</Preview>
      <Tailwind config={tailwindConfig}>
        <TemplateBody title="Welcome to Oana's Travel Adventures! 👋">
          <Text className="text-lg text-deep-red mb-2">Hi, {name},</Text>
          <Text className="text-lg text-deep-red mb-2">
            Thank you for registering with us. We are excited to have you on
            board!
          </Text>
          <Text className="text-lg text-deep-red mb-2">
            Please click the link below to verify your email address:
          </Text>
          <Link
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/verification/${verificationLink}`}
            className="text-lg font-bold text-sky-blue mb-2"
          >
            Verify Email
          </Link>
        </TemplateBody>
      </Tailwind>
    </Html>
  )
}

type UserRegistrationEmailProps = {
  name: string
  verificationLink: string
}

UserRegistrationEmail.PreviewProps = {
  name: "Bucur Eva-Lavinia",
  verificationLink: crypto.randomUUID(),
} satisfies UserRegistrationEmailProps
