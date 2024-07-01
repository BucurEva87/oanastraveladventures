"use client"

import { notify } from "@/components/Notification"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { registerFormSchema } from "@/schemas/register"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const RegisterForm = () => {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {},
  })
  const { control, handleSubmit, getValues } = form
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
    })
    const data = await response.json()

    if (data.error)
      notify({
        type: "error",
        title: "Oups! There was an error",
        description: data.error,
      })

    notify({
      type: "success",
      title: "Yahoo! You did it!",
      description: "Account created! We are loggin you in...",
    })

    const loginResponse = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    if (!loginResponse?.error) {
      notify({
        type: "success",
        title: "Yahoo! You did it!",
        description: "You are now signed in!",
      })
      router.push("/")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <h1 className="text-2xl font-semibold">Registration</h1>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Julia Roberts"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {getValues("name")
                  ? `Nice to meet you, ${getValues("name")}!`
                  : "Please provide us your name"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="janedoe@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please provide your email address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>And choose a strong password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Type your password again for confirmation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link
          className="block"
          href={`/api/auth/signin`}
        >
          Already have an account or do you want to login with Google or
          Facebook?
        </Link>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default RegisterForm
