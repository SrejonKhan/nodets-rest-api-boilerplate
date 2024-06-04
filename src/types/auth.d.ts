interface JwtUser {
  id: User["id"];
  email: User["email"];
  username: User["username"];
  displayName: User["displayName"];
  role: User["role"];
}

enum TokenType {
  refreshToken = "REFRESH_TOKEN",
  accessToken = "ACCESS_TOKEN",
}

interface Token {
  type: TokenType;
  user: JwtUser;
}
