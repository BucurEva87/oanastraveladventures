import prisma from "@/prisma/client"
import { notFound } from "next/navigation"
import EditRoutePageForm from "./Form"

const EditRoutePage = async ({ params: { id } }: EditRoutePageProps) => {
  const route = await prisma.route.findUnique({
    where: { id },
    include: {
      locations: {
        include: {
          location: {
            select: {
              id: true,
              name: true,
              latitude: true,
              longitude: true,
            },
          },
        },
      },
    },
  })

  if (!route) return notFound()

  return <EditRoutePageForm route={route} />
}

type EditRoutePageProps = {
  params: {
    id: string
  }
}

export default EditRoutePage
