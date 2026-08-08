import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../config/apiClient";

const formatMoney = (n) => {
  const value = Number(n) || 0;
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Funds = () => {
  const [funds, setFunds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFunds = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiClient.get("/funds");
        setFunds(res.data);
      } catch (err) {
        if (err.response?.status !== 401) {
          setError(
            err.response?.data?.message || "Failed to load funds. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, []);

  if (loading) {
    return (
      <div className="funds">
        <p>Loading funds...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="funds">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI </p>
        <Link className="btn btn-green">Add funds</Link>
        <Link className="btn btn-blue">Withdraw</Link>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available balance</p>
              <p className="imp colored">{formatMoney(funds?.balance)}</p>
            </div>
            <div className="data">
              <p>Invested value</p>
              <p className="imp">{formatMoney(funds?.investedValue)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Total account value</p>
              <p className="imp">{formatMoney(funds?.totalAccountValue)}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <Link className="btn btn-blue">Open Account</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
