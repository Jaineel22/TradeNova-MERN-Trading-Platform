// Mocks the yahoo-finance2 module so trading/watchlist/market tests never
// depend on internet access or real market prices. Must be required BEFORE
// any module that transitively requires yahoo-finance2 (marketDataService,
// tradingService, marketController) so Jest's module registry picks up the
// mock first.
const mockQuote = jest.fn();
const mockChart = jest.fn();

jest.mock("yahoo-finance2", () => ({
  default: jest.fn().mockImplementation(() => ({
    quote: mockQuote,
    chart: mockChart,
  })),
}));

// A realistic, deterministic quote fixture. Tests override specific fields
// with mockQuote.mockResolvedValueOnce({...}) where they need a different
// price.
function fixtureQuote(overrides = {}) {
  return {
    symbol: "TCS.NS",
    regularMarketPrice: 2452.7,
    regularMarketChange: 79.7,
    regularMarketChangePercent: 3.36,
    regularMarketTime: new Date("2026-08-07T09:45:02.000Z"),
    ...overrides,
  };
}

module.exports = { mockQuote, mockChart, fixtureQuote };
