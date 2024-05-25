import "dotenv/config";

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  RSA_PRIVATE_KEY: Buffer.from(process.env.RSA_PRIVATE_KEY, "utf-8").toString(),
  RSA_PUBLIC_KEY: Buffer.from(process.env.RSA_PUBLIC_KEY, "utf-8").toString(),
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS),
};

export default config;
