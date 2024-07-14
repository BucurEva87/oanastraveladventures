import PageTitle from "@/app/admin/_components/PageTitle"
import { SystemNotification } from "@/components/Notification"

const EmailsPage = async ({ searchParams }: EmailsPageProps) => {
  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <PageTitle title="Locations" />

        <div className="text-center">Emails are static and already created</div>
      </div>
      <SystemNotification searchParams={searchParams} />
    </>
  )
}

type EmailsPageProps = {
  searchParams?: {
    [key: string]: string | undefined
  }
}

export default EmailsPage
