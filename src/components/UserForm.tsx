import type { ChangeEvent, FormEvent } from "react";
import type { FormValues } from "../types";

type UserFormProps = {
  formValues: FormValues;
  errors: string[];
  onChange: (name: keyof FormValues, value: string) => void;
  onSubmit: () => void;
};

function UserForm({ formValues, errors, onChange, onSubmit }: UserFormProps) {
  const handleInputChange =
    (name: keyof FormValues) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(name, event.target.value);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="panel panel-form">
      <div className="panel-heading">
        <p className="eyebrow">Section 1</p>
        <h2>User Input</h2>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Weight (kg)</span>
          <input
            aria-label="Weight"
            name="weight"
            type="number"
            min="1"
            placeholder="72"
            value={formValues.weight}
            onChange={handleInputChange("weight")}
          />
        </label>

        <label className="field">
          <span>Height (cm)</span>
          <input
            aria-label="Height"
            name="height"
            type="number"
            min="1"
            placeholder="175"
            value={formValues.height}
            onChange={handleInputChange("height")}
          />
        </label>

        <label className="field">
          <span>Age</span>
          <input
            aria-label="Age"
            name="age"
            type="number"
            min="1"
            max="150"
            placeholder="29"
            value={formValues.age}
            onChange={handleInputChange("age")}
          />
        </label>

        <label className="field">
          <span>Activity level</span>
          <select
            aria-label="Activity level"
            name="activityLevel"
            value={formValues.activityLevel}
            onChange={handleInputChange("activityLevel")}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label className="field">
          <span>Goal</span>
          <select
            aria-label="Goal"
            name="goal"
            value={formValues.goal}
            onChange={handleInputChange("goal")}
          >
            <option value="Lose weight">Lose weight</option>
            <option value="Maintain">Maintain</option>
            <option value="Gain">Gain</option>
          </select>
        </label>

        <button className="primary-button" type="submit">
          Calculate Plan
        </button>
      </form>

      {errors.length > 0 ? (
        <div role="alert" className="error-list">
          {errors.map((error) => (
            <p key={error} className="error-text">{error}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default UserForm;
