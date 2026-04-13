import * as z from "zod";



export const SignUpValidation = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters."),
  email: z
    .string()
    .email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password must be at most 50 characters."),
})

export const SignInValidation = z.object({
  email: z
    .string()
    .email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password must be at most 50 characters."),
})


export const checkPasswordValidation = z.object({
  email: z
  .string()
  .email("Invalid email address.")
})

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),

});