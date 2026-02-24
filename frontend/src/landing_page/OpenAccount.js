import React from "react";
import { useNavigate } from "react-router-dom";

function OpenAccount() {
  const navigate = useNavigate();

  return (
    <div className="container p-5 mb-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="mt-5" style={{ 
            fontSize: "2.8rem", 
            fontWeight: "600",
            color: "#1e3c72",
            marginBottom: "1rem"
          }}>
            Open a TradeNova account
          </h1>
          
          <p style={{ 
            fontSize: "1.2rem", 
            color: "#666",
            maxWidth: "700px",
            margin: "0 auto 2rem auto"
          }}>
            Modern platforms and apps, <strong style={{ color: "#1e3c72" }}>₹0 investments</strong>, 
            and flat <strong style={{ color: "#2a5298" }}>₹20 intraday</strong> and F&O trades.
          </p>

          <button
            className="btn btn-primary fs-5 mb-5"
            style={{ 
              width: "200px", 
              padding: "12px 0",
              borderRadius: "8px",
              background: "#1e3c72",
              border: "none",
              transition: "all 0.3s ease"
            }}
            onClick={() => navigate("/signup")}
            onMouseEnter={(e) => e.target.style.background = "#2a5298"}
            onMouseLeave={(e) => e.target.style.background = "#1e3c72"}
          >
            Sign up Now <i className="fa fa-arrow-right ms-2"></i>
          </button>

          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "20px",
            color: "#888",
            fontSize: "0.9rem"
          }}>
            <span><i className="fa fa-shield me-1" style={{ color: "#4CAF50" }}></i> SEBI Registered</span>
            <span><i className="fa fa-lock me-1" style={{ color: "#4CAF50" }}></i> Secure</span>
            <span><i className="fa fa-clock-o me-1" style={{ color: "#4CAF50" }}></i> 24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenAccount;