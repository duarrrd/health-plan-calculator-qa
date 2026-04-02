import {
  calculateCalories,
  calculateMacros,
  calculatePlan,
  calculateStatus,
  calculateBmi
} from "./calculator";

describe("calculator rules", () => {
  it("calculates bmi from metric inputs", () => {
    expect(calculateBmi(70, 175)).toBeCloseTo(22.86, 2);
  });

  it("uses WHO standard bmi thresholds", () => {
    expect(calculateStatus(18.4)).toBe("Underweight");
    expect(calculateStatus(18.5)).toBe("Normal");
    expect(calculateStatus(24.9)).toBe("Normal");
    expect(calculateStatus(25)).toBe("Overweight");
  });

  it("allows calorie targets to go negative for low weight lose goal", () => {
    expect(calculateCalories(10, 25, "Low", "Lose weight")).toBeLessThan(0);
  });

  it("rounds macros independently", () => {
    expect(calculateMacros(73, 2019)).toEqual({
      protein: 110,
      fat: 58,
      carbs: 264
    });
  });

  it("returns all plan values together", () => {
    expect(
      calculatePlan({
        weight: "70",
        height: "175",
        age: "30",
        activityLevel: "Medium",
        goal: "Maintain"
      })
    ).toMatchObject({
      status: "Normal",
      calories: 2085
    });
  });
});
