import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const formatValue = (n) => {
  const value = Number(n) || 0;
  if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(2) + "k";
  }
  return value.toFixed(2);
};

const Summary = () => {
  const [funds, setFunds] = useState({ balance: 0 });
  const [portfolio, setPortfolio] = useState({
    totalInvested: 0,
    currentValue: 0,
    totalPnL: 0,
    pnlPercent: 0,
    holdings: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };
    const handleAuthError = (err) => {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    axios
      .get(`${API_BASE_URL}/funds`, { headers })
      .then((res) => setFunds(res.data))
      .catch(handleAuthError);

    axios
      .get(`${API_BASE_URL}/portfolio/summary`, { headers })
      .then((res) => setPortfolio(res.data))
      .catch(handleAuthError);
  }, []);

  const isProfit = portfolio.totalPnL >= 0;

  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{formatValue(funds.balance)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>{formatValue(funds.balance)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({portfolio.holdings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={isProfit ? "profit" : "loss"}>
              {formatValue(portfolio.totalPnL)}{" "}
              <small>{(portfolio.pnlPercent || 0).toFixed(2)}%</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{formatValue(portfolio.currentValue)}</span>{" "}
            </p>
            <p>
              Investment <span>{formatValue(portfolio.totalInvested)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
