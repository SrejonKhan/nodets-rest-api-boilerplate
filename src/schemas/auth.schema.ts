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

const changePasswordSchema = z
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
    description: "ChangePassword payload Schema",
  });

const redeemChangePasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  })
  .openapi({
    description: "ChangePassword token redeem payload Schema",
  });

const refreshAccessTokenSchema = z
  .object({
    grantType: z.enum(["refresh_token"]),
    refreshToken: z.string(),
  })
  .openapi({
    description: "Token Refresh payload Schema",
  });

const googleOAuth2SignInSchema = z
  .object({
    code: z.string(),
  })
  .openapi({
    description: "Google OAuth2 SignIn Schema.",
  });

export {
  signInSchema,
  signUpSchema,
  changePasswordSchema,
  redeemChangePasswordSchema,
  refreshAccessTokenSchema,
  googleOAuth2SignInSchema,
};
