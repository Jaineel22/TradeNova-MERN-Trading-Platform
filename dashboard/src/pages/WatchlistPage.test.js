import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import apiClient from "../config/apiClient";
import WatchlistPage from "./WatchlistPage";

jest.mock("../config/apiClient");

const renderPage = () =>
  render(
    <MemoryRouter>
      <WatchlistPage />
    </MemoryRouter>
  );

beforeEach(() => {
  apiClient.get.mockReset();
  apiClient.post.mockReset();
  apiClient.delete.mockReset();
});

test("shows a loading state before the watchlist resolves", async () => {
  let resolveWatchlist;
  apiClient.get.mockImplementation((url) => {
    if (url === "/watchlist") return new Promise((resolve) => { resolveWatchlist = resolve; });
    return Promise.resolve({ data: {} });
  });

  renderPage();
  // WatchlistPage's loading state renders skeleton rows (LoadingState with
  // rows={3}), not a spinner.
  expect(document.querySelectorAll(".MuiSkeleton-root").length).toBeGreaterThan(0);

  resolveWatchlist({ data: [] });
  await waitFor(() => expect(screen.getByText(/your watchlist is empty/i)).toBeInTheDocument());
});

test("shows an empty state with a call to action when the watchlist has no symbols", async () => {
  apiClient.get.mockResolvedValue({ data: [] });
  renderPage();

  expect(await screen.findByText(/your watchlist is empty/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /add your first stock/i })).toBeInTheDocument();
});

test("shows an error state with a retry option when loading fails", async () => {
  apiClient.get.mockImplementation((url) => {
    if (url === "/watchlist") return Promise.reject({ response: { status: 500, data: { message: "Server error" } } });
    return Promise.resolve({ data: {} });
  });

  renderPage();

  expect(await screen.findByText("Server error")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
});

test("renders watchlist symbols with their live price and change", async () => {
  apiClient.get.mockImplementation((url) => {
    if (url === "/watchlist") return Promise.resolve({ data: [{ symbol: "TCS" }] });
    if (url === "/quote/TCS") return Promise.resolve({ data: { price: 2452.7, change: 79.7, changePercent: 3.36 } });
    return Promise.resolve({ data: {} });
  });

  renderPage();

  expect(await screen.findByText("TCS")).toBeInTheDocument();
  expect(screen.getByText("₹2452.70")).toBeInTheDocument();
});

test("adding a symbol posts it and appends it to the list", async () => {
  
  apiClient.get.mockImplementation((url) => {
    if (url === "/watchlist") return Promise.resolve({ data: [] });
    if (url === "/quote/INFY") return Promise.resolve({ data: { price: 1175.1, change: 10.1, changePercent: 0.87 } });
    return Promise.resolve({ data: {} });
  });
  apiClient.post.mockResolvedValue({ data: { message: "Symbol added to watchlist", symbol: "INFY" } });

  renderPage();
  await screen.findByText(/your watchlist is empty/i);

  const input = screen.getByPlaceholderText(/search e\.g\. aapl, tcs/i);
  await userEvent.type(input, "infy{Enter}");

  expect(apiClient.post).toHaveBeenCalledWith("/watchlist", { symbol: "INFY" });
  expect(await screen.findByText("INFY")).toBeInTheDocument();
});

test("removing a symbol calls delete and removes it from the list", async () => {
  
  apiClient.get.mockImplementation((url) => {
    if (url === "/watchlist") return Promise.resolve({ data: [{ symbol: "TCS" }] });
    if (url === "/quote/TCS") return Promise.resolve({ data: { price: 2452.7, change: 79.7, changePercent: 3.36 } });
    return Promise.resolve({ data: {} });
  });
  apiClient.delete.mockResolvedValue({ data: { message: "Symbol removed from watchlist", symbol: "TCS" } });

  renderPage();
  await screen.findByText("TCS");

  await userEvent.click(screen.getByTitle("Remove"));

  await waitFor(() => expect(apiClient.delete).toHaveBeenCalledWith("/watchlist/TCS"));
  await waitFor(() => expect(screen.queryByText("TCS")).not.toBeInTheDocument());
});

test("clicking the Buy/Sell icon opens the trade dialog for that symbol", async () => {
  
  apiClient.get.mockImplementation((url) => {
    if (url === "/watchlist") return Promise.resolve({ data: [{ symbol: "TCS" }] });
    if (url === "/quote/TCS") return Promise.resolve({ data: { price: 2452.7, change: 79.7, changePercent: 3.36 } });
    return Promise.resolve({ data: {} });
  });

  renderPage();
  await screen.findByText("TCS");

  await userEvent.click(screen.getByTitle("Buy/Sell"));

  expect(await screen.findByText("Place a paper trade")).toBeInTheDocument();
  // "TCS" now appears twice: the watchlist row link, and the dialog title.
  expect(screen.getAllByText("TCS").length).toBeGreaterThanOrEqual(2);
});
