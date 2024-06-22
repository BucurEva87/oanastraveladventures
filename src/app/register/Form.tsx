"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

const RegisterForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
    })
    const data = await response.json()

    if (data.error) toast.error(data.error)

    toast.success("Account created! We are loggin you in...")

    const loginResponse = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    if (!loginResponse?.error) {
      toast.success("You are now signed in!")
      router.push("/")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <h1 className="text-2xl font-semibold">Registration</h1>
        <FormField
          control={form.control}
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
                {form.getValues("name")
                  ? `Nice to meet you, ${form.getValues("name")}!`
                  : "Please provide us your name"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          href={`/login`}
        >
          Already have an account?
        </Link>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

const formSchema = z
  .object({
    email: z
      .string()
      .min(3, {
        message: "This field has to be filled",
      })
      .max(100, {
        message: "Emails may not be larger than 100 characters",
      })
      .email("This is not a valid email"),
    password: z.string().min(6, {
      message: "Passwords has to be at least 6 characters long",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm-Password has to be at least 6 characters long",
    }),
    name: z
      .string()
      .min(2, {
        message: "Your name must be at least 2 characters long",
      })
      .max(100, {
        message: "Your name can not consist of more than 100 characters",
      }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password and Confirm-Password fields should match",
        path: ["confirmPassword"],
      })
    }
  })

export default RegisterForm
