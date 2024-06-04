import express from "express";
import { signIn, signUp, whoami } from "../../controllers/auth.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
authRouter.get("/whoami", isAuthenticated, whoami);

export default authRouter;
