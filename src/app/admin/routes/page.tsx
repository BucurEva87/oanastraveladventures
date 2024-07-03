import DataTable from "@/components/DataTable"
import { SystemNotification } from "@/components/Notification"
import PageTitle from "@/components/PageTitle"
import prisma from "@/prisma/client"
import Link from "next/link"
import { columns } from "./columns"
import { Location, Route, RouteLocation } from "@prisma/client"

const RoutesPage = async ({ searchParams }: Props) => {
  const routes: RouteWithLocations[] = await prisma.route.findMany({
    select: {
      id: true,
      name: true,
      available: true,
      length: true,
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
          <DataTable
            columns={columns}
            data={routes}
          />
        ) : (
          <div className="text-center">
            <span>There are no routes</span>
          </div>
        )}

        <div className="text-center">
          <Link href="/admin/routes/new">
            {routes.length ? "Add another location" : "Perhaps add one?"}
          </Link>
        </div>
      </div>
      <SystemNotification searchParams={searchParams} />
    </>
  )
}

type Props = {
  searchParams?: {
    [key: string]: string | undefined
  }
}

export type RouteWithLocations = Pick<
  Route,
  "id" | "name" | "available" | "length"
> & {
  locations: (Pick<RouteLocation, "id"> & {
    location: Pick<Location, "id" | "name">
  })[]
}

export default RoutesPage
