import { JwtUser } from "./auth.interface";

declare global {
  namespace Express {
    export interface Request {
      user?: JwtUser;
    }
  }
}
