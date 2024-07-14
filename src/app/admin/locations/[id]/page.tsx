import ExternalLink from "@/components/ExternalLink"
import InformationContainer from "@/components/information/InformationContainer"
import InformationRow from "@/components/information/InformationRow"
import prisma from "@/prisma/client"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
})

const LocationPage = async ({ params: { id } }: LocationPageProps) => {
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

  return (
    <InformationContainer>
      <h1 className="text-3xl font-bold mb-4 text-center">{location.name}</h1>
      <div className="flex items-center mb-4">
        <span className="text-xl font-semibold">{location.city.country}</span>
        <span className="ml-2">{location.city.countryFlag}</span>
      </div>
      <InformationRow
        label="City"
        information={location.city.name}
      />
      <InformationRow
        label="Sector"
        information={location.city.sector}
      />
      {!!location.type && (
        <InformationRow
          label="Type"
          information={location.type}
          style="inline-block"
        />
      )}
      {!!location.description && (
        <InformationRow
          label="Description"
          information={location.description}
          style="inline-block"
        />
      )}
      {!!location.website && (
        <InformationRow
          label="Website"
          information={
            <ExternalLink href={location.website}>
              {location.website}
            </ExternalLink>
          }
          style="inline-block"
        />
      )}
      {!!location.entryFee && (
        <InformationRow
          label="Entry Fee"
          information={location.entryFee}
          style="inline-block"
        />
      )}
      {!!location.latitude && !!location.longitude && (
        <div className="mb-4">
          <Map
            center={[location.latitude, location.longitude]}
            markers={[
              {
                popup: { text: location.name },
                position: [location.latitude, location.longitude],
              },
            ]}
          />
        </div>
      )}
    </InformationContainer>
  )
}

type LocationPageProps = {
  params: {
    id: string
  }
}

export default LocationPage
