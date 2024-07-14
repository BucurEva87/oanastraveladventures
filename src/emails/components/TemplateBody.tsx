import { Body, Container, Section, Text } from "@react-email/components"
import { ReactNode } from "react"

export default function TemplateBody({ title, children }: TemplateBodyProps) {
  return (
    <Body className="bg-gray-100 font-sans">
      <Container
        className="bg-white rounded-lg mx-auto p-6"
        style={{ maxWidth: "600px" }}
      >
        <Section className="bg-sunset-orange p-4 rounded-t-lg">
          <Text className="text-2xl font-bold text-center text-sun-yellow">
            {title}
          </Text>
        </Section>
        <Section className="border border-solid border-gray-500 border-t-sunset-orange p-3">
          {children}
          <Text className="text-lg text-deep-red mt-4">
            Best regards,
            <br />
            Oana&apos;s Travel Adventures
          </Text>
        </Section>
      </Container>
    </Body>
  )
}

type TemplateBodyProps = {
  title: string
  children: ReactNode
}
