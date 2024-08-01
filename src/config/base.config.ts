import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  RSA_PRIVATE_KEY: Buffer.from(process.env.RSA_PRIVATE_KEY, "utf-8").toString(),
  RSA_PUBLIC_KEY: Buffer.from(process.env.RSA_PUBLIC_KEY, "utf-8").toString(),
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS),
  AMQP_URI: process.env.AMQP_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

export default config;
