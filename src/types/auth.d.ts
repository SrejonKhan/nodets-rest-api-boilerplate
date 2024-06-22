// slimmest version of User type for JWT Payload
interface JwtUser {
  id: User["id"];
  email: User["email"];
  username: User["username"];
  displayName: User["displayName"];
  role: User["role"];
}

interface TokenPayload {
  type: TokenType;
  jwtUser: JwtUser;
}
