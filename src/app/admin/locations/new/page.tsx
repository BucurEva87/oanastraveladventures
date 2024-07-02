import PageTitle from "@/components/PageTitle"
import prisma from "@/prisma/client"
import { City } from "@prisma/client"
import Link from "next/link"
import NewLocationPageForm from "./Form"

const NewLocationPage = async () => {
  const cities: City[] = await prisma.city.findMany()

  if (!cities.length)
    return (
      <>
        <PageTitle title="No cities were found" />

        <p>There is no trace of any city in your database.</p>

        <Link href="/admin/cities/new">Perhaps add one?</Link>
      </>
    )

  return (
    <NewLocationPageForm
      cities={cities.map((city) => ({
        id: city.id,
        name: city.name,
        sector: city.sector,
        sectorAuto: city.sectorAuto,
        country: city.country,
        countryCode: city.countryCode,
        countryFlag: city.countryFlag,
      }))}
    />
  )
}

export default NewLocationPage
