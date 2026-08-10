import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Box, Avatar, Menu, MenuItem, Chip, ListItemIcon, Divider, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
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
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider", background: "#fff" }}>
      <Toolbar sx={{ gap: 2, minHeight: { xs: 60, sm: 66 } }}>
        {showMenuButton && (
          <IconButton onClick={onMenuClick} edge="start" size="small">
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", flexGrow: 1, alignItems: "center" }}>
          {quotes.map((q) => {
            const isDown = q.changePercent < 0;
            const Icon = isDown ? TrendingDownIcon : TrendingUpIcon;
            return (
              <Chip
                key={q.symbol}
                size="small"
                variant="outlined"
                icon={<Icon sx={{ fontSize: "14px !important" }} />}
                label={
                  <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 12.5 }}>
                    <Typography component="span" sx={{ fontWeight: 700, fontSize: "inherit" }}>{q.symbol}</Typography>
                    <Typography component="span" sx={{ color: "text.secondary", fontSize: "inherit" }}>{q.price.toFixed(2)}</Typography>
                    <Typography component="span" sx={{ fontWeight: 700, fontSize: "inherit" }}>
                      {q.changePercent >= 0 ? "+" : ""}{q.changePercent.toFixed(2)}%
                    </Typography>
                  </Box>
                }
                sx={{
                  height: 28,
                  borderColor: isDown ? "error.main" : "success.main",
                  color: isDown ? "error.main" : "success.main",
                  bgcolor: isDown ? "rgba(229,72,77,0.06)" : "rgba(29,185,84,0.06)",
                }}
              />
            );
          })}
        </Box>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ p: 0.25 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 14, fontWeight: 700 }}>U</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{ sx: { minWidth: 200, mt: 1 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>My Account</Typography>
            <Typography variant="caption" color="text.secondary">Paper trading account</Typography>
          </Box>
          <Divider />
          <MenuItem disabled>
            <ListItemIcon><PersonOutlineOutlinedIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutOutlinedIcon fontSize="small" color="error" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
