import { z } from "zod";
import {
  refreshAccessTokenSchema,
  signInSchema,
  signUpSchema,
  changePasswordSchema,
  redeemChangePasswordSchema,
  googleOAuth2SignInSchema,
} from "../../src/schemas/auth.schema";
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

registry.registerPath({
  method: "post",
  path: "/auth/change-password",
  summary: "Request a change password.",
  description: `A change password email will be sent to the registered email address of user, proper security added to prevent spamming.`,
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
      description: "Object with a message and masked email address.",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/redeem-change-password",
  summary: "Redeem change password token.",
  description: `User password will be updated to the provided password if token is valid and never redeemed before.`,
  security: [],
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": { schema: redeemChangePasswordSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Object with a message.",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/google-signin",
  summary: "Google OAuth2 SignIn.",
  description: `Sign in with Google OAuth2 Code.`,
  security: [],
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": { schema: googleOAuth2SignInSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Object with the user profile.",
    },
  },
});
