import PageTitle from "@/app/admin/_components/PageTitle"
import { SystemNotification } from "@/components/Notification"
import SelectMetric from "./_components/SelectMetric"
import prisma from "@/prisma/client"
import PercentageInput from "./_components/PercentageInput"

const SettingsPage = async ({ searchParams }: SettingsPageProps) => {
  const { metric, percent } = (await prisma.setting.findFirst())!

  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <PageTitle title="Settings" />

        <div className="text-center">
          <div className="flex items-center gap-3 mb-3">
            <label>Distance unit</label>
            <SelectMetric currentMetric={metric as "miles" | "km"} />
          </div>
          <div className="flex items-center gap-3">
            <label>Percentage</label>
            <PercentageInput percent={percent} />
          </div>
        </div>
      </div>

      <SystemNotification searchParams={searchParams} />
    </>
  )
}

type SettingsPageProps = {
  searchParams?: {
    [key: string]: string | undefined
  }
}

export default SettingsPage
