import { ReactNode } from "react"

const FormGroupControl = ({ children, label }: Props) => {
  return (
    <div className="w-full my-2">
      {!!label && <label className="text-sm font-bold">{label}</label>}
      {children}
    </div>
  )
}

type Props = {
  children: ReactNode
  label?: string
}

export default FormGroupControl
