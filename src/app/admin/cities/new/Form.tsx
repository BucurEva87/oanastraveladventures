"use client"

import CitySelect from "@/components/CitySelect"
import CountrySelect from "@/components/CountrySelect"
import SectorSelect from "@/components/SectorSelect"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createCitySchema } from "@/schemas/cities"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
})

const NewCityPageForm = () => {
  const form = useForm<z.infer<typeof createCitySchema>>({
    resolver: zodResolver(createCitySchema),
    defaultValues: {},
  })
  const { register, control, getValues, handleSubmit, watch, formState } = form
  const { isValid } = formState

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
      toast.error("Something went bad. See terminal")
      return
    }

    toast.message("City would be created successfully")
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

            {watch("latitude") && (
              <div className="flex justify-center mt-2">
                <Map
                  center={[getValues("latitude"), getValues("longitude")]}
                  markers={[
                    {
                      popup: { text: `City ${getValues("name")}` },
                      position: [getValues("latitude"), getValues("longitude")],
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
