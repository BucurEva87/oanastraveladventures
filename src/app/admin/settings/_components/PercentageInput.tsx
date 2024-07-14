"use client"

import { Input } from "@/components/ui/input"
import { updatePercent } from "../../actions/settings"
import { useSettings } from "@/app/contexts/SettingsContext"

const PercentageInput = ({ percent }: PercentageInputProps) => {
  const { refreshSettings } = useSettings()

  return (
    <Input
      defaultValue={percent}
      type="number"
      placeholder="Percent gained per sale"
      onBlur={async (e) => {
        await updatePercent(Number(e.target.value))
        refreshSettings()
      }}
      className="w-[200px]"
    />
  )
}

type PercentageInputProps = {
  percent: number
}

export default PercentageInput
