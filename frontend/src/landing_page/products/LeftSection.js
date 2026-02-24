import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDesription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-6 p-4">
          <img 
            src={imageURL} 
            alt={productName}
            style={{ 
              width: "90%", 
              borderRadius: "12px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          />
        </div>
        
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
            marginBottom: "2rem"
          }}>
            {productDesription}
          </p>
          
          <div style={{ marginBottom: "2rem" }}>
            <a 
              href={tryDemo} 
              style={{ 
                textDecoration: "none",
                color: "#1e3c72",
                fontWeight: "500",
                padding: "10px 20px",
                border: "2px solid #1e3c72",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                display: "inline-block"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#1e3c72";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#1e3c72";
              }}
            >
              Try Demo <i className="fa fa-play-circle" style={{ marginLeft: "8px" }}></i>
            </a>
            
            <a 
              href={learnMore} 
              style={{ 
                textDecoration: "none",
                color: "#2a5298",
                fontWeight: "500",
                marginLeft: "20px",
                padding: "10px 20px",
                borderBottom: "2px solid transparent",
                transition: "all 0.3s ease",
                display: "inline-block"
              }}
              onMouseEnter={(e) => {
                e.target.style.borderBottomColor = "#2a5298";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderBottomColor = "transparent";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Learn More <i className="fa fa-arrow-right" style={{ marginLeft: "8px" }}></i>
            </a>
          </div>
          
          <div style={{ 
            display: "flex", 
            gap: "20px",
            alignItems: "center",
            marginTop: "1rem"
          }}>
            <a 
              href={googlePlay}
              style={{
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              <img 
                src="media/images/googlePlayBadge.svg" 
                alt="Get it on Google Play"
                style={{ height: "45px" }}
              />
            </a>
            
            <a 
              href={appStore}
              style={{
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              <img 
                src="media/images/appstoreBadge.svg" 
                alt="Download on App Store"
                style={{ height: "45px" }}
              />
            </a>
          </div>
          
          {/* Trust indicators */}
          <div style={{
            display: "flex",
            gap: "20px",
            marginTop: "2rem",
            padding: "1rem 0",
            borderTop: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa fa-star" style={{ color: "#fbbf24" }}></i>
              <span style={{ fontSize: "0.9rem", color: "#718096" }}>4.8/5 Rating</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa fa-users" style={{ color: "#1e3c72" }}></i>
              <span style={{ fontSize: "0.9rem", color: "#718096" }}>10k+ Users</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa fa-shield" style={{ color: "#2a5298" }}></i>
              <span style={{ fontSize: "0.9rem", color: "#718096" }}>Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;