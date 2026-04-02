import type { ActivityLevel, FormValues, Goal, PlanResult } from "../types";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  Low: 1.2,
  Medium: 1.5,
  High: 1.8
};

const GOAL_OFFSETS: Record<Goal, number> = {
  "Lose weight": -300,
  Maintain: 0,
  Gain: 300
};

export function calculateBmi(weight: number, height: number) {
  return weight / (height / 100) ** 2;
}

export function calculateStatus(bmi: number): PlanResult["status"] {
  if (bmi < 18) {
    return "Underweight";
  }

  if (bmi < 24) {
    return "Normal";
  }

  return "Overweight";
}

export function calculateCalories(
  weight: number,
  activityLevel: ActivityLevel,
  goal: Goal
) {
  const baseCalories = weight * 22;
  return Math.round(baseCalories * ACTIVITY_MULTIPLIERS[activityLevel] + GOAL_OFFSETS[goal]);
}

export function calculateMacros(weight: number, calories: number) {
  const protein = Math.round(weight * 1.5);
  const fat = Math.round(weight * 0.8);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return {
    protein,
    fat,
    carbs
  };
}

export function calculatePlan(formValues: FormValues): PlanResult {
  const weight = Number(formValues.weight);
  const height = Number(formValues.height);
  const bmi = calculateBmi(weight, height);
  const calories = calculateCalories(weight, formValues.activityLevel, formValues.goal);
  const macros = calculateMacros(weight, calories);

  return {
    bmi,
    status: calculateStatus(bmi),
    calories,
    ...macros
  };
}
