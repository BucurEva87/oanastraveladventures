"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateMetric } from "../../actions/settings"
import { useSettings } from "@/app/contexts/SettingsContext"

export default function SelectMetric({ currentMetric }: SelectMetricProps) {
  const { refreshSettings } = useSettings()

  return (
    <Select
      defaultValue={currentMetric}
      onValueChange={async (value) => {
        await updateMetric(value as "miles" | "km")
        refreshSettings()
      }}
    >
      <SelectTrigger className="max-w-min">
        <SelectValue placeholder="Distance unit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="miles">Miles</SelectItem>
        <SelectItem value="km">Kilometers</SelectItem>
      </SelectContent>
    </Select>
  )
}

type SelectMetricProps = {
  currentMetric: "miles" | "km"
}
