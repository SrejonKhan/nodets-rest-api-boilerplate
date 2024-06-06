import { z } from "zod";
import { forgetPasswordSchema, refreshAccessTokenSchema, signInSchema, signUpSchema } from "../../src/schemas/auth.schema";
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

registry.registerPath({
  method: "post",
  path: "/auth/refresh",
  summary: "Get a new Access Token exchanging a valid Refresh Token.",
  description: `A valid Refresh Token must be provided. 
    If user's critical info is changed after the provided Refresh Token is issued,
    the Refresh Token will be taken as invalidated, so Reauthentication is required.`,
  security: [],
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": { schema: refreshAccessTokenSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Object with a message and new access token.",
    },
  },
});
