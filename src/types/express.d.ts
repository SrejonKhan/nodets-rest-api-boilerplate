import { User } from "@prisma/client";

interface JwtUser {
  id: User["id"];
  email: User["email"];
  username: User["username"];
  displayName: User["displayName"];
  role: User["role"];
}

declare global {
  namespace Express {
    export interface Request {
      user?: JwtUser;
    }
  }
}
