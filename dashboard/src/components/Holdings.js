import React, { useState, useEffect } from "react";
import { VerticalGraph } from "./VerticalGraph";
import apiClient from "../config/apiClient";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHoldings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get("/allHoldings");
      setAllHoldings(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(
          err.response?.data?.message || "Failed to load holdings. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const labels = allHoldings.map((subArray) => subArray.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  if (loading) {
    return (
      <>
        <h3 className="title">Holdings</h3>
        <p>Loading holdings...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h3 className="title">Holdings</h3>
        <p>{error}</p>
      </>
    );
  }

  if (allHoldings.length === 0) {
    return (
      <>
        <h3 className="title">Holdings (0)</h3>
        <p>You don't have any holdings yet. Buy a stock from your watchlist to get started.</p>
      </>
    );
  }

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit =
                curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
