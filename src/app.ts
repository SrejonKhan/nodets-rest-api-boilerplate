import config from "./config/base.config";
import { server } from "./server";
import logger from "./utils/logger";
import * as amqp from "./lib/amqp";
import amqpConfig from "./config/amqp.config";

const startServer = async () => {
  try {
    await amqp.init(amqpConfig.EXCHANGES, amqpConfig.QUEUES, amqpConfig.BINDINGS);
    logger.info(`Initialized RabbitMQ.`);

    server.listen(config.PORT, async () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });
  } catch (err) {
    logger.error("Server issue! Immediately check!");
  }
};

startServer();
