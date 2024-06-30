"use client"

import { toast } from "sonner"
import { TriangleAlert } from "lucide-react"

const Notification = ({ searchParams }: Props) => {
  if (!searchParams || !searchParams.notice) return null

  const code = searchParams.notice
  const signal = (code: string) => {
    switch (code) {
      case "DEL_DELAY":
        toast("Be patient...", {
          className: "bg-yellow-600 text-black",
          description:
            "Please note that it might take sometime until the data reflects your deletion. Usually around 1 minute",
          duration: 10000,
          icon: <TriangleAlert />,
        })
    }
  }

  signal(code)

  return null
}

type Props = {
  searchParams?: {
    notice?: string
  }
}

export default Notification
