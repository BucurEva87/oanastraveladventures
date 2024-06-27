"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Role } from "@prisma/client"
import { toast } from "sonner"

const roles = ["ADMIN", "MODERATOR", "USER"]

export default function SelectRole({ currentRole, id }: SelectRoleProps) {
  const handleClick = async (role: Role) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      console.log("A request should have been made by now")

      if (!response.ok)
        throw new Error(
          `The request could not be completed as it was most probably forged`
        )

      toast.message("Role was successfully updated")
    } catch (error) {
      toast.error(error as String)
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
