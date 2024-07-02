import DeleteResourceButton from "@/components/buttons/DeleteResourceButton"
import EditResourceButton from "@/components/buttons/EditResourceButton"
import InformationContainer from "@/components/information/InformationContainer"
import InformationRow from "@/components/information/InformationRow"
import prisma from "@/prisma/client"
import dynamic from "next/dynamic"
import Link from "next/link"
import { notFound } from "next/navigation"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
})

const CityPage = async ({ params: { id } }: Props) => {
  const city = await prisma.city.findUnique({
    where: { id },
  })

  if (!city) notFound()

  const {
    name,
    country,
    countryFlag,
    countryCode,
    sector,
    sectorAuto,
    description,
    latitude,
    longitude,
  } = city

  return (
    <InformationContainer>
      <h1 className="text-3xl font-bold mb-4 text-center">{name}</h1>
      <div className="flex items-center mb-4">
        <span className="text-xl font-semibold">{country}</span>
        <span className="mx-2 text-gray-500">({countryCode})</span>
        <span className="ml-2">{countryFlag}</span>
      </div>
      <InformationRow
        label="Sector"
        information={sector}
      />
      <InformationRow
        label="Sector Auto"
        information={sectorAuto}
      />
      {!!description && (
        <InformationRow
          label="Description"
          information={description}
          style="inline-block"
        />
      )}
      {!!latitude && !!longitude && (
        <div className="mb-4">
          <Map
            center={[latitude, longitude]}
            markers={[
              {
                popup: { text: `City ${name}` },
                position: [latitude, longitude],
              },
            ]}
          />
        </div>
      )}
      <div className="flex space-x-4">
        <EditResourceButton
          resource="city"
          url={`/admin/cities/${id}/edit`}
        />
        <DeleteResourceButton
          resource="city"
          url={`/cities/${id}`}
          backref="/admin/cities"
        />
        <Link href={`/admin/cities/${id}/image`}>Test images</Link>
      </div>
    </InformationContainer>
  )
}

type Props = {
  params: {
    id: string
  }
}

export default CityPage
