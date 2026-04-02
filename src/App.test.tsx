import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Health Plan Calculator app", () => {
  it("reveals results after calculate", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/weight/i), "70");
    await user.type(screen.getByLabelText(/height/i), "175");
    await user.type(screen.getByLabelText(/age/i), "30");
    await user.selectOptions(screen.getByLabelText(/activity level/i), "Medium");
    await user.selectOptions(screen.getByLabelText(/^goal$/i), "Maintain");
    await user.click(screen.getByRole("button", { name: /calculate plan/i }));

    await waitFor(() => {
      expect(screen.getByText(/recommended daily calories/i)).toBeInTheDocument();
    });
  });

  it("updates simulator targets after a second calculation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/weight/i), "70");
    await user.type(screen.getByLabelText(/height/i), "175");
    await user.type(screen.getByLabelText(/age/i), "30");
    await user.selectOptions(screen.getByLabelText(/activity level/i), "Medium");
    await user.selectOptions(screen.getByLabelText(/^goal$/i), "Maintain");
    await user.click(screen.getByRole("button", { name: /calculate plan/i }));

    await screen.findByDisplayValue("70");

    await user.clear(screen.getByLabelText(/weight/i));
    await user.type(screen.getByLabelText(/weight/i), "100");
    await user.click(screen.getByRole("button", { name: /calculate plan/i }));

    await waitFor(() => {
      expect(screen.getAllByText("3075 kcal").length).toBeGreaterThan(0);
    });

    await user.type(screen.getByLabelText(/calories eaten today/i), "2400");

    expect(screen.getByText("Under target")).toBeInTheDocument();
    expect(screen.getByText("Tracking against 3075 kcal")).toBeInTheDocument();
  });
});
