import express from "express";
import {
  changePassword,
  googleOAuth2SignIn,
  redeemChangePassword,
  refreshAccessToken,
  signIn,
  signUp,
  whoami,
} from "../../controllers/auth.controller";
import { hasRole, requireAuth } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const authRouter = express.Router();

authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
authRouter.get("/whoami", hasRole(["*"]), whoami);
authRouter.post("/change-password", changePassword);
authRouter.post("/redeem-change-password", redeemChangePassword);
authRouter.post("/refresh", refreshAccessToken);
authRouter.post("/google-signin", googleOAuth2SignIn);

export default authRouter;
