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

  const handleFieldChange = (name: keyof FormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleCalculate = async () => {
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
        <UserForm formValues={formValues} onChange={handleFieldChange} onSubmit={handleCalculate} />

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
