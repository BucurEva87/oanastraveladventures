import prisma from "@/prisma/client"
import { LocationWithCity } from "@/types"
import { notFound } from "next/navigation"
import EditLocationPageForm from "./Form"

const EditLocationPage = async ({ params: { id } }: Props) => {
  const location = (await prisma.location.findUnique({
    where: { id },
    include: {
      city: {
        select: {
          name: true,
          sector: true,
          country: true,
          countryFlag: true,
        },
      },
    },
  })) as LocationWithCity

  if (!location || !location.city) return notFound()

  return <EditLocationPageForm location={location} />
}

type Props = {
  params: {
    id: string
  }
}

export default EditLocationPage
