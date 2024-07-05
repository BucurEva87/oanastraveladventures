import PageTitle from "@/components/PageTitle"
import prisma from "@/prisma/client"
import Link from "next/link"
import NewRoutePageForm from "./Form"
import { Location as SchemaLocation } from "@prisma/client"

export const dynamic = "force-dynamic"

const NewRoutePage = async () => {
  const locations: Location[] = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
    },
  })

  if (!locations.length)
    return (
      <>
        <PageTitle title="No locations were found" />

        <div className="text-center">
          <p>There is no trace of any location in your database.</p>

          <Link href="/admin/locations/new">Perhaps add one?</Link>
        </div>
      </>
    )

  return <NewRoutePageForm locations={locations} />
}

export type Location = Pick<
  SchemaLocation,
  "id" | "name" | "latitude" | "longitude"
>

export default NewRoutePage
