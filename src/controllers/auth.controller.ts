import httpStatus from "http-status";
import { signInSchema } from "../schemas/auth.schema";
import { handleUserSignIn } from "../services/auth.service";
import logger from "../utils/logger";

const handleSignIn = async (req, res, next) => {
  try {
    const payload = signInSchema.parse(req.body);
    const { email, password } = payload;
    const user = await handleUserSignIn(email, password);
    logger.info(`UserID ${user.id} signed in.`);
    res.status(httpStatus.OK).send(user);
  } catch (ex) {
    next(ex);
  }
};

export { handleSignIn };
