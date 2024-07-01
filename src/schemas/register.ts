import { z } from "zod"

export const registerFormSchema = z
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
