import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/error";
import config from "../config/base.config";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { excludeFromObject } from "../utils/object";
import { maskEmailAddress } from "../utils/string";
import httpStatus from "http-status";
import { sendToExchange } from "../lib/amqp";
import { randomBytes } from "crypto";

const enum TokenType {
  refreshToken = "REFRESH_TOKEN",
  accessToken = "ACCESS_TOKEN",
}

const handleUserSignIn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new ApiError(401, "User not found!");
  }

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid Password!");
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
    throw new ApiError(400, "User with same email already exist!");
  }

  const userWithUsername = await prisma.user.findUnique({
    where: { username: username },
  });

  if (userWithUsername) {
    throw new ApiError(400, "User with same username already exist!");
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

const handleChangePassword = async (email: string, username: string, ipAddress: string) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: email }, { username: username }] },
  });

  if (!user) {
    throw new ApiError(400, "User doesn't exist with the provided email/username!");
  }

  // make sure that no one is spamming or requesting too many change pass req.
  const tokens = await prisma.changePasswordRequest.findMany({
    where: {
      AND: [{ userId: user.id }],
    },
  });

  const currentTime = new Date().getTime();
  const FIFTEEN_MINS = 15 * 60 * 1000; /* ms */
  for (const token of tokens) {
    if (currentTime - token.requestedAt.getTime() < FIFTEEN_MINS) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "A change password is requested just a while ago and never redeemed. Wait for a moment before requesting again."
      );
    }
  }

  // create token
  const changePassToken = randomBytes(32).toString("hex");

  await prisma.changePasswordRequest.create({
    data: {
      reqIpAddress: ipAddress,
      token: changePassToken,
      userId: user.id,
    },
  });

  // send to exchange
  const exchangeContent = {
    email: user.email,
    changePassJwtToken: changePassToken,
    reqTime: Date.now(),
    reqIpAddress: ipAddress,
  };

  sendToExchange("exchange.mail", "change_pass", exchangeContent);

  return { maskedEmail: maskEmailAddress(user.email) };
};

const handleRedeemChangePassword = async (token: string, password: string, ipAddress: string) => {
  const changePassReq = await prisma.changePasswordRequest.findUnique({
    where: { token: token },
    include: {
      user: true,
    },
  });

  if (!changePassReq) {
    throw new ApiError(400, "No Change Password Request exist with the following token!");
  }

  const passwordHash = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

  // update
  await prisma.user.update({
    where: {
      email: changePassReq.user.email,
    },
    data: {
      passwordHash: passwordHash,
    },
  });

  await prisma.changePasswordRequest.delete({
    where: {
      token: token,
    },
  });

  const exchangeContent = {
    email: changePassReq.user.email,
    redeemTime: Date.now(),
    redeemIpAddress: ipAddress,
  };

  // send a confirmation mail to the user
  sendToExchange("exchange.mail", "change_pass_confirmation", exchangeContent);

  return { maskedEmail: maskEmailAddress(changePassReq.user.email) };
};

const exchangeAccessToken = async (grantType: string, refreshToken: string): Promise<string> => {
  const payload = jwt.verify(refreshToken, config.RSA_PUBLIC_KEY, { algorithms: ["RS256"] });
  const { type, jwtUser }: TokenPayload = JSON.parse(JSON.stringify(payload));

  if (type == TokenType.accessToken)
    throw new ApiError(httpStatus.BAD_REQUEST, "Expected Refresh Token but received Access Token");

  const user = await prisma.user.findUnique({
    where: { email: jwtUser.email },
  });

  if (!user) {
    throw new ApiError(
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
  handleChangePassword,
  handleRedeemChangePassword,
  exchangeAccessToken,
};
