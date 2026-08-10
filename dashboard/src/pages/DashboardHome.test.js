import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import apiClient from "../config/apiClient";
import DashboardHome from "./DashboardHome";

jest.mock("../config/apiClient");
// jsdom has no real <canvas> 2D context, which chart.js needs; the chart's
// own rendering isn't what this test is about, so it's replaced with a
// trivial stand-in and the real metric/behaviour rendering is asserted
// directly instead.
jest.mock("../components/DoughnoutChart", () => ({
  DoughnutChart: () => <div data-testid="doughnut-chart" />,
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <DashboardHome />
    </MemoryRouter>
  );

const mockApi = ({ funds, portfolio, orders }) => {
  apiClient.get.mockImplementation((url) => {
    if (url === "/funds") return Promise.resolve({ data: funds });
    if (url === "/portfolio/summary") return Promise.resolve({ data: portfolio });
    if (url === "/allOrders") return Promise.resolve({ data: orders });
    return Promise.resolve({ data: {} });
  });
};  

beforeEach(() => {
  apiClient.get.mockReset();
});

test("renders the four top-level metrics from real API data", async () => {
  mockApi({
    funds: { balance: 55393.8, investedValue: 37248.1, totalAccountValue: 92641.9 },
    portfolio: { currentValue: 37248.1, totalPnL: 1250.5, pnlPercent: 3.47, holdings: [] },
    orders: [],
  });

  renderPage();

  expect(await screen.findByText("₹55,393.80")).toBeInTheDocument(); // available balance
  expect(screen.getByText("₹37,248.10")).toBeInTheDocument(); // portfolio value
  expect(screen.getByText("+₹1,250.50")).toBeInTheDocument(); // total P&L (profit, with +)
  expect(screen.getByText("₹92,641.90")).toBeInTheDocument(); // total account value
});

test("shows negative P&L without a + sign", async () => {
  mockApi({
    funds: { balance: 90000, investedValue: 10000, totalAccountValue: 100000 },
    portfolio: { currentValue: 9000, totalPnL: -1000, pnlPercent: -10, holdings: [] },
    orders: [],
  });

  renderPage();

  expect(await screen.findByText("₹-1,000.00")).toBeInTheDocument();
});

test("shows empty states with calls to action when there are no holdings or orders", async () => {
  mockApi({
    funds: { balance: 100000, investedValue: 0, totalAccountValue: 100000 },
    portfolio: { currentValue: 0, totalPnL: 0, pnlPercent: 0, holdings: [] },
    orders: [],
  });

  renderPage();

  expect(await screen.findByText(/no holdings yet/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /explore watchlist/i })).toBeInTheDocument();
  expect(screen.getByText(/no orders placed yet/i)).toBeInTheDocument();
});

test("renders real holdings in the table and recent orders in the feed", async () => {
  mockApi({
    funds: { balance: 55393.8, investedValue: 37248.1, totalAccountValue: 92641.9 },
    portfolio: {
      currentValue: 37248.1,
      totalPnL: 0,
      pnlPercent: 0,
      holdings: [
        { symbol: "TCS", quantity: 8, averagePrice: 2452.7, currentValue: 19621.6, pnl: 0, allocation: 52.68 },
      ],
    },
    orders: [{ _id: "1", name: "TCS", mode: "BUY", qty: 8, price: 2452.7 }],
  });

  renderPage();

  // "TCS" legitimately appears twice: once in the holdings table, once in
  // the recent-orders feed - both rendering the same real API data.
  const tcsMentions = await screen.findAllByText("TCS");
  expect(tcsMentions).toHaveLength(2);
  expect(screen.getByText("8")).toBeInTheDocument(); // quantity
  expect(screen.getByText("BUY")).toBeInTheDocument();
  expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
});

test("shows an error state with retry when loading fails", async () => {
  apiClient.get.mockRejectedValue({ response: { status: 500, data: { message: "Server error" } } });

  renderPage();

  expect(await screen.findByText("Server error")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
});
