// import { data as dataUsers } from "../../../../data/users"
import PageTitle from "../_components/PageTitle"
import DataTable from "@/components/DataTable"
import { columns as usersColumns } from "./usersColumns"
import prisma from "../../../../prisma/client"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      image: true,
    },
  })

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Users" />
      <DataTable
        columns={usersColumns}
        data={users}
      />
    </div>
  )
}
