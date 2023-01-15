import { hash, compare } from "bcrypt";

export async function hashPassword(plaintextPassword: string) {
  const hashed = await hash(plaintextPassword, parseInt(process.env.SALT));
  return hashed;
}

export async function comparePassword(plaintextPassword: string, hash: string) {
  const result = await compare(plaintextPassword, hash);
  return result;
}
