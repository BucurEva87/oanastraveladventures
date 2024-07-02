"use client"

import Map from "@/components/Map"
import { notify } from "@/components/Notification"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import UpdateResourceButton from "@/components/buttons/UpdateResourceButton"
import { convertDMSToDD } from "@/lib/utils"
import { updateCitySchema } from "@/schemas/cities"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { City } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import FormGroupControl from "@/components/FormGroupControl"
import { useEffect } from "react"
import InformationContainer from "@/components/information/InformationContainer"
import InformationRow from "@/components/information/InformationRow"

const EditCityPageForm = ({ city }: Props) => {
  const {
    id,
    name,
    country,
    countryCode,
    countryFlag,
    sector,
    sectorAuto,
    description,
    latitude,
    longitude,
  } = city
  const form = useForm<z.infer<typeof updateCitySchema>>({
    resolver: zodResolver(updateCitySchema),
    defaultValues: {
      description,
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
    },
  })
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = form
  const router = useRouter()

  const lat = getValues("latitude")
  const { onBlur: latOnBlur, ...latRegisterProps } = register("latitude", {
    valueAsNumber: true,
  })
  const lon = getValues("longitude")
  const { onBlur: lonOnBlur, ...lonRegisterProps } = register("longitude", {
    valueAsNumber: true,
  })

  useEffect(() => {
    if (!latitude || !longitude) return

    setValue("latitude", latitude, { shouldTouch: true })
    setValue("longitude", longitude, { shouldTouch: true })
  }, [latitude, longitude, setValue])

  const onSubmit = async (values: z.infer<typeof updateCitySchema>) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cities/${id}`,
      {
        method: "PATCH",
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
      description: `City ${name} was updated successfully`,
    })
    router.push("/admin/cities")
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InformationContainer>
            <h1 className="text-2xl font-semibold mb-4 text-center">
              Let&apos;s edit city {city.name}!
            </h1>
            <div className="flex items-center mb-4">
              <span className="text-xl font-semibold">{country}</span>
              <span className="mx-2 text-gray-500">({countryCode})</span>
              <span className="ml-2">{countryFlag}</span>
            </div>
            <InformationRow
              label="Sector"
              information={sector}
            />
            <InformationRow
              label="Sector Auto"
              information={sectorAuto}
            />

            <div className="flex w-full gap-2">
              <FormGroupControl label="Latitude">
                <Input
                  {...latRegisterProps}
                  placeholder="Insert latitude"
                  defaultValue={latitude ?? undefined}
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
                  defaultValue={longitude ?? undefined}
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
                placeholder={`Please provide a description of ${name}`}
                rows={10}
                defaultValue={description ?? undefined}
              />
            </FormGroupControl>

            {!!watch("latitude") && !!watch("longitude") && !!lat && !!lon && (
              <div className="my-4">
                <Map
                  center={[lat, lon]}
                  markers={[
                    {
                      popup: { text: `City ${name}` },
                      position: [lat, lon],
                    },
                  ]}
                />
              </div>
            )}

            {!!isValid && (
              <div className="flex justify-center">
                <UpdateResourceButton resource={name} />
              </div>
            )}
          </InformationContainer>
        </form>
      </Form>
      <DevTool control={control} />
    </>
  )
}

type Props = {
  city: City
}

export default EditCityPageForm
