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
import { deleteLocation } from "../actions/locations"
import { LocationWithCity } from "./page"

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
      const { id, name: city, sector, country, countryFlag } = row.original.city

      return (
        <span>
          <Link href={`/admin/cities/${id}`}>{city}</Link>
          {`, ${sector}, ${country} ${countryFlag}`}
        </span>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <span>{row.getValue("type")}</span>
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
              <Link href={`/admin/locations/${row.original.id}/edit`}>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteDropdownItem
              id={row.original.id}
              deleteFn={deleteLocation}
              type="location"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
