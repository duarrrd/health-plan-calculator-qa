import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Bug exposure: UI and state management", () => {
  // BUG-002: MealSimulator uses stale targets after recalculation
  // Spec says: "Meal Simulator should use the latest calculated plan values"

  it("should update simulator targets when plan is recalculated", async () => {
    const user = userEvent.setup();
    render(<App />);

    // First calculation: weight=70, Medium, Maintain → 2085 kcal
    await user.type(screen.getByLabelText(/weight/i), "70");
    await user.type(screen.getByLabelText(/height/i), "175");
    await user.type(screen.getByLabelText(/age/i), "30");
    await user.selectOptions(screen.getByLabelText(/activity level/i), "Medium");
    await user.selectOptions(screen.getByLabelText(/^goal$/i), "Maintain");
    await user.click(screen.getByRole("button", { name: /calculate plan/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/2085 kcal/).length).toBeGreaterThan(0);
    });

    // Second calculation: weight=100, Medium, Maintain → 3075 kcal
    await user.clear(screen.getByLabelText(/weight/i));
    await user.type(screen.getByLabelText(/weight/i), "100");
    await user.click(screen.getByRole("button", { name: /calculate plan/i }));

    await waitFor(() => {
      expect(screen.getAllByText("3075 kcal").length).toBeGreaterThan(0);
    });

    // The simulator should now track against 3075, not 2085
    expect(screen.getByText("Tracking against 3075 kcal")).toBeInTheDocument();
  });

  // BUG-005: No input validation — empty form produces NaN results

  it("should show validation error when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Submit with all fields empty
    await user.click(screen.getByRole("button", { name: /calculate plan/i }));

    // Validation errors should appear immediately (no async delay)
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    // Should show validation messages, not NaN results
    expect(screen.getByText(/weight must be a positive number/i)).toBeInTheDocument();
    expect(screen.getByText(/height must be a positive number/i)).toBeInTheDocument();
    expect(screen.getByText(/age must be a positive number/i)).toBeInTheDocument();

    const body = document.body.textContent || "";
    expect(body).not.toContain("NaN");
  });
});
