import prisma from "@/prisma/client"
import { Location, Route, RouteLocation } from "@prisma/client"
import { notFound } from "next/navigation"
import EditRoutePageForm from "./Form"

const EditRoutePage = async ({ params: { id } }: Props) => {
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

type Props = {
  params: {
    id: string
  }
}

export type RouteWithLocations = Route & {
  locations: (RouteLocation & {
    location: Pick<Location, "id" | "name" | "latitude" | "longitude">
  })[]
}

export default EditRoutePage
