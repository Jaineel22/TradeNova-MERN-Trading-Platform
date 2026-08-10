import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import apiClient from "../config/apiClient";
import GeneralContext from "./GeneralContext";
import BuyActionWindow from "./BuyActionWindow";

jest.mock("../config/apiClient");

const renderDialog = (closeBuyWindow = jest.fn()) => {
  render(
    <GeneralContext.Provider value={{ openBuyWindow: jest.fn(), closeBuyWindow }}>
      <BuyActionWindow uid="TCS" />
    </GeneralContext.Provider>
  );
  return { closeBuyWindow };
};

// The Buy/Sell buttons only enable once the quote has loaded, so waiting on
// that is a more reliable "quote loaded" signal than matching the price text
// - at the default quantity of 1, "Market price" and "Estimated total" show
// the identical value, so text-based waits are ambiguous.
const waitForQuoteLoaded = () => waitFor(() => expect(screen.getByRole("button", { name: /buy/i })).toBeEnabled());

beforeEach(() => {
  apiClient.get.mockReset();
  apiClient.post.mockReset();
});

test("fetches and displays the live market price, and disables Buy/Sell until it loads", async () => {
  apiClient.get.mockResolvedValue({ data: { price: 2452.7, change: 79.7, changePercent: 3.36 } });
  renderDialog();

  expect(screen.getByRole("button", { name: /buy/i })).toBeDisabled();
  await waitForQuoteLoaded();

  const priceMentions = screen.getAllByText("₹2452.70"); // market price + estimated total (qty=1)
  expect(priceMentions).toHaveLength(2);
  expect(screen.getByRole("button", { name: /sell/i })).toBeEnabled();
  expect(apiClient.get).toHaveBeenCalledWith("/quote/TCS");
});

test("the quantity stepper increases and decreases the quantity and estimated total", async () => {
  apiClient.get.mockResolvedValue({ data: { price: 100, change: 1, changePercent: 1 } });
  renderDialog();
  await waitForQuoteLoaded();

  const qtyInput = screen.getByRole("spinbutton");
  expect(qtyInput).toHaveValue(1);

  await userEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
  await userEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
  expect(qtyInput).toHaveValue(3);
  expect(screen.getByText("₹300.00")).toBeInTheDocument(); // estimated total = 3 * 100

  await userEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
  expect(qtyInput).toHaveValue(2);
  expect(screen.getByText("₹200.00")).toBeInTheDocument();
});

test("the decrease button is disabled at a quantity of 1 (cannot go to 0 or below)", async () => {
  apiClient.get.mockResolvedValue({ data: { price: 100, change: 1, changePercent: 1 } });
  renderDialog();
  await waitForQuoteLoaded();

  expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeDisabled();
});

test("submitting Buy sends the symbol and quantity, never a price, and shows success feedback", async () => {
  apiClient.get.mockResolvedValue({ data: { price: 2452.7, change: 79.7, changePercent: 3.36 } });
  apiClient.post.mockResolvedValue({ data: { message: "Order executed successfully" } });
  renderDialog();
  await waitForQuoteLoaded();

  await userEvent.click(screen.getByRole("button", { name: /buy/i }));

  await waitFor(() => expect(apiClient.post).toHaveBeenCalledWith("/newOrder", { name: "TCS", qty: 1, mode: "BUY" }));
  expect(await screen.findByText("Order executed successfully")).toBeInTheDocument();
});

test("submitting Sell sends mode SELL", async () => {
  apiClient.get.mockResolvedValue({ data: { price: 2452.7, change: 79.7, changePercent: 3.36 } });
  apiClient.post.mockResolvedValue({ data: { message: "Order executed successfully" } });
  renderDialog();
  await waitForQuoteLoaded();

  await userEvent.click(screen.getByRole("button", { name: /sell/i }));

  await waitFor(() => expect(apiClient.post).toHaveBeenCalledWith("/newOrder", { name: "TCS", qty: 1, mode: "SELL" }));
});

test("shows a server-provided error message when the order is rejected, without closing the dialog", async () => {
  apiClient.get.mockResolvedValue({ data: { price: 2452.7, change: 79.7, changePercent: 3.36 } });
  apiClient.post.mockRejectedValue({ response: { status: 400, data: { message: "Insufficient funds" } } });
  const { closeBuyWindow } = renderDialog();
  await waitForQuoteLoaded();

  await userEvent.click(screen.getByRole("button", { name: /buy/i }));

  expect(await screen.findByText("Insufficient funds")).toBeInTheDocument();
  expect(closeBuyWindow).not.toHaveBeenCalled();
});

test("Cancel closes the dialog without submitting an order", async () => {
  apiClient.get.mockResolvedValue({ data: { price: 2452.7, change: 79.7, changePercent: 3.36 } });
  const { closeBuyWindow } = renderDialog();
  await waitForQuoteLoaded();

  await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

  expect(closeBuyWindow).toHaveBeenCalledWith(false);
  expect(apiClient.post).not.toHaveBeenCalled();
});

test("shows a warning and keeps Buy/Sell disabled when the quote fails to load", async () => {
  apiClient.get.mockRejectedValue({ response: { status: 502, data: { message: "Market data provider is unavailable" } } });
  renderDialog();

  expect(await screen.findByText("Market data provider is unavailable")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /buy/i })).toBeDisabled();
  expect(screen.getByRole("button", { name: /sell/i })).toBeDisabled();
});
