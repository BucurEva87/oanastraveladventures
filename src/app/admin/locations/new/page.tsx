import PageTitle from "@/app/admin/_components/PageTitle"
import prisma from "@/prisma/client"
import Link from "next/link"
import NewLocationPageForm from "./Form"

const NewLocationPage = async () => {
  const cities = await prisma.city.findMany({
    select: {
      id: true,
      name: true,
      country: true,
      countryCode: true,
      countryFlag: true,
      sector: true,
      sectorAuto: true,
    },
  })

  if (!cities.length)
    return (
      <>
        <PageTitle title="No cities were found" />

        <div className="text-center">
          <p>There is no trace of any city in your database.</p>

          <Link href="/admin/cities/new">Perhaps add one?</Link>
        </div>
      </>
    )

  return <NewLocationPageForm cities={cities} />
}

export default NewLocationPage
