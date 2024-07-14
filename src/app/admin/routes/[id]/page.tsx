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
      <h1 className="text-3xl font-bold mb-4 text-center">
        {route.name} ({route.available ? "Available" : "Unavailable"})
      </h1>
      {route.locations.map((item, index) => {
        return (
          <InformationRow
            key={item.location.id}
            label={!!index ? `Stop ${index}` : "Start"}
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

      <InformationRow
        label="Length"
        information={`${manageDistance(route.length, settings.metric)} ${
          settings.metric
        }`}
        style="inline-block"
      />

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
