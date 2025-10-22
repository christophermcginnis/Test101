import type { AuthContext } from "../context";
import { hashPassword, verifyPassword } from "../security";

export async function handleRegister(
  input: { email: string; password: string; name: string },
  ctx: AuthContext
) {
  const email = input.email.toLowerCase();
  const existing = await ctx.prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email is already registered");
  }

  const hashedPassword = await hashPassword(input.password);
  return ctx.prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: input.name
    }
  });
}

export async function handleLogin(input: { email: string; password: string }, ctx: AuthContext) {
  const email = input.email.toLowerCase();
  const user = await ctx.prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await verifyPassword(user.password, input.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
}
