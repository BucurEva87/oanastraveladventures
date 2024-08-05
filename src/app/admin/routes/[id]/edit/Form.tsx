"use client"

import FormErrorAlert from "@/app/admin/_components/FormErrorAlert"
import { updateRoute } from "@/app/admin/actions/routes"
import { useSettings } from "@/app/contexts/SettingsContext"
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
import { formatCurrency } from "@/lib/formatters"
import { calculateRouteLength, manageDistance } from "@/lib/utils"
import { updateRouteSchema } from "@/schemas/routes"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { Location, Route, RouteLocation } from "@prisma/client"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"
import Select from "react-select"
import { z } from "zod"

const EditRoutePageForm = ({ route }: Props) => {
  const { settings } = useSettings()
  const form = useForm<z.infer<typeof updateRouteSchema>>({
    resolver: zodResolver(updateRouteSchema),
    defaultValues: {
      name: route.name,
      available: route.available,
      description: route.description,
      priceInCents: Math.floor(
        route.priceInCents / (1 + settings.percent / 100)
      ),
      circular: route.circular,
      length: route.length,
    },
  })
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    formState: { isValid },
  } = form

  const adapterFunction = async (state: unknown, formData: FormData) => {
    return updateRoute(
      null,
      route.id,
      selectedLocations.map((location) => location.id),
      formData
    )
  }
  const [error, action] = useFormState(adapterFunction, {})

  const [selectedLocations, setSelectedLocations] = useState<Location[]>(
    route.locations.map((item) => item.location as Location)
  )
  const [available, setAvailable] = useState(
    availableOptions.find((item) => item.value === route.available)
  )
  const [circular, setCircular] = useState(
    circularOptions.find((item) => item.value === route.circular)
  )
  const [priceInCents, setPriceInCents] = useState<number>(
    route.priceInCents / (1 + settings.percent / 100)
  )

  useEffect(() => {
    setValue(
      "length",
      calculateRouteLength(selectedLocations, getValues("circular")),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }, [selectedLocations, getValues, setValue, circular])

  return (
    <>
      <Form {...form}>
        <form action={action}>
          <FormContainer>
            <h1 className="text-2xl font-semibold mb-4 text-center">
              Let&apos;s edit {route.name}!
            </h1>

            <FormGroupControl label="Name">
              <Input
                {...register("name")}
                placeholder="Please insert the name of the route"
                type="text"
                defaultValue={route.name}
              />
            </FormGroupControl>

            <FormGroupControl label="Locations">
              <Select
                isMulti
                defaultValue={selectedLocations}
                options={route.locations.map(
                  (item) => item.location as Location
                )}
                getOptionLabel={(option: Location) => option.name}
                getOptionValue={(option: Location) => option.id}
                className="basic-multi-select text-black"
                classNamePrefix="select"
                placeholder="Please select all the locations (in order) for this route"
                onChange={(option) =>
                  setSelectedLocations(option as Location[])
                }
              />
            </FormGroupControl>

            <FormGroupControl label="Total length: ">
              {manageDistance(watch("length"), settings.metric)}{" "}
              {settings.metric}
            </FormGroupControl>

            <Input
              {...register("length")}
              type="hidden"
            />

            <FormGroupControl label="Available">
              <FormField
                control={control}
                name="available"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Select
                          {...field}
                          defaultValue={available}
                          options={availableOptions}
                          value={available}
                          className="basic-single text-black"
                          classNamePrefix="select"
                          onChange={(option) => {
                            if (!option) return

                            setAvailable(option)
                            field.onChange(option.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </FormGroupControl>

            <FormGroupControl label="Description">
              <Textarea
                {...register("description")}
                placeholder={`Please provide a description of ${watch("name")}`}
                rows={8}
                defaultValue={route.description ?? undefined}
              />
            </FormGroupControl>

            <FormGroupControl label="Circular">
              <FormField
                control={control}
                name="circular"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Select
                          {...field}
                          options={circularOptions}
                          value={circular}
                          defaultValue={circular}
                          className="basic-single text-black"
                          classNamePrefix="select"
                          onChange={(option) => {
                            if (!option) return

                            setCircular(option)
                            field.onChange(option.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </FormGroupControl>

            <FormGroupControl label="Price (in cents)">
              <Input
                {...register("priceInCents")}
                type="number"
                defaultValue={route.priceInCents}
                onChange={(e) => setPriceInCents(Number(e.target.value))}
              />
            </FormGroupControl>
            <span className="mr-auto">
              {!!priceInCents
                ? formatCurrency(
                    (priceInCents + (priceInCents / 100) * settings.percent) /
                      100
                  )
                : formatCurrency(0)}
            </span>

            {!!error && !!Object.keys(error).length && (
              <FormErrorAlert error={error} />
            )}

            {!!isValid && (
              <div className="flex justify-center">
                <SubmitResourceButton
                  resource={`Update ${getValues("name")}`}
                />
              </div>
            )}
          </FormContainer>
        </form>
      </Form>
      <DevTool control={control} />
    </>
  )
}

const circularOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
]
const availableOptions = [
  { value: true, label: "Available" },
  { value: false, label: "Unavailable" },
]

type RouteWithLocations = Route & {
  locations: (RouteLocation & {
    location: Pick<Location, "id" | "name" | "latitude" | "longitude">
  })[]
}

type Props = {
  route: RouteWithLocations
}

export default EditRoutePageForm
