import type { PlanResult } from "../types";

type ResultsCardProps = {
  result: PlanResult;
};

function ResultsCard({ result }: ResultsCardProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Section 2</p>
        <h2>Results</h2>
      </div>

      <div className="stats-grid">
        <article className="stat-card stat-card-accent">
          <span>BMI</span>
          <strong>{result.bmi.toFixed(1)}</strong>
        </article>
        <article className="stat-card">
          <span>Status</span>
          <strong>{result.status}</strong>
        </article>
        <article className="stat-card">
          <span>Recommended daily calories</span>
          <strong>{result.calories} kcal</strong>
        </article>
      </div>

      <div className="macro-strip">
        <article>
          <span>Protein</span>
          <strong>{result.protein} g</strong>
        </article>
        <article>
          <span>Fat</span>
          <strong>{result.fat} g</strong>
        </article>
        <article>
          <span>Carbs</span>
          <strong>{result.carbs} g</strong>
        </article>
      </div>
    </section>
  );
}

export default ResultsCard;
