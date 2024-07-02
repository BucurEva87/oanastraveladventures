import Link from "next/link"
import { ReactNode } from "react"

const ExternalLink = ({ href, children }: Props) => {
  return (
    <Link
      href={href}
      passHref
      legacyBehavior
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    </Link>
  )
}

type Props = {
  href: string
  children: ReactNode
}

export default ExternalLink
