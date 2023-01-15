import { User } from "../entity/user";
import { Algorithm, sign, verify } from "jsonwebtoken";

export function createVerifyToken(user: User) {
  const token = sign({ id: user.id }, process.env.JWT_VERIFY_PRIVATE_KEY, {
    algorithm: process.env.JWT_ALGORITHM as Algorithm,
  });
  return token;
}

export function createAuthToken(user: User) {
  const token = sign({ id: user.id }, process.env.JWT_AUTH_PRIVATE_KEY, {
    algorithm: process.env.JWT_ALGORITHM as Algorithm,
    expiresIn: "1d",
  });
  return token;
}

export function decodeVerifyToken(token: string) {
  const decoded = verify(token, process.env.JWT_VERIFY_PRIVATE_KEY) as {
    id: number;
  };
  return decoded.id;
}

export function decodeAuthToken(token: string) {
  const decoded = verify(token, process.env.JWT_AUTH_PRIVATE_KEY) as {
    id: number;
  };
  return decoded.id;
}
