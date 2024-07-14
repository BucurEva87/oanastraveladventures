import PageTitle from "@/app/admin/_components/PageTitle"
import DataTable from "@/components/DataTable"
import { SystemNotification } from "@/components/Notification"
import prisma from "@/prisma/client"
import { City as SchemaCity } from "@prisma/client"
import Link from "next/link"
import { columns } from "./columns"

const CitiesPage = async ({ searchParams }: CityPageProps) => {
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

type CityPageProps = {
  searchParams?: {
    [key: string]: string | undefined
  }
}

export type City = Omit<
  SchemaCity,
  "countryCode" | "description" | "latitude" | "longitude"
>

export default CitiesPage
