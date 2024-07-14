import { cn } from "@/lib/utils"

export default function PageTitle({ title, className }: PageTitleProps) {
  return (
    <h1 className={cn("text-4xl mb-4 font-semibold", className)}>{title}</h1>
  )
}

type PageTitleProps = {
  title: string
  className?: string
}
