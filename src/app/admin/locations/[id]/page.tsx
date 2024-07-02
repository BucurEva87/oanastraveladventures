import DeleteResourceButton from "@/components/buttons/DeleteResourceButton"
import EditResourceButton from "@/components/buttons/EditResourceButton"
import ExternalLink from "@/components/ExternalLink"
import prisma from "@/prisma/client"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
})

const LocationPage = async ({ params: { id } }: Props) => {
  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      city: {
        select: {
          name: true,
          sector: true,
          country: true,
          countryFlag: true,
        },
      },
    },
  })

  if (!location || !location.city) notFound()

  const {
    name,
    type,
    description,
    website,
    entryFee,
    latitude,
    longitude,
    city: { name: cityName, sector, country, countryFlag },
  } = location

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-slate-900 shadow-lg rounded-lg p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-center">{name}</h1>
        <div className="flex items-center mb-4">
          <span className="text-xl font-semibold">{country}</span>
          <span className="ml-2">{countryFlag}</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-700">City: </span>
          <span>{cityName}</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-700">Sector: </span>
          <span>{sector}</span>
        </div>
        {!!type && (
          <div className="mb-4">
            <span className="text-gray-700">Type: </span>
            <p className="inline-block">{type}</p>
          </div>
        )}
        {!!description && (
          <div className="mb-4">
            <span className="text-gray-700">Description: </span>
            <p className="inline-block">{description}</p>
          </div>
        )}
        {!!website && (
          <div className="mb-4">
            <span className="text-gray-700">Website: </span>
            <p className="inline-block">
              <ExternalLink href={website}>{website}</ExternalLink>
            </p>
          </div>
        )}
        {!!entryFee && (
          <div className="mb-4">
            <span className="text-gray-700">Entry fee: </span>
            <p className="inline-block">{entryFee}</p>
          </div>
        )}
        {!!latitude && !!longitude && (
          <div className="mb-4">
            <Map
              center={[latitude, longitude]}
              markers={[
                {
                  popup: { text: name },
                  position: [latitude, longitude],
                },
              ]}
            />
          </div>
        )}
        <div className="flex space-x-4">
          <EditResourceButton
            resource="location"
            url={`/admin/locations/${id}/edit`}
          />
          <DeleteResourceButton
            resource="location"
            url={`/locations/${id}`}
            backref="/admin/locations"
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

export default LocationPage
