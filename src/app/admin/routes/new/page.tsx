import PageTitle from "@/components/PageTitle"
import prisma from "@/prisma/client"
import Link from "next/link"
import NewRoutePageForm from "./Form"

const NewRoutePage = async () => {
  const locations = await prisma.location.findMany({
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

export default NewRoutePage
