import express from "express";
import cors from "cors";
import helmet from "helmet";
import httpStatus from "http-status";
import config from "./config/base";
import logger from "./utils/logger";
import morgan from "morgan";
import authRouter from "./routers/v1/auth";

const server = express();

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
server.get("/", (req, res) => {
  return res.status(httpStatus.OK).send({ message: "BCC Server is running successfully!" });
});

export { server };
