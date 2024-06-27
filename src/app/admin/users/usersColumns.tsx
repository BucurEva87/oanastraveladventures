"use client"

import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import SelectRole from "./_components/SelectRole"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import styles from "@/styles/avatar.module.css"

export const columns: ColumnDef<Omit<User, "password">>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <Avatar className={styles.avatar}>
            <AvatarImage
              src={row.original.image || undefined}
              alt={`${row.original.name}'s profile image`}
            />
            <AvatarFallback>
              {row.original.name
                ?.split(" ")
                .reduce((acc, val) => acc + val.substring(0, 1), "")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link href={`users/${row.original.id}`}>{row.getValue("name")}</Link>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <span
          className={
            row.original.emailVerified ? "text-green-500" : "text-red-500"
          }
        >
          {row.getValue("email")}
        </span>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return (
        <SelectRole
          currentRole={row.getValue("role")}
          id={row.original.id}
        />
      )
    },
  },
]
