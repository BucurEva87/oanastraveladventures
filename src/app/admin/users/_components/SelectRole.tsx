"use client"

import { notify } from "@/components/Notification"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Role } from "@prisma/client"

const roles = ["ADMIN", "MODERATOR", "USER"]

export default function SelectRole({ currentRole, id }: SelectRoleProps) {
  const handleClick = async (role: Role) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })

      if (!response.ok)
        throw new Error(
          `The request could not be completed as it was most probably forged`
        )

      notify({
        type: "success",
        title: "Yahoo! You did it!",
        description: "Role was successfully updated",
      })
    } catch (error) {
      notify({
        type: "error",
        title: "Oups! There was an error",
        description: error as string,
      })
    }
  }

  return (
    <Select
      defaultValue={currentRole}
      onValueChange={(value) => handleClick(value as Role)}
    >
      <SelectTrigger className="max-w-min">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem
            key={role}
            value={role}
          >
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

type SelectRoleProps = {
  currentRole: string
  id: string
}
