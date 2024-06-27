"use client"

import { Button } from "@/components/ui/button"
import { Nav } from "@/components/ui/nav"
import { useWindowWidth } from "@react-hook/window-size"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  UserRound,
  Church,
  MapPin,
  Map,
  Mail,
} from "lucide-react"
import { useState } from "react"

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const onlyWidth = useWindowWidth()
  const mobileWidth = onlyWidth < 768

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="relative min-w-[80px] border-r px-3 pb-10 pt-24">
      {!mobileWidth && (
        <div className="absolute top-7 right-[-20px]">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className="rounded-full p-2"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
            variant: "default",
          },
          {
            title: "Users",
            href: "/admin/users",
            icon: UserRound,
            variant: "ghost",
          },
          {
            title: "Cities",
            href: "/admin/cities",
            icon: Church,
            variant: "ghost",
          },
          {
            title: "Locations",
            href: "/admin/locations",
            icon: MapPin,
            variant: "ghost",
          },
          {
            title: "Routes",
            href: "/admin/routes",
            icon: Map,
            variant: "ghost",
          },
          {
            title: "Emails",
            href: "/admin/emails",
            icon: Mail,
            variant: "ghost",
          },
          {
            title: "Orders",
            href: "/admin/orders",
            icon: ShoppingCart,
            variant: "ghost",
          },
          {
            title: "Settings",
            href: "/admin/settings",
            icon: Settings,
            variant: "ghost",
          },
        ]}
      />
    </div>
  )
}

type Props = {}
