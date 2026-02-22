import React from "react";
import Menu from "./Menu";

const TopBar = () => {
  // Sample market data
  const marketData = {
    nifty: { value: "22,345.60", change: "+125.30", percent: "+0.56%" },
    sensex: { value: "73,892.15", change: "+412.45", percent: "+0.48%" }
  };

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
          {/* NIFTY */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ 
              fontSize: "13px", 
              fontWeight: "600", 
              color: "#333",
              minWidth: "70px"
            }}>
              NIFTY 50
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ 
                fontSize: "13px", 
                fontWeight: "500", 
                color: "#333" 
              }}>
                {marketData.nifty.value}
              </span>
              <span style={{ 
                fontSize: "12px", 
                color: "#28a745",
                fontWeight: "500",
                background: "#e8f5e9",
                padding: "2px 6px",
                borderRadius: "4px"
              }}>
                {marketData.nifty.change} ({marketData.nifty.percent})
              </span>
            </div>
          </div>

          {/* SENSEX */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ 
              fontSize: "13px", 
              fontWeight: "600", 
              color: "#333",
              minWidth: "70px"
            }}>
              SENSEX
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ 
                fontSize: "13px", 
                fontWeight: "500", 
                color: "#333" 
              }}>
                {marketData.sensex.value}
              </span>
              <span style={{ 
                fontSize: "12px", 
                color: "#28a745",
                fontWeight: "500",
                background: "#e8f5e9",
                padding: "2px 6px",
                borderRadius: "4px"
              }}>
                {marketData.sensex.change} ({marketData.sensex.percent})
              </span>
            </div>
          </div>
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
            padding: "4px 8px",
            background: "#28a745",
            color: "white",
            borderRadius: "12px",
            fontWeight: "500"
          }}>
            Market Open
          </span>
          <span style={{
            fontSize: "11px",
            color: "#666"
          }}>
            Last updated: 10:30 AM
          </span>
        </div>
      </div>

      {/* Menu Component */}
      <Menu />
    </div>
  );
};

export default TopBar;