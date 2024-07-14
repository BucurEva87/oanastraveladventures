import prisma from "@/prisma/client"
import Link from "next/link"

export default async function Home() {
  const routes = await prisma.route.findMany()

  return (
    <div>
      <h1>Welcome to Oana&apos;s!</h1>
      {routes.map((route) => (
        <Link
          key={route.id}
          href={`/routes/${route.id}`}
        >
          {route.name}
        </Link>
      ))}
    </div>
  )
}
