import { User } from "@prisma/client"
import Image from "next/image"

const UserCard = ({ user }: UserCardProps) => {
  return (
    <>
      <Image
        width={150}
        height={150}
        src={user.image || "/public/defaultUser.png"}
        alt={`${user.name}'s profile image`}
      />
      <p>Email address: {user.email}</p>
      <p>
        Email confirmation status:{" "}
        {user.emailVerified ? "Confirmed" : "Not confirmed"}
      </p>
      <p>User role: {user.role}</p>
    </>
  )
}

type UserCardProps = {
  user: User
}

export default UserCard
