import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Info as InfoIcon } from "lucide-react"

const Info = ({ title, body }: InfoProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <InfoIcon className="ml-4" />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm">{body}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

type InfoProps = {
  title: string
  body: string
}

export default Info
