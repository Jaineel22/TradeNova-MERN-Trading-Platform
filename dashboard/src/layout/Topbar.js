import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Box, Avatar, Menu, MenuItem, Chip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import apiClient from "../config/apiClient";

const TICKER_SYMBOLS = ["AAPL", "MSFT"];

const Topbar = ({ onMenuClick, showMenuButton }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled(TICKER_SYMBOLS.map((s) => apiClient.get(`/quote/${s}`))).then((results) => {
      if (!mounted) return;
      setQuotes(results.filter((r) => r.status === "fulfilled").map((r) => r.value.data));
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #EAECF0", background: "#fff" }}>
      <Toolbar sx={{ gap: 2 }}>
        {showMenuButton && (
          <IconButton onClick={onMenuClick} edge="start">
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", flexGrow: 1 }}>
          {quotes.length === 0 ? null : quotes.map((q) => (
            <Chip
              key={q.symbol}
              size="small"
              label={`${q.symbol}  ${q.price.toFixed(2)}  ${q.changePercent >= 0 ? "+" : ""}${q.changePercent.toFixed(2)}%`}
              sx={{
                background: q.changePercent >= 0 ? "rgba(29,185,84,0.1)" : "rgba(229,72,77,0.1)",
                color: q.changePercent >= 0 ? "#1DB954" : "#E5484D",
              }}
            />
          ))}
        </Box>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#1E3C72", fontSize: 14 }}>U</Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
