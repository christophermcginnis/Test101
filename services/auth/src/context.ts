import type { ExpressContextFunctionArgument } from "@apollo/server-express4";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export interface AuthContext {
  prisma: PrismaClient;
  userId: string | null;
  res: ExpressContextFunctionArgument["res"];
}

const prisma = new PrismaClient();

const SESSION_COOKIE_NAME = "cc_session";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "development-secret";

export function signSession(userId: string) {
  return jwt.sign({ sub: userId }, SESSION_SECRET, { expiresIn: "7d" });
}

export function verifySession(token: string): string | null {
  try {
    const payload = jwt.verify(token, SESSION_SECRET) as jwt.JwtPayload;
    return payload.sub as string;
  } catch (error) {
    return null;
  }
}

export const contextFactory = async ({ req, res }: ExpressContextFunctionArgument): Promise<AuthContext> => {
  const sessionCookie = req.cookies?.[SESSION_COOKIE_NAME];
  const userId = sessionCookie ? verifySession(sessionCookie) : null;

  return {
    prisma,
    userId,
    res
  };
};

export { SESSION_COOKIE_NAME };
