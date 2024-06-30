"use client"

import { CityFromAPI, CoordFromAPI } from "@/types"
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

export const CitySelect = ({ country, sector }: Props) => {
  const { control, setValue } = useFormContext()
  const [options, setOptions] = useState<CityFromAPI[]>([])
  const [selectedOption, setSelectedOption] = useState<CityFromAPI | null>()

  const loadOptions = async (inputValue: string): Promise<CityFromAPI[]> => {
    if (!options.length) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/geodata/cities/${country}/${sector}`
        )
        const cities: CityFromAPI[] = await response.json()

        setOptions(cities)
      } catch (error) {
        toast.error(
          `An error has occurred while trying to read the cities in ${country}, ${sector}`
        )
        setOptions([])
        return []
      }
    }

    return options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    )
  }

  const loadCoords = async (city: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/geodata/coord/${country}/${sector}/${city}`
    )
    const [lat, lon]: CoordFromAPI = await response.json()

    if (!lat || !lon) return

    setValue("latitude", lat, {
      shouldDirty: true,
      shouldTouch: true,
    })
    setValue("longitude", lon, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  useEffect(() => {
    setSelectedOption(null)
    setOptions([])
    setValue("name", "", {
      shouldDirty: false,
      shouldTouch: false,
    })
    setValue("latitude", "", {
      shouldDirty: false,
      shouldTouch: false,
    })
    setValue("longitude", "", {
      shouldDirty: false,
      shouldTouch: false,
    })
    setValue("description", "", {
      shouldDirty: false,
      shouldTouch: false,
    })
  }, [country, sector, setValue])

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <AsyncSelect
                {...field}
                className="text-black"
                defaultOptions
                placeholder="Start typing the name of the city"
                loadOptions={loadOptions}
                getOptionLabel={(option: CityFromAPI) =>
                  `${option.name}${
                    option.commune ? ` (comuna: ${option.commune})` : ""
                  }`
                }
                getOptionValue={(option: CityFromAPI) => option.name}
                value={selectedOption}
                onChange={async (option: SingleValue<CityFromAPI>) => {
                  if (!option) return

                  field.onChange(option.name)
                  setSelectedOption(option)
                  await loadCoords(option.name)
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
  sector: string
}

export default CitySelect
