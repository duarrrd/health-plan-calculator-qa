import { useState } from "react";

type MealSimulatorProps = {
  recommendedCalories: number;
  recommendedProtein: number;
};

function MealSimulator({ recommendedCalories, recommendedProtein }: MealSimulatorProps) {
  const [targetCalories] = useState(recommendedCalories);
  const [targetProtein] = useState(recommendedProtein);
  const [eatenCalories, setEatenCalories] = useState("");
  const [eatenProtein, setEatenProtein] = useState("");

  const calorieValue = Number(eatenCalories);
  const proteinValue = Number(eatenProtein);
  const remainingCalories = targetCalories - calorieValue;

  let status = "On track";
  if (calorieValue > targetCalories) {
    status = "Over limit";
  } else if (calorieValue < targetCalories) {
    status = "Under target";
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Section 3</p>
        <h2>Meal Simulator</h2>
      </div>

      <div className="simulator-grid">
        <label className="field">
          <span>Calories eaten today</span>
          <input
            aria-label="Calories eaten today"
            type="text"
            value={eatenCalories}
            onChange={(event) => setEatenCalories(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Protein eaten today</span>
          <input
            aria-label="Protein eaten today"
            type="text"
            value={eatenProtein}
            onChange={(event) => setEatenProtein(event.target.value)}
          />
        </label>
      </div>

      <div className="simulator-summary">
        <article className="summary-chip">
          <span>Remaining calories</span>
          <strong>{remainingCalories} kcal</strong>
        </article>
        <article className="summary-chip">
          <span>Status</span>
          <strong>{status}</strong>
        </article>
      </div>

      <p className="tracking-note">Tracking against {targetCalories} kcal</p>

      {proteinValue < targetProtein ? (
        <p className="warning-text">Protein is below the recommended target.</p>
      ) : null}
    </section>
  );
}

export default MealSimulator;
