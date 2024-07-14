import prisma from "@/prisma/client"
import { City, Location } from "@prisma/client"
import { notFound } from "next/navigation"
import EditLocationPageForm from "./Form"

const EditLocationPage = async ({ params: { id } }: EditLocationPageProps) => {
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

type EditLocationPageProps = {
  params: {
    id: string
  }
}

export type LocationWithCity = Location & {
  city: Pick<City, "name" | "sector" | "country" | "countryFlag">
}

export default EditLocationPage
