import prisma from "@/prisma/client"
import EditCityPageForm from "./Form"
import { notFound } from "next/navigation"

const EditCityPage = async ({ params: { id } }: Props) => {
  const city = await prisma.city.findUnique({
    where: { id },
  })

  if (!city) return notFound()

  return <EditCityPageForm city={city} />
}

type Props = {
  params: {
    id: string
  }
}

export default EditCityPage
