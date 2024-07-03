import DataTable from "@/components/DataTable"
import PageTitle from "@/components/PageTitle"
import { columns } from "./columns"
import Link from "next/link"
import { City as SchemaCity } from "@prisma/client"
import prisma from "@/prisma/client"
import { SystemNotification } from "@/components/Notification"

const CitiesPage = async ({ searchParams }: Props) => {
  const cities: City[] = await prisma.city.findMany({
    select: {
      id: true,
      name: true,
      country: true,
      countryFlag: true,
      sector: true,
      sectorAuto: true,
    },
  })

  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <PageTitle title="Cities" />

        {cities.length ? (
          <DataTable
            columns={columns}
            data={cities}
          />
        ) : (
          <div className="text-center">
            <span>There are no cities</span>
          </div>
        )}

        <div className="text-center">
          <Link href="/admin/cities/new">
            {cities.length ? "Add another city" : "Perhaps add one?"}
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

export type City = Omit<
  SchemaCity,
  "countryCode" | "description" | "latitude" | "longitude"
>

export default CitiesPage
