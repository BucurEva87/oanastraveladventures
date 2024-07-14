"use client"

import SubmitResourceButton from "@/components/buttons/SubmitResourceButton"
import FormContainer from "@/components/form/FormContainer"
import FormGroupControl from "@/components/form/FormGroupControl"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createLocationSchema } from "@/schemas/locations"
import { CoordFromAPI } from "@/types"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { City } from "@prisma/client"
import dynamic from "next/dynamic"
import { useState } from "react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"
import Select from "react-select"
import { z } from "zod"
import FormErrorAlert from "../../_components/FormErrorAlert"
import { createLocation } from "../../actions/locations"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
})

const NewLocationPageForm = ({ cities }: NewLocationPageFormProps) => {
  const form = useForm<z.infer<typeof createLocationSchema>>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      cityId: cities.length === 1 ? cities[0].id : undefined,
      type: null,
      description: "",
      website: null,
      entryFee: null,
      latitude: null,
      longitude: null,
    },
  })
  const { register, control, getValues, setValue, watch, formState } = form
  const { isValid } = formState
  const [error, action] = useFormState(createLocation, {})

  const cityOptions = cities.map((city) => {
    const { id, name, sector, sectorAuto, country, countryCode, countryFlag } =
      city

    return {
      label: `${name}, ${sector} (${sectorAuto}), ${country} (${countryCode}) ${countryFlag}`,
      value: id,
    }
  })
  const [selectedCity, setSelectedCity] = useState(cityOptions[0])

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

  return (
    <>
      <Form {...form}>
        <form action={action}>
          <FormContainer>
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
                          options={cityOptions}
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
                {...register("entryFee")}
                type="number"
                step={0.01}
                placeholder="How much does visiting this location cost?"
              />
            </FormGroupControl>

            {watch("name") && (
              <>
                <Input
                  {...register("latitude")}
                  type="hidden"
                />
                <Input
                  {...register("longitude")}
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

            {!!Object.keys(error).length && <FormErrorAlert error={error} />}

            {!!isValid && (
              <div className="flex justify-center">
                <SubmitResourceButton resource={`Add ${getValues("name")}`} />
              </div>
            )}
          </FormContainer>
        </form>
      </Form>
      <DevTool control={control} />
    </>
  )
}

type NewLocationPageFormProps = {
  cities: Omit<City, "description" | "latitude" | "longitude">[]
}

export default NewLocationPageForm
