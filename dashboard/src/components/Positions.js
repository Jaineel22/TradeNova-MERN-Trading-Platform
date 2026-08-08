import React, { useState, useEffect } from "react";
import apiClient from "../config/apiClient";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPositions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get("/allPositions");
      setAllPositions(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(
          err.response?.data?.message || "Failed to load positions. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  if (loading) {
    return (
      <>
        <h3 className="title">Positions</h3>
        <p>Loading positions...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h3 className="title">Positions</h3>
        <p>{error}</p>
      </>
    );
  }

  if (allPositions.length === 0) {
    return (
      <>
        <h3 className="title">Positions (0)</h3>
        <p>
          You don't have any open positions. TradeNova currently tracks
          delivery-style holdings (see the Holdings tab) rather than
          intraday positions.
        </p>
      </>
    );
  }

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>

          <tbody>
            {allPositions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit =
                curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
