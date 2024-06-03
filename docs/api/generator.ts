import fs from "fs";
import path from "path";
import yaml from "yaml";
import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const importAllSchemas = async () => {
  fs.readdirSync(__dirname).forEach(async (filename) => {
    if (filename.endsWith(".ts") && filename != path.basename(__filename)) {
      await import(path.join(__dirname, filename));
    }
  });
};

(async () => {
  await importAllSchemas();

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const docs = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "0.1.0",
      title: "BCC Server API",
      description: "API for BCC Site and Dashboard",
    },
    servers: [
      {
        url: `${process.env.SERVICE_HOST ?? ""}/api/v1`,
      },
    ],
  });
  const fileContent = yaml.stringify(docs);

  fs.writeFileSync(`${__dirname}/openapi-docs.yml`, fileContent, {
    encoding: "utf-8",
  });
})();
