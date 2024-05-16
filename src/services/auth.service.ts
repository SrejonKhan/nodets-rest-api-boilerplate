import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { createApiError } from "../utils/error";

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

  return user;
};

export { handleUserSignIn };
