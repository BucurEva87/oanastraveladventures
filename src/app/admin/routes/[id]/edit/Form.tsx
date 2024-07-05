"use client"

import UpdateResourceButton from "@/components/buttons/UpdateResourceButton"
import FormContainer from "@/components/form/FormContainer"
import FormGroupControl from "@/components/form/FormGroupControl"
import { notify } from "@/components/Notification"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createRouteSchema } from "@/schemas/routes"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { Location } from "@prisma/client"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import Select from "react-select"
import { z } from "zod"
import { RouteWithLocations } from "./page"
import { calculateRouteLength } from "@/lib/utils"

const EditRoutePageForm = ({ route }: Props) => {
  const {
    id,
    name,
    available: routeAvailable,
    description,
    prices,
    circular: routeCircular,
    length,
    locations,
  } = route

  const form = useForm<z.infer<typeof createRouteSchema>>({
    resolver: zodResolver(createRouteSchema),
    defaultValues: {
      name,
      available: routeAvailable,
      description,
      prices: JSON.parse(prices),
      circular: routeCircular,
      length,
    },
  })
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isValid },
  } = form
  const { fields, append, remove } = useFieldArray({
    name: "prices",
    control,
  })
  const router = useRouter()

  const [selectedLocations, setSelectedLocations] = useState<Location[]>(
    locations.map((item) => item.location as Location)
  )
  const [available, setAvailable] = useState(
    availableOptions.find((item) => item.value === routeAvailable)
  )
  const [circular, setCircular] = useState(
    circularOptions.find((item) => item.value === routeCircular)
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

  const onSubmit = async (values: z.infer<typeof createRouteSchema>) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/routes/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...values,
          prices: JSON.stringify(values.prices),
          locationsIds: selectedLocations.map((location) => location.id),
        }),
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
      description: `${values.name} was updated successfully`,
    })
    router.push("/admin/routes")
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer>
            <h1 className="text-2xl font-semibold mb-4 text-center">
              Let&apos;s edit {name}!
            </h1>

            <FormGroupControl label="Name">
              <Input
                {...register("name")}
                placeholder="Please insert the name of the route"
                type="text"
                defaultValue={name}
              />
            </FormGroupControl>

            <FormGroupControl label="Locations">
              <Select
                isMulti
                defaultValue={selectedLocations}
                options={locations.map((item) => item.location as Location)}
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
              {watch("length")} kilometers
            </FormGroupControl>

            <Input
              {...register("length", {
                valueAsNumber: true,
              })}
              defaultValue={length}
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
                defaultValue={description ?? undefined}
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

            <div>
              {fields.map((field, index) => {
                return (
                  <FormGroupControl key={field.id}>
                    <div className="flex gap-4 relative">
                      <Input
                        {...register(`prices.${index}.people`, {
                          valueAsNumber: true,
                        })}
                        type="text"
                        placeholder="People #"
                      />
                      <Input
                        {...register(`prices.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        type="text"
                        placeholder="Price per person"
                      />
                      {index > 0 && (
                        <Trash2
                          onClick={() => remove(index)}
                          className="absolute right-[-2rem] top-[10px] hover:cursor-pointer text-red-800"
                        />
                      )}
                    </div>
                  </FormGroupControl>
                )
              })}
              <div className="flex justify-center">
                <a
                  className="hover:cursor-pointer"
                  onClick={() =>
                    append({ people: undefined, price: undefined })
                  }
                >
                  Add another price
                </a>
              </div>
            </div>

            {!!isValid && (
              <div className="flex justify-center">
                <UpdateResourceButton resource={name} />
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

type Props = {
  route: RouteWithLocations
}

export default EditRoutePageForm
