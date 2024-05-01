import config from "./config/base";
import { server } from "./server";

const startServer = async () => {
  try {
    server.listen(config.PORT, async () => {
      console.info(`Server is running on port ${config.PORT}`);
    });
  } catch (err) {
    console.error("Server issue! Immediately check!");
  }
};

startServer();
