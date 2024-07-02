"use client"

import SubmitResourceButton from "@/components/buttons/SubmitResourceButton"
import CitySelectFromAPI from "@/components/CitySelectFromAPI"
import CountrySelectFromAPI from "@/components/CountrySelectFromAPI"
import FormGroupControl from "@/components/FormGroupControl"
import { notify } from "@/components/Notification"
import SectorSelectFromAPI from "@/components/SectorSelectFromAPI"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createCitySchema } from "@/schemas/cities"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
})

const NewCityPageForm = () => {
  const form = useForm<z.infer<typeof createCitySchema>>({
    resolver: zodResolver(createCitySchema),
    defaultValues: {
      description: "",
      latitude: null,
      longitude: null,
    },
  })
  const { register, control, getValues, handleSubmit, watch, formState } = form
  const { isValid } = formState
  const router = useRouter()

  const lat = getValues("latitude")
  const lon = getValues("longitude")

  const onSubmit = async (values: z.infer<typeof createCitySchema>) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cities`,
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
      description: `City ${values.name} was created successfully`,
    })
    router.push("/admin/cities")
  }

  return (
    <>
      <Form {...form}>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl font-semibold">
              Let&apos;s add a new city!
            </h1>

            <FormGroupControl label="Country">
              <CountrySelectFromAPI />
            </FormGroupControl>

            <Input
              {...register("countryFlag")}
              type="hidden"
            />
            <Input
              {...register("countryCode")}
              type="hidden"
            />

            {watch("country") && (
              <>
                <FormGroupControl label="Sector">
                  <SectorSelectFromAPI country={watch("country")} />
                </FormGroupControl>

                <Input
                  {...register("sectorAuto")}
                  type="hidden"
                />
              </>
            )}

            {watch("sector") && (
              <>
                <FormGroupControl label="City">
                  <CitySelectFromAPI
                    country={watch("country")}
                    sector={watch("sectorAuto")}
                  />
                </FormGroupControl>

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

            {watch("name") && (
              <FormGroupControl label="Description">
                <Textarea
                  {...register("description")}
                  placeholder={`Please provide a description of ${watch(
                    "name"
                  )}`}
                  rows={8}
                />
              </FormGroupControl>
            )}

            {!!watch("latitude") && !!lat && !!lon && (
              <div className="flex justify-center mt-2">
                <Map
                  center={[lat, lon]}
                  markers={[
                    {
                      popup: { text: `City ${getValues("name")}` },
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
        </FormProvider>
      </Form>
      <DevTool control={control} />
    </>
  )
}

export default NewCityPageForm
