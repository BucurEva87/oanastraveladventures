import DataTable from "@/components/DataTable"
import { SystemNotification } from "@/components/Notification"
import PageTitle from "@/components/PageTitle"
import prisma from "@/prisma/client"
import Link from "next/link"
import { columns } from "./columns"
import { City, Location } from "@prisma/client"

const LocationsPage = async ({ searchParams }: Props) => {
  const locations = await prisma.location
    .findMany({
      select: {
        id: true,
        name: true,
        type: true,
        city: {
          select: {
            id: true,
            name: true,
            sector: true,
            country: true,
            countryFlag: true,
          },
        },
      },
    })
    .then((locations) => {
      return locations.filter(
        (location) => location.city != null
      ) as LocationWithCity[]
    })

  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <PageTitle title="Locations" />

        {locations.length ? (
          <DataTable
            columns={columns}
            data={locations}
          />
        ) : (
          <div className="text-center">
            <span>There are no locations</span>
          </div>
        )}

        <div className="text-center">
          <Link href="/admin/locations/new">
            {locations.length ? "Add another location" : "Perhaps add one?"}
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

export type LocationWithCity = Pick<Location, "id" | "name" | "type"> & {
  city: Pick<City, "id" | "name" | "sector" | "country" | "countryFlag">
}

export default LocationsPage
