import { calculateBmi, calculateCalories, calculateStatus } from "./calculator";

describe("Bug exposure: calculator logic", () => {
  // BUG-001: BMI thresholds deviate from WHO standards
  // Spec says: Underweight < 18.5, Normal 18.5-24.9, Overweight >= 25
  // Code uses: Underweight < 18, Normal 18-23.9, Overweight >= 24

  it("should classify BMI 18.3 as Underweight per WHO standards", () => {
    // BMI 18.3 is below 18.5 → Underweight
    // Current code returns "Normal" because it uses < 18
    expect(calculateStatus(18.3)).toBe("Underweight");
  });

  it("should classify BMI 24.5 as Normal per WHO standards", () => {
    // BMI 24.5 is below 25 → Normal
    // Current code returns "Overweight" because it uses < 24
    expect(calculateStatus(24.5)).toBe("Normal");
  });

  it("should classify BMI exactly 18.5 as Normal (WHO boundary)", () => {
    // BMI 18.5 is the lower boundary of Normal
    expect(calculateStatus(18.5)).toBe("Normal");
  });

  it("should classify BMI exactly 25.0 as Overweight (WHO boundary)", () => {
    // BMI 25.0 is the lower boundary of Overweight
    expect(calculateStatus(25.0)).toBe("Overweight");
  });

  // BUG-003: Age is collected but never used
  // calculateCalories does not accept an age parameter at all

  it("should produce different calorie targets for different ages", () => {
    const caloriesAge25 = calculateCalories(70, 25, "Medium", "Maintain");
    const caloriesAge65 = calculateCalories(70, 65, "Medium", "Maintain");
    expect(caloriesAge25).not.toBe(caloriesAge65);
    expect(caloriesAge25).toBeGreaterThan(caloriesAge65);
  });

  // BUG-004: Negative calorie values are possible

  it("should never return negative calorie values", () => {
    const calories = calculateCalories(10, 25, "Low", "Lose weight");
    expect(calories).toBeGreaterThan(0);
  });

  // BUG-005 (partial): Zero height produces Infinity BMI

  it("should not return Infinity for zero height", () => {
    // calculateBmi(70, 0) → 70 / (0/100)^2 → 70 / 0 → Infinity
    const bmi = calculateBmi(70, 0);
    expect(Number.isFinite(bmi)).toBe(true);
  });
});
