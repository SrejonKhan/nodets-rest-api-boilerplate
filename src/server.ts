import express from "express";
import cors from "cors";
import helmet from "helmet";
import httpStatus from "http-status";

const server = express();

/*-------------------MIDDLEWARES-------------------*/
server.use(helmet());
server.use(cors({ origin: "*" }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

/*-------------------ROUTERS-------------------*/
server.get("/", (req, res) => {
  return res.status(httpStatus.OK).send({ message: "BCC Server is running successfully!" });
});

export { server };
