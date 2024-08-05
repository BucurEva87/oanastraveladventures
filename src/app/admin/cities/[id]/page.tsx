import SendEmailButton from "@/components/buttons/SendEmailButton"
import InformationContainer from "@/components/information/InformationContainer"
import InformationRow from "@/components/information/InformationRow"
import prisma from "@/prisma/client"
import dynamic from "next/dynamic"
import Link from "next/link"
import { notFound } from "next/navigation"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
})

const CityPage = async ({ params: { id } }: CityPageProps) => {
  const city = await prisma.city.findUnique({
    where: { id },
  })

  if (!city) notFound()

  return (
    <InformationContainer>
      <h1 className="text-3xl font-bold mb-4 text-center">{city.name}</h1>
      <div className="flex items-center mb-4">
        <span className="text-xl font-semibold">{city.country}</span>
        <span className="mx-2 text-gray-500">({city.countryCode})</span>
        <span className="ml-2">{city.countryFlag}</span>
      </div>
      <InformationRow
        label="Sector"
        information={city.sector}
      />
      <InformationRow
        label="Sector Auto"
        information={city.sectorAuto}
      />
      {!!city.description && (
        <InformationRow
          label="Description"
          information={city.description}
          style="inline-block"
        />
      )}
      {!!city.latitude && !!city.longitude && (
        <div className="mb-4">
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
    </InformationContainer>
  )
}

type CityPageProps = {
  params: {
    id: string
  }
}

export default CityPage
