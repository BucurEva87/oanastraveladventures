"use client"

import { SectorFromAPI } from "@/types"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { SingleValue } from "react-select"
import AsyncSelect from "react-select/async"
import { toast } from "sonner"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"

export const SectorSelectFromAPI = ({ country }: Props) => {
  const { control, setValue } = useFormContext()
  const [options, setOptions] = useState<SectorFromAPI[]>([])
  const [selectedOption, setSelectedOption] = useState<SectorFromAPI | null>()

  const loadOptions = async (inputValue: string): Promise<SectorFromAPI[]> => {
    if (!options.length) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/geodata/sectors/${country}`
        )
        const sectors: SectorFromAPI[] = await response.json()

        setOptions(sectors)
      } catch (error) {
        toast.error(
          `An error occurred while trying to read ${country}'s sectors`
        )
        setOptions([])
        return []
      }
    }

    return options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    )
  }

  useEffect(() => {
    setSelectedOption(null)
    setOptions([])
    setValue("sector", "", {
      shouldDirty: false,
      shouldTouch: false,
    })
    setValue("sectorAuto", "", {
      shouldDirty: false,
      shouldTouch: false,
    })
  }, [country, setValue])

  return (
    <FormField
      control={control}
      name="sector"
      render={({ field }) => {
        return (
          <FormItem>
            <FormControl>
              <AsyncSelect
                {...field}
                className="text-black"
                defaultOptions
                placeholder="Start typing the name of the sector"
                loadOptions={loadOptions}
                getOptionLabel={(option: SectorFromAPI) =>
                  `${option.name} (${option.auto})`
                }
                getOptionValue={(option: SectorFromAPI) => option.name}
                value={selectedOption}
                onChange={(option: SingleValue<SectorFromAPI>) => {
                  if (!option) return

                  field.onChange(option.name)
                  setSelectedOption(option)

                  setValue("sectorAuto", option.auto, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

type Props = {
  country: string
}

export default SectorSelectFromAPI
