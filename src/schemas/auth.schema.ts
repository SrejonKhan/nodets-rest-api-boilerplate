import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const signUpSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    username: z.string().min(3, { message: "Username must be 3 or more characters long." }),
    displayName: z.string().min(3, { message: "Display Name must be 3 or more characters long." }).optional(),
  })
  .openapi({
    description: "Email-Pass Signup payload Schema",
  });
