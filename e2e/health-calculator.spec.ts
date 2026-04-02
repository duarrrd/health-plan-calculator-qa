import { test, expect } from "@playwright/test";

test.describe("Health Plan Calculator — E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("happy path: fill form, calculate, verify results", async ({ page }) => {
    // Fill form
    await page.getByLabel("Weight").fill("70");
    await page.getByLabel("Height").fill("175");
    await page.getByLabel("Age").fill("30");
    await page.getByLabel("Activity level").selectOption("Medium");
    await page.getByLabel("Goal").selectOption("Maintain");

    // Calculate
    await page.getByRole("button", { name: /calculate plan/i }).click();

    // Verify results appear
    await expect(page.getByText("Results")).toBeVisible();
    await expect(page.getByText("Recommended daily calories")).toBeVisible();
    await expect(page.getByText("Normal")).toBeVisible();
    await expect(page.getByText("Tracking against 2085 kcal")).toBeVisible();

    // Verify Meal Simulator appears
    await expect(page.getByText("Meal Simulator")).toBeVisible();
  });

  test("recalculation updates both results and simulator", async ({ page }) => {
    // First calculation
    await page.getByLabel("Weight").fill("70");
    await page.getByLabel("Height").fill("175");
    await page.getByLabel("Age").fill("30");
    await page.getByLabel("Activity level").selectOption("Medium");
    await page.getByLabel("Goal").selectOption("Maintain");
    await page.getByRole("button", { name: /calculate plan/i }).click();

    await expect(page.getByText("Tracking against 2085 kcal")).toBeVisible();

    // Change weight and recalculate
    await page.getByLabel("Weight").fill("");
    await page.getByLabel("Weight").fill("100");
    await page.getByRole("button", { name: /calculate plan/i }).click();

    // Both results and simulator should update
    await expect(page.getByText("Tracking against 3075 kcal")).toBeVisible();
  });

  test("validation prevents empty form submission", async ({ page }) => {
    await page.getByRole("button", { name: /calculate plan/i }).click();

    // Should show validation errors, not NaN results
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByText("Weight must be a positive number")).toBeVisible();
  });

  test("works on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.getByLabel("Weight").fill("70");
    await page.getByLabel("Height").fill("175");
    await page.getByLabel("Age").fill("30");
    await page.getByRole("button", { name: /calculate plan/i }).click();

    await expect(page.getByText("Tracking against 2085 kcal")).toBeVisible();
    await expect(page.getByText("Meal Simulator")).toBeVisible();

    // Verify no horizontal overflow
    const body = page.locator("body");
    const bodyWidth = await body.evaluate((el) => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });
});
