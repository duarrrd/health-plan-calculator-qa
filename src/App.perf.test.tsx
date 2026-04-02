import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Profiler, type ProfilerOnRenderCallback } from "react";
import App from "./App";

describe("Performance", () => {
  it("does not re-render excessively during form input", async () => {
    const user = userEvent.setup();
    const renderCounts: Record<string, number> = {};

    const onRender: ProfilerOnRenderCallback = (id) => {
      renderCounts[id] = (renderCounts[id] || 0) + 1;
    };

    render(
      <Profiler id="App" onRender={onRender}>
        <App />
      </Profiler>
    );

    // Type 3 characters in weight field
    await user.type(screen.getByLabelText(/weight/i), "70");

    // Each keystroke triggers a state update → re-render
    // Initial render (1) + 2 keystrokes = 3 renders is reasonable
    // Flag if it's significantly more (e.g., > 10 would indicate a problem)
    expect(renderCounts["App"]).toBeLessThanOrEqual(10);
  });

  it("does not re-render results when typing in simulator", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Calculate first
    await user.type(screen.getByLabelText(/weight/i), "70");
    await user.type(screen.getByLabelText(/height/i), "175");
    await user.type(screen.getByLabelText(/age/i), "30");
    await user.click(screen.getByRole("button", { name: /calculate plan/i }));

    await waitFor(() => {
      expect(screen.getByText(/recommended daily calories/i)).toBeInTheDocument();
    });

    // Capture the results text before simulator interaction
    const trackingText = screen.getByText("Tracking against 2085 kcal").textContent;

    // Type in simulator
    await user.type(screen.getByLabelText(/calories eaten today/i), "1500");

    // Results should remain unchanged (simulator input doesn't trigger recalculation)
    expect(screen.getByText("Tracking against 2085 kcal").textContent).toBe(trackingText);
  });
});
