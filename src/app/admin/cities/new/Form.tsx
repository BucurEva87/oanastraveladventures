"use client"

import CitySelectFromAPI from "@/app/admin/_components/CitySelectFromAPI"
import CountrySelectFromAPI from "@/app/admin/_components/CountrySelectFromAPI"
import SectorSelectFromAPI from "@/app/admin/_components/SectorSelectFromAPI"
import SubmitResourceButton from "@/components/buttons/SubmitResourceButton"
import FormContainer from "@/components/form/FormContainer"
import FormGroupControl from "@/components/form/FormGroupControl"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import { useFormState } from "react-dom"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import FormErrorAlert from "../../_components/FormErrorAlert"
import { createCity } from "../../actions/cities"
import { createCitySchema } from "@/schemas/cities"

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
  const { register, control, getValues, watch, formState } = form
  const { isValid } = formState
  const [error, action] = useFormState(createCity, {})

  const lat = getValues("latitude")
  const lon = getValues("longitude")

  return (
    <>
      <Form {...form}>
        <FormProvider {...form}>
          <form action={action}>
            <FormContainer>
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
                    {...register("latitude")}
                    type="hidden"
                  />
                  <Input
                    {...register("longitude")}
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

              {!!Object.keys(error).length && <FormErrorAlert error={error} />}

              {!!isValid && (
                <div className="flex justify-center">
                  <SubmitResourceButton resource={`Add ${getValues("name")}`} />
                </div>
              )}
            </FormContainer>
          </form>
        </FormProvider>
      </Form>
      <DevTool control={control} />
    </>
  )
}

export default NewCityPageForm
