import Info from "@/components/Info"
import InformationContainer from "@/components/information/InformationContainer"
import InformationRow from "@/components/information/InformationRow"
import { formatCurrency } from "@/lib/formatters"
import { manageDistance } from "@/lib/utils"
import prisma from "@/prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"

const RoutePage = async ({ params: { id } }: RoutePageProps) => {
  const [route, settings] = await Promise.all([
    await prisma.route.findUnique({
      where: { id },
      include: {
        locations: {
          include: {
            location: {
              select: {
                id: true,
                name: true,
                city: {
                  select: {
                    id: true,
                    name: true,
                    country: true,
                    countryFlag: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    (await prisma.setting.findFirst({ select: { metric: true } })) as {
      metric: string
    },
  ])

  if (!route) notFound()

  return (
    <InformationContainer>
      <h1 className="text-3xl font-bold mb-4 text-center">{route.name}</h1>
      {(!route.circular
        ? route.locations
        : [...route.locations, route.locations[0]]
      ).map((item, index) => {
        return (
          <InformationRow
            key={item.location.id}
            label={
              index === 0
                ? "Start"
                : route.circular && index === route.locations.length
                ? "Returning to"
                : `Stop ${index}`
            }
            information={
              <span>
                <Link href={`/admin/locations/${item.location.id}`}>
                  {item.location.name}
                </Link>
                {", "}
                <Link href={`/admin/cities/${item.location.city!.id}`}>
                  {item.location.city!.name}
                </Link>
                {`, ${item.location.city!.country} ${
                  item.location.city!.countryFlag
                }`}
              </span>
            }
          />
        )
      })}

      <div className="flex">
        <InformationRow
          label="Estimated length"
          information={`${manageDistance(route.length, settings.metric)} ${
            settings.metric
          }`}
          style="inline-block"
        />
        <Info
          title="Take this with a grain of salt"
          body="Please note that the distances calculated using the Haversine formula are straight-line
                estimates between points. These estimates do not account for the actual travel path on the road, 
                which may result in the actual distance being longer. Therefore, the distances provided might sometimes 
                be underestimated."
        />
      </div>

      {!!route.description && (
        <InformationRow
          label="Description"
          information={route.description}
          style="inline-block"
        />
      )}

      <InformationRow
        label="Price"
        information={formatCurrency(route.priceInCents / 100)}
        style="inline-block"
      />
    </InformationContainer>
  )
}

type RoutePageProps = {
  params: {
    id: string
  }
}

export default RoutePage
