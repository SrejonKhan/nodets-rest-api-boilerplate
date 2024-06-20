import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { createApiError } from "../utils/error";
import config from "../config/base.config";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { excludeFromObject } from "../utils/object";
import { maskEmailAddress } from "../utils/string";
import httpStatus from "http-status";

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
  const payload: TokenPayload = {
    type: TokenType.refreshToken,
    jwtUser: excludeFromObject(user, ["passwordHash"]),
  };
  return jwt.sign(payload, config.RSA_PRIVATE_KEY, { algorithm: "RS256", expiresIn: 60 * 60 });
};

const generateRefreshToken = (user: User) => {
  const payload: TokenPayload = {
    type: TokenType.refreshToken,
    jwtUser: excludeFromObject(user, ["passwordHash"]),
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

const handleForgetPassword = async (email: string, username: string) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: email }, { username: username }] },
  });

  if (!user) {
    throw createApiError(400, "User doesn't exist with the provided email/username!");
  }

  // send a mail to
  user.email;

  return { maskedEmail: maskEmailAddress(user.email) };
};

const exchangeAccessToken = async (grantType: string, refreshToken: string): Promise<string> => {
  const payload = jwt.verify(refreshToken, config.RSA_PUBLIC_KEY, { algorithms: ["RS256"] });
  const { type, jwtUser }: TokenPayload = JSON.parse(JSON.stringify(payload));

  if (type == TokenType.accessToken)
    throw createApiError(httpStatus.BAD_REQUEST, "Expected Refresh Token but received Access Token");

  const user = await prisma.user.findUnique({
    where: { email: jwtUser.email },
  });

  if (!user) {
    throw createApiError(
      httpStatus.UNAUTHORIZED,
      "User's critical info is updated since the refresh token is issued. Please re-authenticate."
    );
  }

  const accessToken = generateAccessToken(user);
  return accessToken;
};

export {
  handleUserSignIn,
  handleUserSignUp,
  findUserByEmail,
  findUserByUsername,
  handleForgetPassword,
  exchangeAccessToken,
};
