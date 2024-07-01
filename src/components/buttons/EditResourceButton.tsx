"use client"

import { useRouter } from "next/navigation"

const EditResourceButton = ({ resource, url }: Props) => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(url)}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      type="button"
    >
      Edit {resource}
    </button>
  )
}

type Props = {
  resource: string
  url: string
}

export default EditResourceButton
