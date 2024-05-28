import express from "express";
import cors from "cors";
import helmet from "helmet";
import httpStatus from "http-status";
import config from "./config/base";
import logger from "./utils/logger";
import morgan from "morgan";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);
import authRouter from "./routers/v1/auth.router";
import { globalErrorHandler, notFoundHandler } from "./middlewares/error.middleware";
import docsRouter from "./routers/v1/docs.router";
import { writeOpenApiDocumentation } from "./schemas/docs/generator";

const server = express();
writeOpenApiDocumentation();

/*-------------------MIDDLEWARES-------------------*/
server.use(helmet());
server.use(cors({ origin: "*" }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
if (config.ENV === "development") {
  server.use(morgan("combined", { stream: logger.stream }));
}

/*-------------------ROUTERS-------------------*/
server.use("/api/v1/auth", authRouter);
server.use("/docs", docsRouter);
server.get("/", (req, res) => {
  return res.status(httpStatus.OK).send({ message: "BCC Server is running successfully!" });
});

/*-------------------ERROR HANDLING-------------------*/
server.use(notFoundHandler);
server.use(globalErrorHandler);

export { server };
