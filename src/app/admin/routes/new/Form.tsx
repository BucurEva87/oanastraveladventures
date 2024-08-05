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
import { formatCurrency } from "@/lib/formatters"
import { calculateRouteLength, manageDistance } from "@/lib/utils"
import { createRouteSchema } from "@/schemas/routes"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { Location as SchemaLocation } from "@prisma/client"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"
import Select from "react-select"
import { z } from "zod"
import FormErrorAlert from "../../_components/FormErrorAlert"
import { createRoute } from "../../actions/routes"
import { useSettings } from "@/app/contexts/SettingsContext"

const NewRoutePageForm = ({ locations }: Props) => {
  const form = useForm<z.infer<typeof createRouteSchema>>({
    resolver: zodResolver(createRouteSchema),
    defaultValues: {
      available: false,
      circular: false,
      length: 0,
      priceInCents: undefined,
    },
  })
  const { register, control, getValues, setValue, watch, formState } = form
  const { isValid } = formState

  const adapterFunction = async (state: unknown, formData: FormData) => {
    return createRoute(
      null,
      selectedLocations.map((location) => location.id),
      formData
    )
  }
  const [error, action] = useFormState(adapterFunction, {})

  const { settings } = useSettings()
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([])
  const [available, setAvailable] = useState(availableOptions[1])
  const [circular, setCircular] = useState(circularOptions[1])
  const [priceInCents, setPriceInCents] = useState<number>(0)

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
            <h1 className="text-2xl font-semibold">
              Let&apos;s add a new route!
            </h1>

            <FormGroupControl label="Locations">
              <Select
                isMulti
                defaultValue={[]}
                options={locations}
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

            <FormGroupControl label="Name">
              <Input
                {...register("name")}
                placeholder="Please insert the name of the route"
                type="text"
              />
            </FormGroupControl>

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

            <Input
              {...register("length")}
              type="hidden"
            />

            <FormGroupControl label="Price (in cents)">
              <Input
                {...register("priceInCents")}
                type="number"
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

const circularOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
]
const availableOptions = [
  { value: true, label: "Available" },
  { value: false, label: "Unavailable" },
]

type Location = Pick<SchemaLocation, "id" | "name" | "latitude" | "longitude">

type Props = {
  locations: Location[]
}

export default NewRoutePageForm
