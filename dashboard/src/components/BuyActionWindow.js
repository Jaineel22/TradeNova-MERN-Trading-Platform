import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";
import apiClient from "../config/apiClient";

const BuyActionWindow = ({ uid }) => {
  const context = useContext(GeneralContext);
  const { closeBuyWindow } = context;

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const placeOrder = async (mode) => {
    try {
      const res = await apiClient.post("/newOrder", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode,
      });

      alert(res.data.message);
      closeBuyWindow();
    } catch (err) {
      if (err.response?.status !== 401) {
        alert(err.response?.data?.message || "Order failed");
      }
    }
  };

  return (
    <div className="container" id="buy-window">
      <div className="header">
        <h3>
          {uid} <span>Buy / Sell</span>
        </h3>
      </div>

      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price (₹)</legend>
            <input
              type="number"
              step="0.05"
              min="0"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />
          </fieldset>
        </div>

        <div className="options">
          <span>
            <i className="fa fa-info-circle"></i> Estimated total: ₹{(stockQuantity * stockPrice).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="buttons">
        <button className="btn btn-blue" onClick={() => placeOrder("BUY")}>
          Buy
        </button>
        <button className="btn btn-red" onClick={() => placeOrder("SELL")}>
          Sell
        </button>
        <button className="btn btn-grey" onClick={closeBuyWindow}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BuyActionWindow;