"use client"

import FormErrorAlert from "@/app/admin/_components/FormErrorAlert"
import { updateLocation } from "@/app/admin/actions/locations"
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
import { updateLocationschema } from "@/schemas/locations"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LocationWithCity } from "./page"

const EditLocationPageForm = ({ location }: Props) => {
  const form = useForm<z.infer<typeof updateLocationschema>>({
    resolver: zodResolver(updateLocationschema),
    defaultValues: {
      type: location.type,
      description: location.description,
      website: location.website,
      entryFee: location.entryFee,
      latitude: location.latitude ?? undefined,
      longitude: location.longitude ?? undefined,
    },
  })
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = form

  const adapterFunction = async (state: unknown, formData: FormData) => {
    return updateLocation(null, location.id, formData)
  }
  const [error, action] = useFormState(adapterFunction, {})

  const lat = getValues("latitude")
  const { onBlur: latOnBlur, ...latRegisterProps } = register("latitude")
  const lon = getValues("longitude")
  const { onBlur: lonOnBlur, ...lonRegisterProps } = register("longitude")

  useEffect(() => {
    if (!location.latitude || !location.longitude) return

    setValue("latitude", location.latitude, { shouldTouch: true })
    setValue("longitude", location.longitude, { shouldTouch: true })
  }, [location.latitude, location.longitude, setValue])

  return (
    <>
      <Form {...form}>
        <form action={action}>
          <InformationContainer>
            <h1 className="text-2xl font-semibold mb-4 text-center">
              Let&apos;s edit {location.name}!
            </h1>
            <div className="flex items-center mb-4">
              <span className="text-xl font-semibold">
                {location.city.country}
              </span>
              <span className="ml-2">{location.city.countryFlag}</span>
            </div>
            <InformationRow
              label="City"
              information={location.city.name}
            />
            <InformationRow
              label="Sector"
              information={location.city.sector}
            />
          </InformationContainer>

          <FormContainer>
            <div className="flex w-full gap-2">
              <FormGroupControl label="Latitude">
                <Input
                  {...latRegisterProps}
                  placeholder="Insert latitude"
                  defaultValue={location.latitude ?? undefined}
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
                  defaultValue={location.longitude ?? undefined}
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
                placeholder={`Please provide a description of ${location.name}`}
                rows={10}
                defaultValue={location.description ?? undefined}
              />
            </FormGroupControl>

            <FormGroupControl label="Type">
              <Input
                {...register("type")}
                placeholder="Location type (ex: restaurant, museum)"
                defaultValue={location.type ?? undefined}
              />
            </FormGroupControl>

            <FormGroupControl label="Website">
              <Input
                {...register("website")}
                placeholder="Website of the location"
                defaultValue={location.website ?? undefined}
              />
            </FormGroupControl>

            <FormGroupControl label="Entry Fee">
              <Input
                {...register("entryFee")}
                type="number"
                step={0.01}
                placeholder="How much does visiting this location cost?"
                defaultValue={location.entryFee ?? undefined}
              />
            </FormGroupControl>

            {!!watch("latitude") && !!watch("longitude") && !!lat && !!lon && (
              <div className="my-4">
                <Map
                  center={[lat, lon]}
                  markers={[
                    {
                      popup: { text: location.name },
                      position: [lat, lon],
                    },
                  ]}
                />
              </div>
            )}

            {!!Object.keys(error).length && <FormErrorAlert error={error} />}

            {!!isValid && (
              <div className="flex justify-center">
                <SubmitResourceButton resource={`Update ${location.name}`} />
              </div>
            )}
          </FormContainer>
        </form>
      </Form>
      <DevTool control={control} />
    </>
  )
}

type Props = {
  location: LocationWithCity
}

export default EditLocationPageForm
