"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import { toggleRouteAvailability } from "../../actions/routes"

export function ActiveToggleDropdownItem({
  id,
  available,
}: ActiveToggleDropdownItemProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleRouteAvailability(id, !available)
        })
      }}
    >
      {available ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  )
}

type ActiveToggleDropdownItemProps = {
  id: string
  available: boolean
}
