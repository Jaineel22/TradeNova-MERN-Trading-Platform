import React from "react";

function Hero() {
  return (
    <div className="container border-bottom mb-5">
      <div className="text-center mt-5 p-5">
        <h1 style={{ 
          fontSize: "3.5rem", 
          fontWeight: "600",
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem"
        }}>
          Technology
        </h1>
        
        <h3 className="text-muted mt-3" style={{ 
          fontSize: "1.8rem", 
          fontWeight: "300",
          letterSpacing: "1px"
        }}>
          Sleek, modern and intuitive trading platforms
        </h3>
        
        <p className="mt-4 mb-5" style={{ fontSize: "1.2rem" }}>
          Check out our{" "}
          <a 
            href="" 
            style={{ 
              textDecoration: "none",
              color: "#1e3c72",
              fontWeight: "500",
              position: "relative",
              padding: "0.5rem 1rem",
              transition: "all 0.3s ease",
              display: "inline-block"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateX(5px)";
              e.target.style.color = "#2a5298";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateX(0)";
              e.target.style.color = "#1e3c72";
            }}
          >
            investment offerings 
            <i 
              className="fa fa-long-arrow-right" 
              aria-hidden="true"
              style={{ 
                marginLeft: "8px",
                transition: "transform 0.3s ease"
              }}
            ></i>
          </a>
        </p>

        {/* Optional: Add feature highlights */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "3rem",
          marginTop: "3rem",
          flexWrap: "wrap"
        }}>
          {[
            { icon: "fa-bolt", text: "Lightning Fast" },
            { icon: "fa-shield", text: "Secure" },
            { icon: "fa-mobile", text: "Mobile Ready" }
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#666",
                fontSize: "1rem"
              }}
            >
              <i className={`fa ${feature.icon}`} style={{ color: "#1e3c72" }}></i>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;