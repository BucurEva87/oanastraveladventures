"use client"

import DataTable from "@/components/DataTable"
import useMediaQuery from "@/hooks/useMediaQuery"
import { ColumnDef, Row } from "@tanstack/react-table"
import Link from "next/link"
import { columns } from "./columns"
import { RouteWithLocations } from "./page"
import { useSettings } from "@/app/contexts/SettingsContext"
import { manageDistance } from "@/lib/utils"

const RoutesPageTable = ({ routes }: Props) => {
  const isMdUp = useMediaQuery("(min-width: 768px)")
  const { settings } = useSettings()

  const finalColumns: ColumnDef<RouteWithLocations>[] = [
    ...columns.slice(0, 2),
    ...(isMdUp
      ? [
          {
            accessorKey: "locations",
            header: "Locations",
            cell: ({ row }: { row: Row<RouteWithLocations> }) => {
              return (
                <span className="gap-3 md:flex md:flex-col xl:flex-row hidden">
                  {row.original.locations.map((item) => {
                    const { id, name } = item.location

                    return (
                      <Link
                        key={id}
                        href={`/admin/locations/${id}`}
                      >
                        {name}
                      </Link>
                    )
                  })}
                </span>
              )
            },
          },
        ]
      : []),
    ...columns.slice(2, 3),
    {
      accessorKey: "length",
      header: "Length",
      cell: ({ row }) => {
        return (
          <span>{`${manageDistance(row.original.length, settings.metric)} ${
            settings.metric
          }`}</span>
        )
      },
    },
    ...columns.slice(3),
  ]

  return (
    <DataTable
      columns={finalColumns}
      data={routes}
    />
  )
}

type Props = {
  routes: RouteWithLocations[]
}

export default RoutesPageTable
