import PageTitle from "@/app/admin/_components/PageTitle"
import { SystemNotification } from "@/components/Notification"
import prisma from "@/prisma/client"
import { Location, Route, RouteLocation } from "@prisma/client"
import Link from "next/link"
import RoutesPageTable from "./Table"

const RoutesPage = async ({ searchParams }: RoutesPageProps) => {
  const routes: RouteWithLocations[] = await prisma.route.findMany({
    select: {
      id: true,
      name: true,
      available: true,
      length: true,
      priceInCents: true,
      locations: {
        select: {
          id: true,
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })

  if (!routes.length)
    return (
      <>
        <div className="flex flex-col gap-5 w-full">
          <PageTitle title="Routes" />

          <div className="text-center">
            <Link href="/admin/routes/new">
              {routes.length ? "Add another location" : "Perhaps add one?"}
            </Link>
          </div>
        </div>
        <SystemNotification searchParams={searchParams} />
      </>
    )

  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <PageTitle title="Routes" />

        {routes.length ? (
          <RoutesPageTable routes={routes} />
        ) : (
          <div className="text-center">
            <span>There are no routes</span>
          </div>
        )}

        <div className="text-center">
          <Link href="/admin/routes/new">
            {routes.length ? "Add another route" : "Perhaps add one?"}
          </Link>
        </div>
      </div>
      <SystemNotification searchParams={searchParams} />
    </>
  )
}

type RoutesPageProps = {
  searchParams?: {
    [key: string]: string | undefined
  }
}

export type RouteWithLocations = Pick<
  Route,
  "id" | "name" | "available" | "length" | "priceInCents"
> & {
  locations: (Pick<RouteLocation, "id"> & {
    location: Pick<Location, "id" | "name">
  })[]
}

export default RoutesPage
