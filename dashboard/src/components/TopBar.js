import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import apiClient from "../config/apiClient";

// Alpha Vantage's GLOBAL_QUOTE endpoint (backing GET /quote/:symbol) covers
// individual listed securities, not indices like NIFTY/SENSEX. These are
// well-known tickers it reliably resolves, so the ticker shows real data
// instead of fabricated index values.
const TICKER_SYMBOLS = ["AAPL", "MSFT"];

const TopBar = () => {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchQuotes = async () => {
      const results = await Promise.allSettled(
        TICKER_SYMBOLS.map((symbol) => apiClient.get(`/quote/${symbol}`))
      );

      if (!isMounted) return;

      const next = {};
      let anySucceeded = false;
      let latestTimestamp = null;

      results.forEach((result, index) => {
        const symbol = TICKER_SYMBOLS[index];
        if (result.status === "fulfilled") {
          next[symbol] = result.value.data;
          anySucceeded = true;
          latestTimestamp = result.value.data.timestamp || latestTimestamp;
        }
      });

      setQuotes(next);
      setUnavailable(!anySucceeded);
      setLastUpdated(latestTimestamp ? new Date(latestTimestamp) : null);
      setLoading(false);
    };

    fetchQuotes();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{
      background: "white",
      borderBottom: "1px solid #e0e0e0",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      {/* Market Indicators Bar */}
      <div style={{
        background: "#f8f9fa",
        padding: "8px 30px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        gap: "30px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          {loading ? (
            <span style={{ fontSize: "13px", color: "#666" }}>
              Loading market data...
            </span>
          ) : unavailable ? (
            <span style={{ fontSize: "13px", color: "#999" }}>
              Live market data unavailable
            </span>
          ) : (
            TICKER_SYMBOLS.map((symbol) => {
              const quote = quotes[symbol];
              if (!quote) {
                return (
                  <div key={symbol} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#333", minWidth: "50px" }}>
                      {symbol}
                    </span>
                    <span style={{ fontSize: "12px", color: "#999" }}>unavailable</span>
                  </div>
                );
              }

              const isUp = quote.changePercent >= 0;

              return (
                <div key={symbol} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#333",
                    minWidth: "50px"
                  }}>
                    {symbol}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#333"
                    }}>
                      {quote.price.toFixed(2)}
                    </span>
                    <span style={{
                      fontSize: "12px",
                      color: isUp ? "#28a745" : "#dc3545",
                      fontWeight: "500",
                      background: isUp ? "#e8f5e9" : "#fdecea",
                      padding: "2px 6px",
                      borderRadius: "4px"
                    }}>
                      {isUp ? "+" : ""}
                      {quote.change.toFixed(2)} ({isUp ? "+" : ""}
                      {quote.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Market Status */}
        <div style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "15px"
        }}>
          <span style={{
            fontSize: "11px",
            color: "#666"
          }}>
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
              : ""}
          </span>
        </div>
      </div>

      {/* Menu Component */}
      <Menu />
    </div>
  );
};

export default TopBar;
