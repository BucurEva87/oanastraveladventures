"use client"

import FormErrorAlert from "@/app/admin/_components/FormErrorAlert"
import { updateCity } from "@/app/admin/actions/cities"
import SubmitResourceButton from "@/components/buttons/SubmitResourceButton"
import FormContainer from "@/components/form/FormContainer"
import FormGroupControl from "@/components/form/FormGroupControl"
import InformationContainer from "@/components/information/InformationContainer"
import InformationRow from "@/components/information/InformationRow"
import Map from "@/components/Map"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { convertDMSToDD } from "@/lib/utils"
import { updateCitySchema } from "@/schemas/cities"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { City } from "@prisma/client"
import { useEffect } from "react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"

const EditCityPageForm = ({ city }: EditCityPageProps) => {
  const form = useForm<z.infer<typeof updateCitySchema>>({
    resolver: zodResolver(updateCitySchema),
    defaultValues: {
      description: city.description,
      latitude: city.latitude ?? undefined,
      longitude: city.longitude ?? undefined,
    },
  })
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
  } = form

  const adapterFunction = async (state: unknown, formData: FormData) => {
    return updateCity(null, city.id, formData)
  }
  const [error, action] = useFormState(adapterFunction, {})

  const lat = getValues("latitude")
  const { onBlur: latOnBlur, ...latRegisterProps } = register("latitude", {
    valueAsNumber: true,
  })
  const lon = getValues("longitude")
  const { onBlur: lonOnBlur, ...lonRegisterProps } = register("longitude", {
    valueAsNumber: true,
  })

  useEffect(() => {
    if (!city.latitude || !city.longitude) return

    setValue("latitude", city.latitude, { shouldTouch: true })
    setValue("longitude", city.longitude, { shouldTouch: true })
  }, [city.latitude, city.longitude, setValue])

  return (
    <>
      <Form {...form}>
        <form action={action}>
          <InformationContainer>
            <h1 className="text-2xl font-semibold mb-4 text-center">
              Let&apos;s edit city {city.name}!
            </h1>
            <div className="flex items-center mb-4">
              <span className="text-xl font-semibold">{city.country}</span>
              <span className="mx-2 text-gray-500">({city.countryCode})</span>
              <span className="ml-2">{city.countryFlag}</span>
            </div>
            <InformationRow
              label="Sector"
              information={city.sector}
            />
            <InformationRow
              label="Sector Auto"
              information={city.sectorAuto}
            />
          </InformationContainer>

          <FormContainer>
            <div className="flex w-full gap-2">
              <FormGroupControl label="Latitude">
                <Input
                  {...latRegisterProps}
                  placeholder="Insert latitude"
                  defaultValue={city.latitude ?? undefined}
                  type="text"
                  onBlur={(e) => {
                    setValue("latitude", convertDMSToDD(e.target.value), {
                      shouldDirty: true,
                      shouldTouch: true,
                    })

                    latOnBlur(e)
                  }}
                />
              </FormGroupControl>
              <FormGroupControl label="Longitude">
                <Input
                  {...lonRegisterProps}
                  placeholder="Insert longitude"
                  defaultValue={city.longitude ?? undefined}
                  type="text"
                  onBlur={(e) => {
                    setValue("longitude", convertDMSToDD(e.target.value), {
                      shouldDirty: true,
                      shouldTouch: true,
                    })

                    lonOnBlur(e)
                  }}
                />
              </FormGroupControl>
            </div>

            <FormGroupControl label="Description">
              <Textarea
                {...register("description")}
                placeholder={`Please provide a description of ${city.name}`}
                rows={10}
                defaultValue={city.description ?? undefined}
              />
            </FormGroupControl>

            {!!watch("latitude") && !!watch("longitude") && !!lat && !!lon && (
              <div className="my-4">
                <Map
                  center={[lat, lon]}
                  markers={[
                    {
                      popup: { text: `City ${city.name}` },
                      position: [lat, lon],
                    },
                  ]}
                />
              </div>
            )}

            {!!Object.keys(error).length && <FormErrorAlert error={error} />}

            {!!isValid && (
              <div className="flex justify-center">
                <SubmitResourceButton resource={`Update ${city.name}`} />
              </div>
            )}
          </FormContainer>
        </form>
      </Form>
      <DevTool control={control} />
    </>
  )
}

type EditCityPageProps = {
  city: City
}

export default EditCityPageForm
