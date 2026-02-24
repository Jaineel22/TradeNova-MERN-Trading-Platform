import React from "react";

function RightSection({ imageURL, productName, productDesription, learnMore }) {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-6 p-5">
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "600",
            color: "#1e3c72",
            marginBottom: "1.5rem",
            position: "relative",
            paddingBottom: "15px"
          }}>
            {productName}
            <span style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #1e3c72, #2a5298)",
              borderRadius: "2px"
            }}></span>
          </h1>
          
          <p style={{ 
            fontSize: "1.1rem", 
            lineHeight: "1.8",
            color: "#4a5568",
            marginBottom: "2rem",
            maxWidth: "90%"
          }}>
            {productDesription}
          </p>
          
          <div>
            <a 
              href={learnMore} 
              style={{ 
                textDecoration: "none",
                color: "#2a5298",
                fontWeight: "500",
                fontSize: "1.1rem",
                padding: "12px 24px",
                border: "2px solid #2a5298",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                display: "inline-block"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#2a5298";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#2a5298";
              }}
            >
              Learn More <i className="fa fa-arrow-right" style={{ marginLeft: "8px" }}></i>
            </a>
          </div>

          {/* Feature highlights */}
          <div style={{
            display: "flex",
            gap: "20px",
            marginTop: "2rem",
            padding: "1rem 0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa fa-check-circle" style={{ color: "#4CAF50" }}></i>
              <span style={{ fontSize: "0.95rem", color: "#666" }}>Easy setup</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa fa-clock-o" style={{ color: "#1e3c72" }}></i>
              <span style={{ fontSize: "0.95rem", color: "#666" }}>24/7 support</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa fa-shield" style={{ color: "#2a5298" }}></i>
              <span style={{ fontSize: "0.95rem", color: "#666" }}>Secure</span>
            </div>
          </div>
        </div>
        
        <div className="col-6 p-4">
          <img 
            src={imageURL} 
            alt={productName}
            style={{ 
              width: "100%", 
              borderRadius: "16px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          />
        </div>
      </div>
    </div>
  );
}

export default RightSection;