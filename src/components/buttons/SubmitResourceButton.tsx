"use client"

import { useFormStatus } from "react-dom"

const SubmitResourceButton = ({ resource }: Props) => {
  const { pending } = useFormStatus()

  return (
    <button
      className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-700"
      disabled={pending}
      type="submit"
    >
      {pending ? "Processing..." : resource}
    </button>
  )
}

type Props = {
  resource: string
}

export default SubmitResourceButton
