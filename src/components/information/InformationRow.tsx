import { ReactElement } from "react"

const InformationRow = ({ label, information, style }: Props) => {
  return (
    <div className="mb-4">
      <span className="text-gray-700 dark:text-gray-400">{label}: </span>
      <span className={style}>{information}</span>
    </div>
  )
}

type Props = {
  label: string
  information: string | number | ReactElement
  style?: string
}

export default InformationRow
