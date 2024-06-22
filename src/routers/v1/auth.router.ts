import express from "express";
import { changePassword, refreshAccessToken, signIn, signUp, whoami } from "../../controllers/auth.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
authRouter.get("/whoami", isAuthenticated, whoami);
authRouter.post("/change-password", changePassword);
authRouter.post("/refresh", refreshAccessToken);

export default authRouter;
