import express from "express";
import { forgetPassword, signIn, signUp, whoami } from "../../controllers/auth.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
authRouter.get("/whoami", isAuthenticated, whoami);
authRouter.post("/forget-password", forgetPassword);

export default authRouter;
