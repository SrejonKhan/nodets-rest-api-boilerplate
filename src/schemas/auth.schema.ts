import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().refine((val) => val.trim().length > 0, {
    message: "Email is required",
  }),
  password: z.string().refine((val) => val.trim().length >= 6, {
    message: "Password must be at least 6 characters",
  }),
});
