"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/formatters"
import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react"
import Link from "next/link"
import { DeleteDropdownItem } from "../_components/ResourcesActions"
import { deleteRoute } from "../actions/routes"
import { RouteWithLocations } from "./page"
import { ActiveToggleDropdownItem } from "./_components/RoutesActions"

export const columns: ColumnDef<RouteWithLocations>[] = [
  {
    accessorKey: "available",
    header: "",
    cell: ({ row }) => {
      return row.original.available ? (
        <>
          <span className="sr-only">Available</span>
          <CheckCircle2 />
        </>
      ) : (
        <>
          <span className="sr-only">Unavailable</span>
          <XCircle className="stroke-destructive" />
        </>
      )
    },
  },
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
    accessorKey: "priceInCents",
    header: "Price",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.original.priceInCents / 100)}</span>
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
            <ActiveToggleDropdownItem
              id={row.original.id}
              available={row.original.available}
            />
            <DropdownMenuItem asChild>
              <Link href={`/admin/routes/${row.original.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteDropdownItem
              id={row.original.id}
              deleteFn={deleteRoute}
              type="route"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
