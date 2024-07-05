"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { RouteWithLocations } from "./page"

export const columns: ColumnDef<RouteWithLocations>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span>
          <Link href={`/admin/routes/${row.original.id}`}>
            {row.getValue("name")}
          </Link>
        </span>
      )
    },
  },
  {
    accessorKey: "locations",
    header: "Locations",
    cell: ({ row }) => {
      return (
        <span className="flex gap-3 flex-col md:flex-row">
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
  {
    accessorKey: "length",
    header: "Length",
    cell: ({ row }) => {
      return <span>{row.getValue("length")}</span>
    },
  },
]
