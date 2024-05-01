import { server } from "./server";

const startServer = async () => {
  try {
    server.listen(5000, async () => {
      console.info(`Server is running on port ${5000}`);
    });
  } catch (err) {
    console.error("Server issue! Immediately check!");
  }
};

startServer();
