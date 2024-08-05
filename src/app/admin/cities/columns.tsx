"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { MoreVertical } from "lucide-react"
import Link from "next/link"
import { DeleteDropdownItem } from "../_components/ResourcesActions"
import { deleteCity } from "../actions/cities"
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
        <span>
          {`${row.original.sector}`}
          <span className="sm:inline hidden">{` (${row.original.sectorAuto})`}</span>
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={`/admin/cities/${row.original.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/cities/${row.original.id}/images`}>
                Manage images
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteDropdownItem
              id={row.original.id}
              deleteFn={deleteCity}
              type="city"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
