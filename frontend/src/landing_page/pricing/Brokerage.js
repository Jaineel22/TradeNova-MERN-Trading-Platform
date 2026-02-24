import React from "react";

function Brokerage() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 border-top">
        {/* Brokerage Calculator Section */}
        <div className="col-8 p-4">
          <a href="" style={{ textDecoration: "none" }}>
            <h3 style={{ 
              fontSize: "1.4rem", 
              fontWeight: "600",
              color: "#1e3c72",
              marginBottom: "1.5rem",
              position: "relative",
              paddingBottom: "10px",
              display: "inline-block"
            }}>
              Brokerage Calculator
              <span style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "40px",
                height: "3px",
                background: "linear-gradient(90deg, #1e3c72, #2a5298)",
                borderRadius: "2px"
              }}></span>
            </h3>
          </a>
          
          <div style={{
            background: "#f8f9fa",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
          }}>
            <ul style={{ 
              listStyle: "none",
              padding: "0",
              margin: "0"
            }}>
              {[
                "Call & Trade and RMS auto-squareoff: Additional charges of ₹50 + GST per order.",
                "Digital contract notes will be sent via e-mail.",
                "Physical copies of contract notes, if required, shall be charged ₹20 per contract note. Courier charges apply.",
                "For NRI account (non-PIS), 0.5% or ₹100 per executed order for equity (whichever is lower).",
                "For NRI account (PIS), 0.5% or ₹200 per executed order for equity (whichever is lower).",
                "If the account is in debit balance, any order placed will be charged ₹40 per executed order instead of ₹20 per executed order."
              ].map((item, index) => (
                <li key={index} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "1rem",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  color: "#4a5568"
                }}>
                  <span style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    background: "#1e3c72",
                    borderRadius: "50%",
                    marginTop: "8px"
                  }}></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#e8f0fe",
            borderRadius: "8px",
            border: "1px solid #cddff0"
          }}>
            <p style={{
              margin: "0",
              fontSize: "0.9rem",
              color: "#1e3c72"
            }}>
              <i className="fa fa-info-circle" style={{ marginRight: "8px" }}></i>
              All charges are subject to GST as applicable
            </p>
          </div>
        </div>

        {/* List of Charges Section */}
        <div className="col-4 p-4">
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <a href="" style={{ textDecoration: "none" }}>
              <h3 style={{ 
                fontSize: "1.4rem", 
                fontWeight: "600",
                color: "#2a5298",
                marginBottom: "1.5rem",
                textAlign: "center"
              }}>
                List of Charges
              </h3>
            </a>
            
            {/* Quick Stats */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "2rem"
            }}>
              {[
                { label: "Equity Delivery", value: "0.1%" },
                { label: "Equity Intraday", value: "0.03%" },
                { label: "Futures", value: "0.02%" },
                { label: "Options", value: "₹20/ lot" }
              ].map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0",
                  borderBottom: index < 3 ? "1px dashed #e2e8f0" : "none"
                }}>
                  <span style={{ color: "#666" }}>{item.label}</span>
                  <span style={{ 
                    fontWeight: "600",
                    color: "#1e3c72"
                  }}>{item.value}</span>
                </div>
              ))}
            </div>
            
            <div style={{
              textAlign: "center",
              padding: "1rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "8px"
            }}>
              <span style={{
                color: "white",
                fontSize: "0.9rem"
              }}>
                <i className="fa fa-calculator" style={{ marginRight: "8px" }}></i>
                Calculate your brokerage
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Brokerage;