"use client"

import DataTable from "@/components/DataTable"
import { columns } from "./columns"
import useMediaQuery from "@/hooks/useMediaQuery"
import { ColumnDef, Row } from "@tanstack/react-table"
import { RouteWithLocations } from "./page"

const RoutesPageTable = ({ routes }: Props) => {
  const isMdUp = useMediaQuery("(min-width: 768px)")

  const finalColumns: ColumnDef<RouteWithLocations>[] = [
    ...columns,
    ...(isMdUp
      ? [
          {
            accessorKey: "available",
            header: "Available",
            cell: ({ row }: { row: Row<RouteWithLocations> }) => {
              return (
                <span className="md:block hidden">
                  {row.original.available ? "Available" : "Not available"}
                </span>
              )
            },
          },
        ]
      : []),
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
