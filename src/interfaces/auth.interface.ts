import { User } from "@prisma/client";

export enum TokenType {
  refreshToken = "REFRESH_TOKEN",
  accessToken = "ACCESS_TOKEN",
}

// slimmest version of User type for JWT Payload
export interface JwtUser {
  id: User["id"];
  email: User["email"];
  username: User["username"];
  displayName: User["displayName"];
  role: User["role"];
}

export interface TokenPayload {
  type: TokenType;
  jwtUser: JwtUser;
}
