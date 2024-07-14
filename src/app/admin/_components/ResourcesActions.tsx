"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTransition } from "react"
import { notify } from "@/components/Notification"
import { capitalize } from "@/lib/utils"

export function DeleteDropdownItem({
  id,
  deleteFn,
  type,
}: DeleteDropdownItemProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const response = await deleteFn(id)

          if (!response) {
            notify({
              type: "error",
              title: "Oups! There was an error",
              description: `${capitalize(type)} could not be deleted`,
            })
            return
          }

          notify({
            type: "success",
            title: "Yahoo! You did it!",
            description: `${capitalize(type)} was deleted successfully`,
          })
        })
      }}
    >
      Delete
    </DropdownMenuItem>
  )
}

type DeleteDropdownItemProps = {
  id: string
  deleteFn: (id: string) => Promise<boolean>
  type: string
}
