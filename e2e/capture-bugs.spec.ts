/**
 * Bug evidence capture script.
 *
 * Run against the MAIN branch (buggy code) to generate screenshots:
 *   git checkout main && npx playwright test e2e/capture-bugs.spec.ts
 *
 * Screenshots are saved to docs/screenshots/ and referenced in docs/bug-report.md.
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const screenshotDir = path.join(__dirname, "..", "docs", "screenshots");

test.describe("Bug evidence screenshots", () => {
  test.beforeAll(() => {
    fs.mkdirSync(screenshotDir, { recursive: true });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("BUG-005: empty form produces NaN results", async ({ page }) => {
    await page.getByRole("button", { name: /calculate plan/i }).click();
    await page.waitForTimeout(1000);

    await page.locator(".app-shell").screenshot({
      path: path.join(screenshotDir, "bug-005-nan-results.png"),
    });
  });

  test("BUG-002: stale simulator after recalculation", async ({ page }) => {
    await page.getByLabel("Weight").fill("70");
    await page.getByLabel("Height").fill("175");
    await page.getByLabel("Age").fill("30");
    await page.getByRole("button", { name: /calculate plan/i }).click();
    await expect(page.getByText("Tracking against 2310 kcal")).toBeVisible();

    await page.getByLabel("Weight").fill("");
    await page.getByLabel("Weight").fill("100");
    await page.getByRole("button", { name: /calculate plan/i }).click();
    await expect(page.getByText("3300 kcal")).toBeVisible();

    await page.locator(".app-shell").screenshot({
      path: path.join(screenshotDir, "bug-002-stale-simulator.png"),
    });
  });

  test("BUG-001: BMI misclassification", async ({ page }) => {
    await page.getByLabel("Weight").fill("56");
    await page.getByLabel("Height").fill("175");
    await page.getByLabel("Age").fill("30");
    await page.getByRole("button", { name: /calculate plan/i }).click();
    await expect(page.getByText("Normal")).toBeVisible();

    await page.locator(".app-shell").screenshot({
      path: path.join(screenshotDir, "bug-001-bmi-misclassification.png"),
    });
  });

  test("BUG-004: negative calories", async ({ page }) => {
    await page.getByLabel("Weight").fill("10");
    await page.getByLabel("Height").fill("100");
    await page.getByLabel("Age").fill("5");
    await page.getByLabel("Activity level").selectOption("Low");
    await page.getByLabel("Goal").selectOption("Lose weight");
    await page.getByRole("button", { name: /calculate plan/i }).click();
    await page.waitForTimeout(1000);

    await page.locator(".app-shell").screenshot({
      path: path.join(screenshotDir, "bug-004-negative-calories.png"),
    });
  });
});
