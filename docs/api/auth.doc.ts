import { z } from "zod";
import { forgetPasswordSchema, signInSchema, signUpSchema } from "../../src/schemas/auth.schema";
import { bearerAuth, registry } from "./generator";

registry.registerPath({
  method: "post",
  path: "/auth/signin",
  summary: "Email-Pass SignIn",
  description: "Email-Pass SignIn, successfull respond with user data and token data.",
  security: [],
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": { schema: signInSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Object with user data and token data.",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/signup",
  summary: "Email-Pass SignUp",
  description: "Email-Pass SignUp, successfull respond with user data and token data to authenticate on the go.",
  security: [],
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": { schema: signUpSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Object with user data and token data.",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/whoami",
  summary: "Identify currently signed in user",
  description: "Identify using token from header.",
  security: [{ [bearerAuth.name]: [] }],
  tags: ["Authentication"],
  request: {},
  responses: {
    200: {
      description: "Object with user data and token data.",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/forget-password",
  summary: "Forget Password",
  description: "Forget Password endpoint, successfull respond with masked user email.",
  security: [],
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email(),
            username: z.string().min(3),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Object with masked email.",
    },
  },
});
