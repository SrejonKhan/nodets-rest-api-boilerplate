import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { createApiError } from "../utils/error";
import config from "../config/base";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { excludeFromObject } from "../utils/object";

const handleUserSignIn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw createApiError(401, "User not found!");
  }

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    throw createApiError(401, "Invalid Password!");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: excludeFromObject(user, ["passwordHash"]),
    token: {
      accessToken,
      refreshToken,
    },
  };
};

const handleUserSignUp = async (email: string, password: string, username: string, displayName: string) => {
  const userWithEmail = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userWithEmail) {
    throw createApiError(400, "User with same email already exist!");
  }

  const userWithUsername = await prisma.user.findUnique({
    where: { username: username },
  });

  if (userWithUsername) {
    throw createApiError(400, "User with same username already exist!");
  }

  const passwordHash = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: email,
      username: username,
      displayName: displayName,
      passwordHash: passwordHash,
    },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: excludeFromObject(user, ["passwordHash"]),
    token: {
      accessToken,
      refreshToken,
    },
  };
};

const generateAccessToken = (user: User) => {
  const payload = excludeFromObject(user, ["passwordHash"]);
  return jwt.sign(payload, config.RSA_PRIVATE_KEY, { algorithm: "RS256", expiresIn: 60 * 60 });
};

const generateRefreshToken = (user: User) => {
  const payload = {
    email: user.email,
    username: user.username,
  };
  return jwt.sign(payload, config.RSA_PRIVATE_KEY, { algorithm: "RS256", expiresIn: 60 * 60 });
};

const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email: email },
  });
};

const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username: username },
  });
};

export { handleUserSignIn, handleUserSignUp, findUserByEmail, findUserByUsername };
