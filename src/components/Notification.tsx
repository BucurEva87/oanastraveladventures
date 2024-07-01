"use client"

import { toast } from "sonner"
import {
  Bell,
  MessageCircleWarning,
  OctagonAlert,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"

export const notify = ({
  type = "neutral",
  title = "System Notification",
  description,
  duration = 5000,
}: NotificationProps) => {
  const { icon, style } = assets[type]

  toast(title, {
    className: style,
    description,
    duration,
    icon,
  })
}

export const Notification = ({
  type = "neutral",
  title = "System Notification",
  description,
  duration = 5000,
}: NotificationProps) => {
  const { icon, style } = assets[type]

  toast(title, {
    className: style,
    description,
    duration,
    icon,
  })

  return null
}

export const SystemNotification = ({
  searchParams,
}: SystemNotificationProps) => {
  if (!searchParams || !searchParams.notice) return null

  switch (searchParams.notice) {
    case "DEL_DELAY":
      return (
        <Notification
          type="warning"
          title="Be patient..."
          description="Please note that it might take sometime until the data reflects your deletion. Usually around 1 minute"
          duration={10000}
        />
      )
  }

  return null
}

const assets = {
  neutral: {
    icon: <Bell />,
    style: "bg-slate-600 text-black",
  },
  info: {
    icon: <MessageCircleWarning />,
    style: "bg-yellow-600 text-black",
  },
  success: {
    icon: <ThumbsUp />,
    style: "bg-green-600 text-white",
  },
  warning: {
    icon: <OctagonAlert />,
    style: "bg-yellow-600 text-black",
  },
  error: {
    icon: <ThumbsDown />,
    style: "bg-red-600 text-white",
  },
}

type NotificationProps = {
  type?: "neutral" | "info" | "success" | "warning" | "error"
  title?: string
  description: string
  duration?: number
}

type SystemNotificationProps = {
  searchParams?: {
    notice?: string
  }
}
