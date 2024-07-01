"use client"

import Map from "@/components/Map"
import { notify } from "@/components/Notification"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import UpdateResourceButton from "@/components/UpdateResourceButton"
import { convertDMSToDD } from "@/lib/utils"
import { updateCitySchema } from "@/schemas/cities"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { City } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
    },
  })
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid, errors },
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

  const onSubmit = async (values: z.infer<typeof updateCitySchema>) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cities/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    )

    if (!response) {
      notify({
        type: "success",
        title: "Yahoo! You did it!",
        description: `City ${values.name} was created successfully`,
      })
      return
    }

    notify({
      type: "success",
      title: "Yahoo! You did it!",
      description: `City ${values.name} was updated successfully`,
    })
    router.push("/admin/cities")
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container mx-auto p-4">
            <div className="bg-white dark:bg-slate-900 shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h1 className="text-2xl font-semibold mb-4 text-center">
                Let&apos;s edit city {city.name}!
              </h1>
              <div className="flex items-center mb-4">
                <span className="text-xl font-semibold">{country}</span>
                <span className="mx-2 text-gray-500">({countryCode})</span>
                <span className="ml-2">{countryFlag}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-700">Sector: </span>
                <span>{sector}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-700">Sector Auto: </span>
                <span>{sectorAuto}</span>
              </div>

              <Input
                {...latRegisterProps}
                placeholder="Insert latitude"
                defaultValue={latitude ? latitude : 0}
                type="text"
                onBlur={(e) => {
                  setValue("latitude", convertDMSToDD(e.target.value), {
                    shouldDirty: true,
                    shouldTouch: true,
                  })

                  latOnBlur(e)
                }}
              />
              <Input
                {...lonRegisterProps}
                placeholder="Insert longitude"
                defaultValue={longitude ? longitude : 0}
                type="text"
                onBlur={(e) => {
                  setValue("longitude", convertDMSToDD(e.target.value), {
                    shouldDirty: true,
                    shouldTouch: true,
                  })

                  lonOnBlur(e)
                }}
              />

              <Textarea
                {...register("description")}
                placeholder={`Please provide a description of ${name}`}
                rows={10}
                defaultValue={description ? description : ""}
              />

              {(!!watch("latitude") || !!watch("longitude")) &&
                !!lat &&
                !!lon && (
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
            </div>
          </div>
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
