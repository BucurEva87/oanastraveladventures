"use client"

import SubmitResourceButton from "@/components/buttons/SubmitResourceButton"
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
import { calculateRouteLength } from "@/lib/utils"
import { createRouteSchema } from "@/schemas/routes"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import Select from "react-select"
import { z } from "zod"

const NewRoutePageForm = ({ locations }: Props) => {
  const form = useForm<z.infer<typeof createRouteSchema>>({
    resolver: zodResolver(createRouteSchema),
    defaultValues: {
      available: true,
      circular: true,
      length: 0,
      prices: [{ people: undefined, price: undefined }],
    },
  })
  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState,
  } = form
  const { fields, append, remove } = useFieldArray({
    name: "prices",
    control,
  })

  const { isValid } = formState
  const router = useRouter()

  const [selectedLocations, setSelectedLocations] = useState<Location[]>([])
  const [available, setAvailable] = useState<BooleanSelectOption>({
    label: "Available",
    value: true,
  })
  const [circular, setCircular] = useState<BooleanSelectOption>({
    label: "Yes",
    value: true,
  })

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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/routes`,
      {
        method: "POST",
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
      description: `Route ${values.name} was created successfully`,
    })
    // router.push("/admin/locations")
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              {watch("length")} kilometers
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
                          options={[
                            { value: true, label: "Available" },
                            { value: false, label: "Unavailable" },
                          ]}
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
                          options={[
                            { value: true, label: "Yes" },
                            { value: false, label: "No" },
                          ]}
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
              {...register("length", {
                valueAsNumber: true,
              })}
              type="hidden"
            />

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

type Props = {
  locations: Location[]
}

type Location = {
  id: string
  name: string
  latitude: number | null
  longitude: number | null
}

type BooleanSelectOption = {
  label: string
  value: boolean
}

export default NewRoutePageForm
