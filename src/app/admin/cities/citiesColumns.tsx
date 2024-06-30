"use client"

import { City } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

export const columns: ColumnDef<City>[] = [
  {
    accessorKey: "name",
    header: "City",
    cell: ({ row }) => {
      return (
        <span>
          <Link href={`/admin/cities/${row.original.id}`}>
            {row.getValue("name")}
          </Link>
        </span>
      )
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => {
      return (
        <span>{`${row.getValue("country")} ${row.original.countryFlag}`}</span>
      )
    },
  },
  {
    accessorKey: "sector",
    header: "Sector",
    cell: ({ row }) => {
      return (
        <span>{`${row.getValue("sector")} (${row.original.sectorAuto})`}</span>
      )
    },
  },
]
