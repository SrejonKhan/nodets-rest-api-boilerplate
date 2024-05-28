import { signInSchema, signUpSchema } from "../auth.schema";
import { registry } from "./generator";

registry.registerPath({
  method: "post",
  path: "/auth/signin",
  summary: "Email-Pass SignIn",
  description: "Email-Pass SignIn, successfull respond with user data and token data.",
  security: [],
  tags: ["Authentication"],
  consumes: ["application/json"],
  produces: ["application/json"],
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
  consumes: ["application/json"],
  produces: ["application/json"],
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
