import express from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";

// reading docs yml file
const file = fs.readFileSync(__dirname + "../../../schemas/docs/openapi-docs.yml", "utf8");
const swaggerDocument = yaml.parse(file);

// setup express router
const docsRouter = express.Router();
docsRouter.use("/", swaggerUi.serve);
docsRouter.get("/", swaggerUi.setup(swaggerDocument));

export default docsRouter;
