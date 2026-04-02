import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Bug exposure: UI and state management", () => {
  // BUG-002: MealSimulator uses stale targets after recalculation
  // Spec says: "Meal Simulator should use the latest calculated plan values"

  it("should update simulator targets when plan is recalculated", async () => {
    const user = userEvent.setup();
    render(<App />);

    // First calculation: weight=70, Medium, Maintain → 2310 kcal
    await user.type(screen.getByLabelText(/weight/i), "70");
    await user.type(screen.getByLabelText(/height/i), "175");
    await user.type(screen.getByLabelText(/age/i), "30");
    await user.selectOptions(screen.getByLabelText(/activity level/i), "Medium");
    await user.selectOptions(screen.getByLabelText(/^goal$/i), "Maintain");
    await user.click(screen.getByRole("button", { name: /calculate plan/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/2310 kcal/).length).toBeGreaterThan(0);
    });

    // Second calculation: weight=100, Medium, Maintain → 3300 kcal
    await user.clear(screen.getByLabelText(/weight/i));
    await user.type(screen.getByLabelText(/weight/i), "100");
    await user.click(screen.getByRole("button", { name: /calculate plan/i }));

    await waitFor(() => {
      expect(screen.getByText("3300 kcal")).toBeInTheDocument();
    });

    // The simulator should now track against 3300, not 2310
    expect(screen.getByText("Tracking against 3300 kcal")).toBeInTheDocument();
  });

  // BUG-005: No input validation — empty form produces NaN results

  it("should show validation error when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Submit with all fields empty
    await user.click(screen.getByRole("button", { name: /calculate plan/i }));

    // Wait for results to appear (the app has a 700ms async delay)
    await waitFor(
      () => {
        expect(screen.getByText(/bmi/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Should NOT show NaN in results
    const body = document.body.textContent || "";
    expect(body).not.toContain("NaN");
  });
});
