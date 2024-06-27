import { ReactNode } from "react"
import SideNavbar from "./_components/SideNavbar"
import { ThemeProvider } from "@/components/ThemeProvider"
import ThemeToggle from "./_components/ThemeToggle"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex">
      <SideNavbar />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="absolute top-2 left-2">
          <ThemeToggle />
        </div>
        <div className="p-8 w-full">{children}</div>
      </ThemeProvider>
    </section>
  )
}
