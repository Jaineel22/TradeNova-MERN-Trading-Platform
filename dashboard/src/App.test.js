/**
 * Routing + authentication-gating tests for the real route tree (the same
 * one index.js mounts). Renders the full App with a mocked API client so no
 * test depends on a live backend; BrowserRouter reads its initial route
 * from window.history, so each test pushes a URL before rendering.
 */
import { render, screen } from "@testing-library/react";
import apiClient from "./config/apiClient";
import App from "./App";

jest.mock("./config/apiClient");

const goTo = (path) => window.history.pushState({}, "", path);

beforeEach(() => {
  localStorage.clear();
  apiClient.get.mockReset().mockResolvedValue({ data: {} });
  apiClient.post.mockReset().mockResolvedValue({ data: {} });
});

describe("Public routes", () => {
  // Matched against the page's <h1>-<h4> heading specifically, not plain
  // text - "Pricing"/"Support" etc. also appear as nav links in every page's
  // header, which would otherwise make the match ambiguous.
  test.each([
    ["/", "Trade smarter"],
    ["/about", "About TradeNova"],
    ["/product", "The product"],
    ["/pricing", "Pricing"],
    ["/support", "Support"],
  ])("renders %s", async (path, expectedText) => {
    goTo(path);
    render(<App />);
    expect(await screen.findByRole("heading", { name: new RegExp(expectedText, "i") })).toBeInTheDocument();
  });

  test("renders the login page", async () => {
    goTo("/login");
    render(<App />);
    expect(await screen.findByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });

  test("renders the signup page", async () => {
    goTo("/signup");
    render(<App />);
    expect(await screen.findByRole("heading", { name: /create your account/i })).toBeInTheDocument();
  });

  test("renders a not-found page for an unknown route", async () => {
    goTo("/this-route-does-not-exist");
    render(<App />);
    expect(await screen.findByText("404")).toBeInTheDocument();
  });
});

describe("Protected route gating", () => {
  test("redirects to /login when visiting a dashboard route while logged out", async () => {
    goTo("/dashboard");
    render(<App />);
    expect(await screen.findByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });

  test("redirects nested dashboard routes to /login too", async () => {
    goTo("/dashboard/holdings");
    render(<App />);
    expect(await screen.findByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });

  test("renders the dashboard when a token is already present", async () => {
    localStorage.setItem("token", "fake.jwt.token");
    apiClient.get.mockImplementation((url) => {
      if (url === "/funds") return Promise.resolve({ data: { balance: 100000, investedValue: 0, totalAccountValue: 100000 } });
      if (url === "/portfolio/summary")
        return Promise.resolve({ data: { holdings: [], currentValue: 0, totalPnL: 0, pnlPercent: 0 } });
      if (url === "/allOrders") return Promise.resolve({ data: [] });
      // Topbar's ticker fetches these on mount; rejecting (rather than
      // resolving with a shapeless {}) exercises its existing "quote
      // unavailable" handling instead of crashing on a malformed quote.
      if (url === "/quote/AAPL" || url === "/quote/MSFT") return Promise.reject(new Error("not mocked"));
      return Promise.resolve({ data: {} });
    });

    goTo("/dashboard");
    render(<App />);

    expect(await screen.findByText(/available balance/i)).toBeInTheDocument();
  });
});
