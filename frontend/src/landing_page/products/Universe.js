import React from "react";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "600",
          color: "#1e3c72",
          marginBottom: "1rem"
        }}>
          The TradeNova Universe
        </h1>
        
        <p style={{ 
          fontSize: "1.2rem", 
          color: "#666",
          maxWidth: "700px",
          margin: "0 auto 2rem auto"
        }}>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        {/* Partners Grid */}
        <div className="row mt-4" style={{ marginBottom: "3rem" }}>
          {[
            { img: "smallcaseLogo.png", title: "Thematic investment platform", width: "60%" },
            { img: "streakLogo.png", title: "Algo & strategy platform", width: "25%" },
            { img: "sensibullLogo.svg", title: "Option trading platform", width: "60%" },
            { img: "zerodhaFundhouse.png", title: "Asset management", width: "25%" },
            { img: "goldenpiLogo.png", title: "Bonds Trading platform", width: "60%" },
            { img: "dittoLogo.png", title: "Insurance", width: "25%" }
          ].map((partner, index) => (
            <div key={index} className="col-4 p-4">
              <div style={{
                background: "white",
                padding: "2rem 1rem",
                borderRadius: "12px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 5px 20px rgba(0,0,0,0.05)";
              }}
              >
                <img 
                  src={`media/images/${partner.img}`} 
                  className="img-fluid" 
                  alt={partner.title}
                  style={{ 
                    width: partner.width,
                    marginBottom: "1rem"
                  }}
                />
                <p style={{ 
                  fontSize: "0.95rem", 
                  color: "#666",
                  margin: "0"
                }}>
                  {partner.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Universe;