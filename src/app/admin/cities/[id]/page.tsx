import { notFound } from "next/navigation"
import prisma from "@/prisma/client"
import PageTitle from "@/components/PageTitle"
import Map from "@/components/Map"

const CityPage = async ({ params: { id } }: Props) => {
  const city = await prisma.city.findUnique({
    where: { id },
  })

  console.log(city)

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
            center={[parseFloat(city.latitude), parseFloat(city.longitude)]}
            markers={[
              {
                popup: { text: `City ${city.name}` },
                position: [
                  parseFloat(city.latitude),
                  parseFloat(city.longitude),
                ],
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
