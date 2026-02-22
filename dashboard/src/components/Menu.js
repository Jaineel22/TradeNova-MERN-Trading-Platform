import React, { useState } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 30px",
      background: "white",
      borderBottom: "1px solid #e0e0e0",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <img 
        src="media1/tradenova_logo.png" 
        alt="TradeNova" 
        style={{ width: "120px" }} 
      />

      {/* Menus */}
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <ul style={{
          display: "flex",
          listStyle: "none",
          margin: 0,
          padding: 0,
          gap: "25px"
        }}>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}
                 style={{
                   color: selectedMenu === 0 ? "#1e3c72" : "#666",
                   fontWeight: selectedMenu === 0 ? "600" : "400",
                   fontSize: "14px",
                   margin: 0,
                   padding: "5px 0",
                   borderBottom: selectedMenu === 0 ? "2px solid #1e3c72" : "none",
                   transition: "all 0.3s ease"
                 }}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}
                 style={{
                   color: selectedMenu === 1 ? "#1e3c72" : "#666",
                   fontWeight: selectedMenu === 1 ? "600" : "400",
                   fontSize: "14px",
                   margin: 0,
                   padding: "5px 0",
                   borderBottom: selectedMenu === 1 ? "2px solid #1e3c72" : "none",
                   transition: "all 0.3s ease"
                 }}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}
                 style={{
                   color: selectedMenu === 2 ? "#1e3c72" : "#666",
                   fontWeight: selectedMenu === 2 ? "600" : "400",
                   fontSize: "14px",
                   margin: 0,
                   padding: "5px 0",
                   borderBottom: selectedMenu === 2 ? "2px solid #1e3c72" : "none",
                   transition: "all 0.3s ease"
                 }}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}
                 style={{
                   color: selectedMenu === 3 ? "#1e3c72" : "#666",
                   fontWeight: selectedMenu === 3 ? "600" : "400",
                   fontSize: "14px",
                   margin: 0,
                   padding: "5px 0",
                   borderBottom: selectedMenu === 3 ? "2px solid #1e3c72" : "none",
                   transition: "all 0.3s ease"
                 }}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}
                 style={{
                   color: selectedMenu === 4 ? "#1e3c72" : "#666",
                   fontWeight: selectedMenu === 4 ? "600" : "400",
                   fontSize: "14px",
                   margin: 0,
                   padding: "5px 0",
                   borderBottom: selectedMenu === 4 ? "2px solid #1e3c72" : "none",
                   transition: "all 0.3s ease"
                 }}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(5)}
            >
              <p className={selectedMenu === 5 ? activeMenuClass : menuClass}
                 style={{
                   color: selectedMenu === 5 ? "#1e3c72" : "#666",
                   fontWeight: selectedMenu === 5 ? "600" : "400",
                   fontSize: "14px",
                   margin: 0,
                   padding: "5px 0",
                   borderBottom: selectedMenu === 5 ? "2px solid #1e3c72" : "none",
                   transition: "all 0.3s ease"
                 }}>
                Apps
              </p>
            </Link>
          </li>
        </ul>

        {/* Profile Section */}
        <div style={{ position: "relative" }}>
          <div 
            onClick={handleProfileClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              padding: "5px 10px",
              borderRadius: "6px",
              transition: "background 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#1e3c72",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              ZU
            </div>
            <span style={{ fontSize: "14px", color: "#333" }}>USERID</span>
            <i className="fa fa-chevron-down" style={{ fontSize: "12px", color: "#999" }}></i>
          </div>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div style={{
              position: "absolute",
              top: "45px",
              right: 0,
              background: "white",
              borderRadius: "6px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
              width: "180px",
              zIndex: 1000
            }}>
              <ul style={{
                listStyle: "none",
                margin: 0,
                padding: "8px 0"
              }}>
                <li style={{ padding: "8px 16px", fontSize: "14px", color: "#333", cursor: "pointer" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  Profile
                </li>
                <li style={{ padding: "8px 16px", fontSize: "14px", color: "#333", cursor: "pointer" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  Settings
                </li>
                <li style={{ padding: "8px 16px", fontSize: "14px", color: "#dc3545", cursor: "pointer" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;