import type { ExpressContextFunctionArgument } from "@apollo/server-express4";
import jwt from "jsonwebtoken";

export interface GatewayContext {
  userId: string | null;
  req: ExpressContextFunctionArgument["req"];
  res: ExpressContextFunctionArgument["res"];
}

const SESSION_COOKIE_NAME = "cc_session";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "development-secret";

export function verifySession(token: string): string | null {
  try {
    const payload = jwt.verify(token, SESSION_SECRET) as jwt.JwtPayload;
    return payload.sub as string;
  } catch (error) {
    return null;
  }
}

export async function contextFactory({ req, res }: ExpressContextFunctionArgument): Promise<GatewayContext> {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  return {
    userId: token ? verifySession(token) : null,
    req,
    res
  };
}

export { SESSION_COOKIE_NAME };
