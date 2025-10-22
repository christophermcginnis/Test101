import { hash, verify } from "argon2";

export async function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  return verify(hashedPassword, password);
}
