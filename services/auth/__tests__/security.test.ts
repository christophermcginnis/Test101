import { hashPassword, verifyPassword } from "../src/security";

describe("password security", () => {
  it("hashes and verifies passwords", async () => {
    const plain = "super-secret";
    const hashed = await hashPassword(plain);
    expect(hashed).not.toEqual(plain);
    await expect(verifyPassword(hashed, plain)).resolves.toBe(true);
  });

  it("rejects invalid passwords", async () => {
    const plain = "super-secret";
    const hashed = await hashPassword(plain);
    await expect(verifyPassword(hashed, "wrong")).resolves.toBe(false);
  });
});
