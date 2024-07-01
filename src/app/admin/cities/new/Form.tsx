"use client"

import CitySelect from "@/components/CitySelect"
import CountrySelect from "@/components/CountrySelect"
import { notify } from "@/components/Notification"
import SectorSelect from "@/components/SectorSelect"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createCitySchema } from "@/schemas/cities"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
})

const NewCityPageForm = () => {
  const form = useForm<z.infer<typeof createCitySchema>>({
    resolver: zodResolver(createCitySchema),
    defaultValues: {
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
        headers: {
          "Content-Type": "application/json",
        },
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

            <CountrySelect />

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
                <SectorSelect country={watch("country")} />

                <Input
                  {...register("sectorAuto")}
                  type="hidden"
                />
              </>
            )}

            {watch("sector") && (
              <>
                <CitySelect
                  country={watch("country")}
                  sector={watch("sectorAuto")}
                />

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
              <Textarea
                {...register("description")}
                placeholder={`Please provide a description of ${watch("name")}`}
                rows={10}
              />
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
                <Button type="submit">Add {getValues("name")}!</Button>
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
