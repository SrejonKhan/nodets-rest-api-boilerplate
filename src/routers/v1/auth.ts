import express from "express";
import { handleSignIn } from "../../controllers/authController";

const authRouter = express.Router();

authRouter.get("/signin", handleSignIn);

export default authRouter;
