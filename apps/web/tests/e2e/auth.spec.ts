import { test, expect } from "@playwright/test";

test.describe("Authentication happy path", () => {
  test("user can sign up and reach dashboard", async ({ page }) => {
    await page.goto("/auth/signup");

    await page.getByLabel("Name").fill("Playwright Tester");
    await page.getByLabel("Email").fill("new-user@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create account" }).click();

    await page.waitForURL("**/dashboard");
    await expect(page.locator("h1")).toHaveText(/Your Community Feed/);
  });

  test("existing user is redirected to dashboard after logging in", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel("Email").fill("existing-user@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();

    await page.waitForURL("**/dashboard");
    await expect(page.locator("h1")).toHaveText(/Your Community Feed/);
  });

  test("unauthenticated visitors are redirected", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/auth/login");
  });
});
