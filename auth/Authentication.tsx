"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import styles from "@/styles/navbar.module.css"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { LogIn, UserPlus } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

const Authentication = () => {
  const { data: session } = useSession()

  console.log(session)

  return (
    <>
      {session ? (
        <Dropdown user={session.user} />
      ) : (
        <ul
          className={cn(
            "flex justify-center items-center outline-1 outline-slate-50",
            styles.accountArea
          )}
        >
          <li>
            <Link
              href="/register"
              title="Create a new account"
            >
              <UserPlus />
            </Link>
          </li>
          <li>
            <button
              type="button"
              title="Sign in with an existing account"
              onClick={() => signIn()}
              className={styles.signInButton}
            >
              <LogIn />
            </button>
          </li>
        </ul>
      )}
    </>
  )
}

const Dropdown = ({
  user,
}: {
  user?: {
    name?: string | null
    image?: string | null
    email?: string | null
  }
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className={styles.avatar}>
          <AvatarImage
            src={user?.image || undefined}
            alt={`${user?.name}'s profile image`}
          />
          <AvatarFallback className="text-black">
            {user?.name
              ?.split(" ")
              .reduce((acc, val) => acc + val.substring(0, 1), "")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={styles.dropdownmenuContent}>
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
        <DropdownMenuItem>
          <button
            type="button"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Authentication
