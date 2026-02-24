import React from "react";

function Hero() {
  return (
    <div className="container">
      {/* Header Section */}
      <div className="row text-center py-5 mt-5">
        <div className="col-12">
          <span
            style={{
              display: "inline-block",
              padding: "5px 15px",
              background: "#e8f0fe",
              color: "#0d6efd",
              borderRadius: "20px",
              fontSize: "0.9rem",
              fontWeight: "500",
              marginBottom: "1rem"
            }}
          >
            Welcome to the future
          </span>
          
          <h1 className="fw-bold" style={{ 
            fontSize: "3.2rem",
            marginBottom: "1rem"
          }}>
            About <span style={{ color: "#0d6efd" }}>TRADENOVA</span>
          </h1>
          
          <p style={{ 
            color: "#666",
            fontSize: "1.3rem",
            maxWidth: "700px",
            margin: "0 auto"
          }}>
            Built to redefine trading through innovation, transparency, and
            technology.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="row py-5 border-top">
        <div className="col-md-6 px-4 mb-4 mb-md-0">
          <div style={{ paddingRight: "20px" }}>
            <h5 style={{ 
              color: "#0d6efd",
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
              letterSpacing: "1px"
            }}>
              OUR VISION
            </h5>
            
            <p style={{ 
              color: "#4a5568",
              fontSize: "1.1rem",
              lineHeight: "1.8",
              marginBottom: "1.5rem"
            }}>
              TRADENOVA was founded with a bold vision — to simplify investing and
              empower individuals with institutional-grade tools.
            </p>
            
            <p style={{ 
              color: "#4a5568",
              fontSize: "1.1rem",
              lineHeight: "1.8",
              marginBottom: "1.5rem"
            }}>
              We are focused on delivering lightning-fast execution, powerful
              analytics, and seamless trading experiences.
            </p>
            
            <p style={{ 
              color: "#4a5568",
              fontSize: "1.1rem",
              lineHeight: "1.8",
              marginBottom: 0
            }}>
              Our mission is to remove complexity from the markets and make
              financial growth accessible to everyone.
            </p>
          </div>
        </div>

        <div className="col-md-6 px-4">
          <div style={{ paddingLeft: "20px" }}>
            <h5 style={{ 
              color: "#0d6efd",
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
              letterSpacing: "1px"
            }}>
              OUR PROMISE
            </h5>
            
            <p style={{ 
              color: "#4a5568",
              fontSize: "1.1rem",
              lineHeight: "1.8",
              marginBottom: "1.5rem"
            }}>
              Built using modern fintech architecture, TRADENOVA combines speed,
              security, and simplicity in one platform.
            </p>
            
            <p style={{ 
              color: "#4a5568",
              fontSize: "1.1rem",
              lineHeight: "1.8",
              marginBottom: "1.5rem"
            }}>
              We continuously innovate to ensure traders get an edge with data,
              technology, and transparency.
            </p>
            
            <p style={{ 
              color: "#0d6efd",
              fontSize: "1.2rem",
              fontWeight: "500",
              lineHeight: "1.8",
              marginBottom: 0,
              borderLeft: "4px solid #0d6efd",
              paddingLeft: "20px",
              fontStyle: "italic"
            }}>
              This is not just a platform — it's a financial revolution.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row py-5 text-center border-top">
        <div className="col-md-3 col-6 mb-3 mb-md-0">
          <h3 style={{ color: "#0d6efd", fontWeight: "700", fontSize: "2rem" }}>10L+</h3>
          <p style={{ color: "#666" }}>Active Traders</p>
        </div>
        <div className="col-md-3 col-6 mb-3 mb-md-0">
          <h3 style={{ color: "#0d6efd", fontWeight: "700", fontSize: "2rem" }}>₹0</h3>
          <p style={{ color: "#666" }}>Brokerage on Equity</p>
        </div>
        <div className="col-md-3 col-6">
          <h3 style={{ color: "#0d6efd", fontWeight: "700", fontSize: "2rem" }}>24/7</h3>
          <p style={{ color: "#666" }}>Customer Support</p>
        </div>
        <div className="col-md-3 col-6">
          <h3 style={{ color: "#0d6efd", fontWeight: "700", fontSize: "2rem" }}>4.8★</h3>
          <p style={{ color: "#666" }}>App Store Rating</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;