import express from "express";
import { handleSignIn } from "../../controllers/auth.controller";

const authRouter = express.Router();

authRouter.get("/signin", handleSignIn);

export default authRouter;
