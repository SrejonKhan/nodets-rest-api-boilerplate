import express from "express";
import { handleSignIn, signUp } from "../../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/signin", handleSignIn);
authRouter.post("/signup", signUp);

export default authRouter;
