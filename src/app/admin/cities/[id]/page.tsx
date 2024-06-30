import DeleteResourceButton from "@/components/DeleteResourceButton"
import EditResourceButton from "@/components/EditResourceButton"
import Map from "@/components/Map"
import prisma from "@/prisma/client"
import { notFound } from "next/navigation"

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
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-slate-900 shadow-lg rounded-lg p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-center">{name}</h1>
        <div className="flex items-center mb-4">
          <span className="text-xl font-semibold">{country}</span>
          <span className="mx-2 text-gray-500">({countryCode})</span>
          <span className="ml-2">{countryFlag}</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-700">Sector: </span>
          <span>{sector}</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-700">Sector Auto: </span>
          <span>{sectorAuto}</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-700">Description: </span>
          <p className="inline-block">{description}</p>
        </div>
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
        </div>
      </div>
    </div>
  )
}

type Props = {
  params: {
    id: string
  }
}

export default CityPage
