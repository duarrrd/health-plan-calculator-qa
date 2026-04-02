import { test, expect } from "@playwright/test";

test.describe("Visual regression", () => {
  test("initial form renders correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".app-shell")).toHaveScreenshot("form-initial.png", {
      maxDiffPixelRatio: 0.01,
    });
  });

  test("results view renders correctly", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Weight").fill("70");
    await page.getByLabel("Height").fill("175");
    await page.getByLabel("Age").fill("30");
    await page.getByRole("button", { name: /calculate plan/i }).click();

    await expect(page.getByText("Tracking against 2085 kcal")).toBeVisible();

    await expect(page.locator(".app-shell")).toHaveScreenshot("results-view.png", {
      maxDiffPixelRatio: 0.01,
    });
  });

  test("mobile layout renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await page.getByLabel("Weight").fill("70");
    await page.getByLabel("Height").fill("175");
    await page.getByLabel("Age").fill("30");
    await page.getByRole("button", { name: /calculate plan/i }).click();

    await expect(page.getByText("Tracking against 2085 kcal")).toBeVisible();

    await expect(page.locator(".app-shell")).toHaveScreenshot("mobile-results.png", {
      maxDiffPixelRatio: 0.01,
    });
  });

  test("validation error state renders correctly", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /calculate plan/i }).click();

    await expect(page.getByRole("alert")).toBeVisible();

    await expect(page.locator(".app-shell")).toHaveScreenshot("validation-errors.png", {
      maxDiffPixelRatio: 0.01,
    });
  });
});
