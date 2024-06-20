import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ApiError, createApiError } from "../utils/error";
import config from "../config/base.config";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import logger from "../utils/logger";

const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof PrismaClientValidationError) {
    error = createApiError(
      httpStatus.BAD_REQUEST,
      error.message.split("\n").pop()?.toString().split(".")[0] as string // committed war crime, don't blame!
    );
  }

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        // handling duplicate key errors
        error = createApiError(httpStatus.BAD_REQUEST, `Duplicate field value: ${error.meta?.target}`);
        break;
      case "P2014":
        // handling invalid id errors
        error = createApiError(httpStatus.BAD_REQUEST, `Invalid ID: ${error.meta?.target}`);
        break;
      case "P2003":
        // handling invalid data errors
        error = createApiError(httpStatus.BAD_REQUEST, `Invalid input data: ${error.meta?.target}`);
        break;
      case "P2025":
        // handling entity not found errors
        error = createApiError(httpStatus.NOT_FOUND, `Specified entity is not found!`);
        break;
      case "P2023":
        // handling inconsistent column data
        error = createApiError(httpStatus.BAD_REQUEST, `Inconsistent column data: ${error.meta?.message}!`);
        break;
      default:
        // handling all other errors
        error = createApiError(httpStatus.INTERNAL_SERVER_ERROR, `Something went wrong: ${error.message}`);
    }
  }

  if (error instanceof ZodError) {
    error = createApiError(
      httpStatus.BAD_REQUEST,
      "Validation Error!",
      true,
      fromZodError(error, {
        prefix: null,
        includePath: true,
      }).toString()
    );
  }

  if (!(error instanceof ApiError)) error = createApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message, false);

  const message = error.isPublic ? error.message : "We are sorry, but we have encountered an issue!";

  logger.http(`HTTP ${error.status} - ${message}`);

  return res.status(error.status).json({
    status: "error",
    message: message,
    stack: config.ENV == "development" ? error.stack : undefined,
    validationError: error.validationError.length ? error.validationError : undefined,
  });
};

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(createApiError(httpStatus.NOT_FOUND, "Endpoint not found!"));
};

export { globalErrorHandler, notFoundHandler };
