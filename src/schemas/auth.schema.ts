import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

const signUpSchema = z
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

const forgetPasswordSchema = z
  .object({
    email: z.string().email().optional(),
    username: z.string().min(3).optional(),
  })
  .and(
    z.union(
      [
        z.object({ email: z.undefined(), username: z.string().min(3) }),
        z.object({ email: z.string().email(), username: z.undefined() }),
        z.object({ email: z.string().email(), username: z.string().min(3) }),
      ],
      {
        errorMap: (issue, ctx) => ({
          message: "Either email or username must be filled in.",
        }),
      }
    )
  )
  .openapi({
    description: "ForgetPassword payload Schema",
  });

const refreshAccessTokenSchema = z
  .object({
    grantType: z.enum(["refresh_token"]),
    refreshToken: z.string(),
  })
  .openapi({
    description: "Token Refresh payload Schema",
  });

export { signInSchema, signUpSchema, forgetPasswordSchema, refreshAccessTokenSchema };
