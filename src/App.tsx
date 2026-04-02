import { useState } from "react";
import MealSimulator from "./components/MealSimulator";
import ResultsCard from "./components/ResultsCard";
import UserForm from "./components/UserForm";
import { calculatePlan } from "./lib/calculator";
import type { FormValues, PlanResult } from "./types";

const INITIAL_FORM_VALUES: FormValues = {
  weight: "",
  height: "",
  age: "",
  activityLevel: "Medium",
  goal: "Maintain"
};

function App() {
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFieldChange = (name: keyof FormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [name]: value
    }));
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    const weight = Number(formValues.weight);
    const height = Number(formValues.height);
    const age = Number(formValues.age);

    if (!formValues.weight || isNaN(weight) || weight <= 0) {
      errs.push("Weight must be a positive number");
    }
    if (!formValues.height || isNaN(height) || height <= 0) {
      errs.push("Height must be a positive number");
    }
    if (!formValues.age || isNaN(age) || age <= 0) {
      errs.push("Age must be a positive number");
    }

    return errs;
  };

  const handleCalculate = async () => {
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    const nextPlan = await new Promise<PlanResult>((resolve) => {
      window.setTimeout(() => resolve(calculatePlan(formValues)), 700);
    });

    setResult(nextPlan);
  };

  return (
    <main className="app-shell">
      <div className="hero">
        <p className="hero-kicker">Wellness planning demo</p>
        <h1>Health Plan Calculator</h1>
        <p className="hero-copy">
          Estimate a daily plan from a few personal metrics, then simulate how today's intake
          compares with the recommendation.
        </p>
      </div>

      <div className="layout-stack">
        <UserForm
          formValues={formValues}
          errors={errors}
          onChange={handleFieldChange}
          onSubmit={handleCalculate}
        />

        {result ? (
          <>
            <ResultsCard result={result} />
            <MealSimulator
              recommendedCalories={result.calories}
              recommendedProtein={result.protein}
            />
          </>
        ) : null}
      </div>
    </main>
  );
}

export default App;
