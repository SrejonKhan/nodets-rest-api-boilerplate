import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";
import jwt from "jsonwebtoken";
import config from "../config/base.config";
import httpStatus from "http-status";
import { Role } from "@prisma/client";
import logger from "../utils/logger";

const getAccessToken = (authHeader: string) => {
  if (!authHeader) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Authorization header is missing!");
  }

  if (authHeader.split(" ").length < 1) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Bad Authorization header!");
  }
  const accessToken = authHeader.split(" ")[1];
  return accessToken;
};

const decodeUser = (accessToken: string, req: Request) => {
  const payload = jwt.verify(accessToken, config.RSA_PUBLIC_KEY, { algorithms: ["RS256"] });

  if (!payload) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Access Token. Please reauthenticate.");
  }

  const { id, email, username, displayName, role } = JSON.parse(JSON.stringify(payload)).jwtUser;
  const user = { id, email, username, displayName, role };
  req.user = user;

  return user;
};

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = getAccessToken(req.header("Authorization"));
    decodeUser(accessToken, req);
    next();
  } catch (ex) {
    next(ex);
  }
};

const hasRole = (roles: (Role | string)[], negRoles?: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let user = req.user;
      if (!user) {
        const accessToken = getAccessToken(req.header("Authorization"));
        user = decodeUser(accessToken, req);
      }

      let authorized = false;
      if (roles.length == 1 && roles[0] == "*") {
        authorized = true;
      } else {
        roles.forEach((role) => {
          if (user.role == role) authorized = true;
        });
      }

      negRoles?.forEach((negRole) => {
        if (user.role == negRole) authorized = false;
      });

      if (!authorized)
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized! Required Role is not present in the User!");

      next();
    } catch (ex) {
      next(ex);
    }
  };
};

export { requireAuth, hasRole };
