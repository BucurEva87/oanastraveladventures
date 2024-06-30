"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

const DeleteResourceButton = ({ resource, url, backref }: Props) => {
  const router = useRouter()

  const handler = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api${url}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        toast.error("City could not be deleted")
        return
      }
    } catch (error) {
      toast.error("There was an error while processing the request")
    }

    toast.message("City was deleted successfully")
    router.push(`${backref}?notice=DEL_DELAY`)
  }

  return (
    <button
      onClick={async () => {
        await handler()
      }}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      type="button"
    >
      Delete {resource}
    </button>
  )
}

type Props = {
  resource: string
  url: string
  backref: string
}

export default DeleteResourceButton
