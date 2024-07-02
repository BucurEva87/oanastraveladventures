import DeleteResourceButton from "@/components/buttons/DeleteResourceButton"
import EditResourceButton from "@/components/buttons/EditResourceButton"
import ExternalLink from "@/components/ExternalLink"
import InformationContainer from "@/components/information/InformationContainer"
import InformationRow from "@/components/information/InformationRow"
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
    <InformationContainer>
      <h1 className="text-3xl font-bold mb-4 text-center">{name}</h1>
      <div className="flex items-center mb-4">
        <span className="text-xl font-semibold">{country}</span>
        <span className="ml-2">{countryFlag}</span>
      </div>
      <InformationRow
        label="City"
        information={cityName}
      />
      <InformationRow
        label="Sector"
        information={sector}
      />
      {!!type && (
        <InformationRow
          label="Type"
          information={type}
          style="inline-block"
        />
      )}
      {!!description && (
        <InformationRow
          label="Description"
          information={description}
          style="inline-block"
        />
      )}
      {!!website && (
        <InformationRow
          label="Website"
          information={<ExternalLink href={website}>{website}</ExternalLink>}
          style="inline-block"
        />
      )}
      {!!entryFee && (
        <InformationRow
          label="Entry Fee"
          information={entryFee}
          style="inline-block"
        />
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
    </InformationContainer>
  )
}

type Props = {
  params: {
    id: string
  }
}

export default LocationPage
