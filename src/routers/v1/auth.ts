import express from "express";
import { handleSignIn } from "../../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/signin", handleSignIn);

export default authRouter;
