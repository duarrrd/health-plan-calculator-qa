export type ActivityLevel = "Low" | "Medium" | "High";

export type Goal = "Lose weight" | "Maintain" | "Gain";

export type FormValues = {
  weight: string;
  height: string;
  age: string;
  activityLevel: ActivityLevel;
  goal: Goal;
};

export type PlanResult = {
  bmi: number;
  status: "Underweight" | "Normal" | "Overweight";
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};
