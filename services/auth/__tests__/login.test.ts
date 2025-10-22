import { handleLogin } from "../src/graphql/authResolvers";
import type { AuthContext } from "../src/context";

const makeContext = (): AuthContext =>
  ({
    prisma: {
      user: {
        findUnique: jest.fn()
      }
    }
  } as unknown as AuthContext);

jest.mock("../src/security", () => ({
  verifyPassword: jest.fn()
}));

const { verifyPassword } = jest.requireMock("../src/security");

describe("handleLogin", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("throws when user is not found", async () => {
    const ctx = makeContext();
    (ctx.prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(handleLogin({ email: "missing@example.com", password: "password" }, ctx)).rejects.toThrow(
      /invalid credentials/i
    );
  });

  it("throws when password is invalid", async () => {
    const ctx = makeContext();
    (ctx.prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      password: "hashed"
    });
    (verifyPassword as jest.Mock).mockResolvedValue(false);

    await expect(handleLogin({ email: "user@example.com", password: "bad" }, ctx)).rejects.toThrow(/invalid credentials/i);
  });
});
