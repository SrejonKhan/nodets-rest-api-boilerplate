import httpStatus from "http-status";
import { signInSchema, signUpSchema } from "../schemas/auth.schema";
import { handleUserSignIn, handleUserSignUp } from "../services/auth.service";
import logger from "../utils/logger";
import { NextFunction, Request, Response } from "express";

const handleSignIn = async (req, res, next) => {
  try {
    const payload = signInSchema.parse(req.body);
    const { email, password } = payload;
    const body = await handleUserSignIn(email, password);
    logger.info(`UserID ${body.user.id} signed in.`);
    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = signUpSchema.parse(req.body);
    const { email, password, username, displayName } = payload;
    const body = await handleUserSignUp(email, password, username, displayName);
    logger.info(`New user created. UserID: ${body.user.id}.`);
    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};
export { handleSignIn, signUp };
