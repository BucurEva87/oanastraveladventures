"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { City } from "./page"

export const columns: ColumnDef<City>[] = [
  {
    accessorKey: "name",
    header: "City",
    cell: ({ row }) => {
      return (
        <span>
          <Link href={`/admin/cities/${row.original.id}`}>
            {row.original.name}
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
        <span>{`${row.original.country} ${row.original.countryFlag}`}</span>
      )
    },
  },
  {
    accessorKey: "sector",
    header: "Sector",
    cell: ({ row }) => {
      return (
        <span>{`${row.original.sectorAuto} (${row.original.sectorAuto})`}</span>
      )
    },
  },
]
