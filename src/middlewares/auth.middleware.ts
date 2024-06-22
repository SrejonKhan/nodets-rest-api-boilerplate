import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";
import jwt from "jsonwebtoken";
import config from "../config/base.config";
import httpStatus from "http-status";

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Authorization header is missing!");
    }

    if (authHeader.split(" ").length < 1) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Bad Authorization header!");
    }

    const accessToken = authHeader.split(" ")[1];
    const payload = jwt.verify(accessToken, config.RSA_PUBLIC_KEY, { algorithms: ["RS256"] });

    if (!payload) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Access Token. Please reauthenticate.");
    }

    const { id, email, username, displayName, role } = JSON.parse(JSON.stringify(payload));
    const user = { id, email, username, displayName, role };
    req.user = user;

    next();
  } catch (ex) {
    next(ex);
  }
};

export { isAuthenticated };
