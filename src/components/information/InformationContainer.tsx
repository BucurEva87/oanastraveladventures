import { PropsWithChildren } from "react"

const InformationContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="container mx-auto p-4 2xl:max-w-[80%] max-w-full">
      <div className="bg-white dark:bg-slate-900 shadow-lg rounded-lg p-6 flex flex-col items-center">
        {children}
      </div>
    </div>
  )
}

export default InformationContainer
