"use client"

import { LocationWithCity } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

export const columns: ColumnDef<LocationWithCity>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span>
          <Link href={`/admin/locations/${row.original.id}`}>
            {row.getValue("name")}
          </Link>
        </span>
      )
    },
  },
  {
    accessorKey: "country",
    header: "Location",
    cell: ({ row }) => {
      const { name: city, sector, country, countryFlag } = row.original.city

      return <span>{`${city}, ${sector}, ${country} ${countryFlag}`}</span>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <span>{row.getValue("type")}</span>
    },
  },
]
