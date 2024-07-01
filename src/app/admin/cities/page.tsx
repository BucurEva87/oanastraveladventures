import DataTable from "@/components/DataTable"
import PageTitle from "@/components/PageTitle"
import { columns as citiesColumns } from "./citiesColumns"
import Link from "next/link"
import { City } from "@prisma/client"
import prisma from "@/prisma/client"
import { SystemNotification } from "@/components/Notification"

const CitiesPage = async ({ searchParams }: Props) => {
  const cities: City[] = await prisma.city.findMany()

  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <PageTitle title="Cities" />

        {cities.length ? (
          <DataTable
            columns={citiesColumns}
            data={cities}
          />
        ) : (
          <span>There are no cities</span>
        )}

        <Link href="/admin/cities/new">
          {cities.length ? "Add another city" : "Perhaps add one?"}
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

export default CitiesPage
