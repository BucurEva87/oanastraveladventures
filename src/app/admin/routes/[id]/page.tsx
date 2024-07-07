import DeleteResourceButton from "@/components/buttons/DeleteResourceButton"
import EditResourceButton from "@/components/buttons/EditResourceButton"
import InformationContainer from "@/components/information/InformationContainer"
import InformationRow from "@/components/information/InformationRow"
import prisma from "@/prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"

const RoutePage = async ({ params: { id } }: Props) => {
  const route = await prisma.route.findUnique({
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
  })

  if (!route) notFound()

  const { name, available, description, prices, circular, length, locations } =
    route

  return (
    <InformationContainer>
      <h1 className="text-3xl font-bold mb-4 text-center">
        {name} ({available ? "Available" : "Not available"})
      </h1>
      {locations.map((item, index) => {
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
      {!!description && (
        <InformationRow
          label="Description"
          information={description}
          style="inline-block"
        />
      )}

      <InformationRow
        label="Prices"
        information={
          <ul>
            {JSON.parse(prices).map(
              (item: { price: number; people: number }) => {
                return (
                  <li
                    key={item.people}
                  >{`$${item.price} (${item.people} people)`}</li>
                )
              }
            )}
          </ul>
        }
        style="inline-block"
      />

      <div className="flex space-x-4">
        <EditResourceButton
          resource="route"
          url={`/admin/routes/${id}/edit`}
        />
        <DeleteResourceButton
          resource="route"
          url={`/routes/${id}`}
          backref="/admin/routes"
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

export default RoutePage
