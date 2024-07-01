"use client"

const UpdateResourceButton = ({ resource }: Props) => {
  return (
    <button
      className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-700"
      type="submit"
    >
      Update {resource}
    </button>
  )
}

type Props = {
  resource: string
}

export default UpdateResourceButton
