import React, { useState } from "react";

function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  const quickLinks = [
    "Track account opening",
    "Track segment activation",
    "Intraday margins",
    "Kite user manual",
    "Fund transfer",
    "Trading holidays"
  ];

  const featuredTopics = [
    {
      title: "Current Takeovers and Delisting - January 2024",
      date: "Updated 2 days ago"
    },
    {
      title: "Latest Intraday leverages - MIS & CO",
      date: "New"
    },
    {
      title: "How to place options trade?",
      date: "Popular"
    },
    {
      title: "Understanding brokerage charges",
      date: "Guide"
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
  };

  return (
    <section
      className="container-fluid text-white"
      style={{ 
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative Elements */}
      <div style={{
        position: "absolute",
        top: "-50%",
        right: "-10%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
        zIndex: 0
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "-30%",
        left: "-5%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.03)",
        zIndex: 0
      }}></div>

      <div className="container py-5" style={{ position: "relative", zIndex: 1 }}>
        {/* Top Row */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h5 className="fw-normal" style={{ 
              fontSize: "1rem",
              letterSpacing: "1px",
              opacity: "0.9"
            }}>
              <i className="fa fa-life-ring me-2"></i>
              Support Portal
            </h5>
          </div>
          <div className="d-flex gap-3">
            <a
              href="#"
              className="text-white"
              style={{ 
                fontSize: "14px",
                textDecoration: "none",
                borderBottom: "1px dashed rgba(255,255,255,0.5)",
                paddingBottom: "2px",
                transition: "border-color 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.borderBottomColor = "white"}
              onMouseLeave={(e) => e.target.style.borderBottomColor = "rgba(255,255,255,0.5)"}
            >
              <i className="fa fa-ticket me-1"></i>
              Track Tickets
            </a>
            <a
              href="#"
              className="text-white"
              style={{ 
                fontSize: "14px",
                textDecoration: "none",
                borderBottom: "1px dashed rgba(255,255,255,0.5)",
                paddingBottom: "2px",
                transition: "border-color 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.borderBottomColor = "white"}
              onMouseLeave={(e) => e.target.style.borderBottomColor = "rgba(255,255,255,0.5)"}
            >
              <i className="fa fa-question-circle me-1"></i>
              Help Center
            </a>
          </div>
        </div>

        {/* Main Row */}
        <div className="row align-items-start g-5">
          {/* Left Section */}
          <div className="col-md-7">
            <h2 style={{ 
              fontSize: "2.2rem",
              fontWeight: "300",
              lineHeight: "1.4",
              marginBottom: "2rem",
              maxWidth: "600px"
            }}>
              Search for an answer or browse help topics
              <span style={{ 
                display: "block",
                fontSize: "1.8rem",
                opacity: "0.9",
                marginTop: "0.5rem"
              }}>
                to create a ticket
              </span>
            </h2>

            {/* Search Box with Icon */}
            <form onSubmit={handleSearch} style={{ position: "relative", maxWidth: "600px" }}>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Eg: how do I activate F&O, why is my order getting rejected..."
                className="form-control p-3 mb-4"
                style={{
                  borderRadius: "50px",
                  border: "none",
                  paddingLeft: "50px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  e.target.style.transform = "scale(1.02)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
                  e.target.style.transform = "scale(1)";
                }}
              />
            </form>

            {/* Popular Searches */}
            <div className="mb-4">
              <small style={{ opacity: "0.8", fontSize: "0.85rem" }}>
                <i className="fa fa-clock-o me-1"></i>
                Popular searches:
              </small>
              <div className="mt-2">
                <span className="badge bg-light text-dark me-2 p-2" style={{ borderRadius: "20px" }}>
                  Account opening
                </span>
                <span className="badge bg-light text-dark me-2 p-2" style={{ borderRadius: "20px" }}>
                  Fund transfer
                </span>
                <span className="badge bg-light text-dark me-2 p-2" style={{ borderRadius: "20px" }}>
                  Kite login
                </span>
                <span className="badge bg-light text-dark p-2" style={{ borderRadius: "20px" }}>
                  Brokerage
                </span>
              </div>
            </div>

            {/* Quick Links Grid */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(2, 1fr)", 
              gap: "10px",
              marginTop: "1.5rem"
            }}>
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-white"
                  style={{ 
                    fontSize: "14px",
                    textDecoration: "none",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.2)";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.1)";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  <i className="fa fa-arrow-right" style={{ fontSize: "12px" }}></i>
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="col-md-5 mt-4 mt-md-0">
            <div style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "2rem",
              backdropFilter: "blur(10px)"
            }}>
              <div className="d-flex align-items-center mb-4">
                <i className="fa fa-star me-2" style={{ color: "#ffd700" }}></i>
                <h4 className="mb-0 fw-normal">Featured Topics</h4>
              </div>

              <ol style={{ 
                lineHeight: "2.2", 
                paddingLeft: "1.2rem",
                marginBottom: "0"
              }}>
                {featuredTopics.map((topic, index) => (
                  <li key={index} style={{ marginBottom: "1rem" }}>
                    <a
                      href="#"
                      className="text-white"
                      style={{ 
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 12px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "8px",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                        e.currentTarget.style.transform = "translateX(5px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <span>{topic.title}</span>
                      <span style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        background: topic.date === "New" ? "#4CAF50" : "rgba(255,255,255,0.2)",
                        borderRadius: "12px",
                        whiteSpace: "nowrap",
                        marginLeft: "10px"
                      }}>
                        {topic.date}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>

              {/* View All Link */}
              <div className="text-center mt-4">
                <a
                  href="#"
                  className="text-white"
                  style={{
                    textDecoration: "none",
                    borderBottom: "1px dashed white",
                    paddingBottom: "2px",
                    fontSize: "0.9rem"
                  }}
                >
                  View all topics <i className="fa fa-arrow-right ms-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="row mt-5 pt-4">
          <div className="col-12">
            <div className="d-flex justify-content-center gap-5">
              {[
                { icon: "fa-clock-o", label: "Avg response time", value: "2 hours" },
                { icon: "fa-check-circle", label: "Issues resolved", value: "98%" },
                { icon: "fa-users", label: "Happy customers", value: "50k+" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <i className={`fa ${stat.icon} mb-2`} style={{ fontSize: "1.5rem", opacity: "0.9" }}></i>
                  <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>{stat.value}</div>
                  <div style={{ fontSize: "0.85rem", opacity: "0.8" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;