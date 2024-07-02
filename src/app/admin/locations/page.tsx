import DataTable from "@/components/DataTable"
import { SystemNotification } from "@/components/Notification"
import PageTitle from "@/components/PageTitle"
import prisma from "@/prisma/client"
import { LocationWithCity } from "@/types"
import Link from "next/link"
import { columns } from "./columns"

const LocationsPage = async ({ searchParams }: Props) => {
  const locations: LocationWithCity[] = await prisma.location
    .findMany({
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
    })
    .then((locations) => {
      return locations.map((location) => {
        if (!location.city) {
          throw new Error(
            `Location with id ${location.id} has no associated city`
          )
        }

        return location as LocationWithCity
      })
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
          <span>There are no locations</span>
        )}

        <Link href="/admin/locations/new">
          {locations.length ? "Add another location" : "Perhaps add one?"}
        </Link>
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

export default LocationsPage
