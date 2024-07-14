import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb } from "lucide-react"

const FormErrorAlert = ({ error }: FormErrorAlertProps) => {
  return (
    <Alert
      variant="destructive"
      className="mt-4"
    >
      <Lightbulb className="h-4 w-4" />
      <AlertTitle>Stay a while and listen...</AlertTitle>
      <AlertDescription>
        <div>
          <p>
            There seems to be a problem with the data you&apos;re trying to
            submit:
          </p>
          <dl>
            {Object.entries(error).map(([key, value]) => {
              return (
                <>
                  <dt className="font-bold">
                    {key.at(0)?.toUpperCase()}
                    {key.substring(1)}
                  </dt>
                  <dd className="ml-2">{value}</dd>
                </>
              )
            })}
          </dl>
        </div>
      </AlertDescription>
    </Alert>
  )
}

type FormErrorAlertProps = {
  error: {
    [key: string]: string[] | undefined
  }
}

export default FormErrorAlert
