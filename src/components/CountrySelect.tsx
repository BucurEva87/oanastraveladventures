"use client"

import AsyncSelect from "react-select/async"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { useFormContext } from "react-hook-form"
import { CountryFromAPI } from "@/types"
import { SingleValue } from "react-select"
import { useState } from "react"
import { toast } from "sonner"

export const CountrySelect = () => {
  const { control, setValue } = useFormContext()
  const [options, setOptions] = useState<CountryFromAPI[]>([])
  const [selectedOption, setSelectedOption] = useState<CountryFromAPI>()

  const loadOptions = async (inputValue: string): Promise<CountryFromAPI[]> => {
    if (!options.length) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/countries`
        )
        const options: CountryFromAPI[] = await response.json()

        setOptions(options)
      } catch (error) {
        toast.error(
          "An error occurred while trying to read the countries of the world"
        )
        setOptions([])
        return []
      }
    }

    return options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    )
  }

  return (
    <FormField
      control={control}
      name="country"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <AsyncSelect
                {...field}
                className="text-black"
                defaultOptions
                placeholder="Start typing the name of the country"
                loadOptions={loadOptions}
                getOptionLabel={(option: CountryFromAPI) =>
                  `${option.name} ${option.flag}`
                }
                getOptionValue={(option: CountryFromAPI) => option.name}
                value={selectedOption}
                onChange={(option: SingleValue<CountryFromAPI>) => {
                  if (!option) return

                  field.onChange(option.name)
                  setSelectedOption(option)

                  setValue("countryFlag", option.flag, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                  setValue("countryCode", option.code, {
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

export default CountrySelect
