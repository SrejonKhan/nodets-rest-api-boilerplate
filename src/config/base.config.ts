import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const config = {
  // GENERAL
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  // ASSYMMETRIC AUTH
  RSA_PRIVATE_KEY: Buffer.from(process.env.RSA_PRIVATE_KEY, "utf-8").toString(),
  RSA_PUBLIC_KEY: Buffer.from(process.env.RSA_PUBLIC_KEY, "utf-8").toString(),
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS),

  // AMQP
  AMQP_URI: process.env.AMQP_URI,

  // GOOGLE
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // AWS S3
  AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
};

export default config;
