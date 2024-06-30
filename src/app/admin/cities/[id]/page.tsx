import Map from "@/components/Map"
import PageTitle from "@/components/PageTitle"
import prisma from "@/prisma/client"
import { notFound } from "next/navigation"

const CityPage = async ({ params: { id } }: Props) => {
  const city = await prisma.city.findUnique({
    where: { id },
  })

  if (!city) notFound()

  return (
    <>
      <PageTitle title={city.name} />
      <div className="mt-10">
        <p>
          Country: {city.country} ({city.countryCode}) {city.countryFlag}
        </p>
        <p>
          Sector: {city.sector} ({city.sectorAuto})
        </p>
        <p>Description: {city.description}</p>
      </div>
      {!!city.latitude && !!city.longitude && (
        <div className="flex justify-center mt-2">
          <Map
            center={[city.latitude, city.longitude]}
            markers={[
              {
                popup: { text: `City ${city.name}` },
                position: [city.latitude, city.longitude],
              },
            ]}
          />
        </div>
      )}
    </>
  )
}

type Props = {
  params: {
    id: string
  }
}

export default CityPage
