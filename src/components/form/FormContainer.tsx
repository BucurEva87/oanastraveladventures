import { PropsWithChildren } from "react"

const FormContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full md:w-[80%] lg:w-[60%] flex flex-col items-center mx-auto">
      {children}
    </div>
  )
}
export default FormContainer
