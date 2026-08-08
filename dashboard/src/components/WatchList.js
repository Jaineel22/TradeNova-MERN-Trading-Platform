import React, { useState, useContext, useEffect } from "react";

import GeneralContext from "./GeneralContext";

import { Tooltip, Grow } from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Close,
} from "@mui/icons-material";

import { DoughnutChart } from "./DoughnoutChart";
import apiClient from "../config/apiClient";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const loadWatchlist = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get("/watchlist");
      setWatchlist(
        res.data.map((item) => ({
          name: item.symbol,
          price: null,
          percent: "--",
          isDown: false,
        }))
      );
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(
          err.response?.data?.message || "Failed to load watchlist."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSymbol = async (e) => {
    if (e.key !== "Enter") return;

    const symbol = searchValue.trim();
    if (!symbol) return;

    try {
      await apiClient.post("/watchlist", { symbol });

      setSearchValue("");

      let quote = null;
      try {
        const quoteRes = await apiClient.get(`/quote/${symbol}`);
        quote = quoteRes.data;
      } catch (quoteErr) {
        // Live price unavailable for this symbol (unsupported symbol or
        // provider rate limit) - still add it to the list without a price.
      }

      setWatchlist((prev) => [
        ...prev,
        {
          name: symbol.toUpperCase(),
          price: quote ? quote.price : null,
          percent: quote ? `${quote.changePercent.toFixed(2)}%` : "--",
          isDown: quote ? quote.changePercent < 0 : false,
        },
      ]);
    } catch (err) {
      if (err.response?.status !== 401) {
        alert(err.response?.data?.message || "Failed to add symbol");
      }
    }
  };

  const handleRemoveSymbol = async (symbol) => {
    try {
      await apiClient.delete(`/watchlist/${symbol}`);
      setWatchlist((prev) => prev.filter((item) => item.name !== symbol));
    } catch (err) {
      if (err.response?.status !== 401) {
        alert(err.response?.data?.message || "Failed to remove symbol");
      }
    }
  };

  const labels = watchlist.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price || 0),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, tcs, aapl - press Enter to add"
          className="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleAddSymbol}
        />
        <span className="counts"> {watchlist.length} / 50</span>
      </div>

      {loading ? (
        <p style={{ padding: "10px 20px", color: "#666", fontSize: "13px" }}>
          Loading watchlist...
        </p>
      ) : error ? (
        <p style={{ padding: "10px 20px", color: "#b3261e", fontSize: "13px" }}>
          {error}
        </p>
      ) : watchlist.length === 0 ? (
        <p style={{ padding: "10px 20px", color: "#666", fontSize: "13px" }}>
          Your watchlist is empty. Search for a symbol above and press Enter to add it.
        </p>
      ) : (
        <ul className="list">
          {watchlist.map((stock, index) => {
            return (
              <WatchListItem
                stock={stock}
                key={index}
                onRemove={handleRemoveSymbol}
              />
            );
          })}
        </ul>
      )}

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, onRemove }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = (e) => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = (e) => {
    setShowWatchlistActions(false);
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="down" />
          )}
          <span className="price">{stock.price !== null ? stock.price : "--"}</span>
        </div>
      </div>
      {showWatchlistActions && (
        <WatchListActions uid={stock.name} onRemove={onRemove} />
      )}
    </li>
  );
};

const WatchListActions = ({ uid, onRemove }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid);
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy">Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="sell">Sell</button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip
          title="Remove from watchlist"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action" onClick={() => onRemove(uid)}>
            <Close className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
