import config from "./config/base";
import { server } from "./server";
import logger from "./utils/logger";

const startServer = async () => {
  try {
    server.listen(config.PORT, async () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });
  } catch (err) {
    logger.error("Server issue! Immediately check!");
  }
};

startServer();
