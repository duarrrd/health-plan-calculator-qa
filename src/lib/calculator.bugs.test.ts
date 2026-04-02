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
    // A 25-year-old and a 65-year-old with same weight/activity/goal
    // should get different calorie recommendations
    const caloriesAge25 = calculateCalories(70, "Medium", "Maintain");
    const caloriesAge65 = calculateCalories(70, "Medium", "Maintain");
    // These are currently identical because age is not a parameter
    // When fixed, the function signature will include age:
    // calculateCalories(weight, age, activityLevel, goal)
    // For now, this test documents the gap — both calls return 2310
    expect(caloriesAge25).not.toBe(caloriesAge65);
  });

  // BUG-004: Negative calorie values are possible

  it("should never return negative calorie values", () => {
    // weight=10, Low activity, Lose weight → 10*22*1.2 + (-300) = -36
    const calories = calculateCalories(10, "Low", "Lose weight");
    expect(calories).toBeGreaterThan(0);
  });

  // BUG-005 (partial): Zero height produces Infinity BMI

  it("should not return Infinity for zero height", () => {
    // calculateBmi(70, 0) → 70 / (0/100)^2 → 70 / 0 → Infinity
    const bmi = calculateBmi(70, 0);
    expect(Number.isFinite(bmi)).toBe(true);
  });
});
