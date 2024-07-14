import PageTitle from "@/app/admin/_components/PageTitle"
import DataTable from "@/components/DataTable"
import prisma from "@/prisma/client"
import { columns } from "./usersColumns"

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
        columns={columns}
        data={users}
      />
    </div>
  )
}
