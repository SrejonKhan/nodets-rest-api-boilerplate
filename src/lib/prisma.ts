import { PrismaClient } from "@prisma/client";
import config from "../config/base";

let prisma: PrismaClient;

if (config.ENV === "PRODUCTION") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export default prisma;
