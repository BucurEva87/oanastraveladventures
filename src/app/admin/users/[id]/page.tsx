import { notFound } from "next/navigation"
import PageTitle from "@/components/PageTitle"
import { findUser } from "@/lib/server"
import UserCard from "../_components/UserCard"

export default async function UserProfilePage({
  params: { id },
}: UserProfilePageProps) {
  const user = await findUser(id)

  if (!user) return notFound()

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title={`User ${user.name}: ${user.id}`} />
      <UserCard user={user} />
    </div>
  )
}

type UserProfilePageProps = {
  params: {
    id: string
  }
}
