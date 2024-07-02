"use client"

import SubmitResourceButton from "@/components/buttons/SubmitResourceButton"
import CitySelect from "@/components/CitySelectFromAPI"
import { notify } from "@/components/Notification"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createLocationSchema } from "@/schemas/locations"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { City } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import Select from "react-select"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form"
import { useState } from "react"
import Map from "@/components/Map"
import { CoordFromAPI } from "@/types"
import FormGroupControl from "@/components/FormGroupControl"

const NewLocationPageForm = ({ cities }: Props) => {
  const form = useForm<z.infer<typeof createLocationSchema>>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      type: null,
      description: "",
      website: null,
      entryFee: null,
      latitude: null,
      longitude: null,
    },
  })
  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState,
  } = form
  const { isValid } = formState
  const router = useRouter()

  const [selectedCity, setSelectedCity] = useState<CityPartial>({
    label: `${cities[0].name}, ${cities[0].sector} (${cities[0].sectorAuto}), ${cities[0].country} (${cities[0].countryCode}) ${cities[0].countryFlag}`,
    value: cities[0].id,
  })

  const { onBlur: nameOnBlur, ...nameRegisterProps } = register("name")
  const lat = getValues("latitude")
  const lon = getValues("longitude")

  const loadCoords = async (location: string) => {
    const city = cities.find((city) => city.id === selectedCity.value)

    if (!city) return

    const { name, sector, country } = city

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/geodata/coord/location/${location}/${name}/${sector}/${country}`
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

  const onSubmit = async (values: z.infer<typeof createLocationSchema>) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/locations`,
      {
        method: "POST",
        body: JSON.stringify(values),
      }
    )

    if (!response) {
      notify({
        type: "error",
        title: "Oups! There was an error",
        description: "Something went bad. Please see the terminal",
      })
      return
    }

    notify({
      type: "success",
      title: "Yahoo! You did it!",
      description: `Location ${values.name} was created successfully`,
    })
    router.push("/admin/locations")
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-semibold">
            Let&apos;s add a new location!
          </h1>

          <FormGroupControl label="City">
            <FormField
              control={control}
              name="cityId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Select
                        {...field}
                        className="basic-single text-black"
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        value={selectedCity}
                        options={cities.map((city) => {
                          const {
                            id,
                            name,
                            sector,
                            sectorAuto,
                            country,
                            countryCode,
                            countryFlag,
                          } = city

                          return {
                            label: `${name}, ${sector} (${sectorAuto}), ${country} (${countryCode}) ${countryFlag}`,
                            value: id,
                          }
                        })}
                        onChange={(option) => {
                          if (!option) return

                          field.onChange(option.value)
                          setSelectedCity(option)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </FormGroupControl>

          <FormGroupControl label="Name">
            <Input
              {...nameRegisterProps}
              placeholder="Please insert the name of the location"
              type="text"
              onBlur={(e) => {
                nameOnBlur(e)
                loadCoords(e.target.value)
              }}
            />
          </FormGroupControl>

          <FormGroupControl label="Type">
            <Input
              {...register("type")}
              placeholder="Location type (ex: restaurant, museum)"
            />
          </FormGroupControl>

          <FormGroupControl label="Description">
            <Textarea
              {...register("description")}
              placeholder={`Please provide a description of ${watch("name")}`}
              rows={8}
            />
          </FormGroupControl>

          <FormGroupControl label="Website">
            <Input
              {...register("website")}
              placeholder="Website of the location"
            />
          </FormGroupControl>

          <FormGroupControl label="Entry Fee">
            <Input
              {...register("entryFee", {
                valueAsNumber: true,
              })}
              placeholder="How much does visiting this location cost?"
            />
          </FormGroupControl>

          {watch("name") && (
            <>
              <Input
                {...register("latitude", {
                  valueAsNumber: true,
                })}
                type="hidden"
              />
              <Input
                {...register("longitude", {
                  valueAsNumber: true,
                })}
                type="hidden"
              />
            </>
          )}

          {!!watch("latitude") && !!lat && !!lon && (
            <div className="flex justify-center mt-2">
              <Map
                center={[lat, lon]}
                markers={[
                  {
                    popup: { text: getValues("name") },
                    position: [lat, lon],
                  },
                ]}
              />
            </div>
          )}

          {!!isValid && (
            <div className="flex justify-center">
              <SubmitResourceButton resource={`Add ${getValues("name")}`} />
            </div>
          )}
        </form>
      </Form>
      <DevTool control={control} />
    </>
  )
}

type CityPartial = {
  label: string
  value: string
}

type Props = {
  cities: Omit<City, "description" | "latitude" | "longitude">[]
}

export default NewLocationPageForm
