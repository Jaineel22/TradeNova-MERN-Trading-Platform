import React from "react";

const Apps = () => {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ 
        fontSize: "32px", 
        color: "#333", 
        marginBottom: "30px",
        fontWeight: "500"
      }}>
        Apps
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            style={{
              background: "#f8f9fa",
              borderRadius: "8px",
              padding: "30px 20px",
              border: "1px solid #e9ecef"
            }}
          >
            <div style={{
              width: "50px",
              height: "50px",
              background: "#e9ecef",
              borderRadius: "8px",
              marginBottom: "15px"
            }}></div>
            <h3 style={{ 
              fontSize: "18px", 
              color: "#333", 
              marginBottom: "8px",
              fontWeight: "500"
            }}>
              App {item}
            </h3>
            <p style={{ 
              fontSize: "14px", 
              color: "#666", 
              margin: 0,
              lineHeight: "1.5"
            }}>
              Description for app {item}. This is just placeholder content.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apps;