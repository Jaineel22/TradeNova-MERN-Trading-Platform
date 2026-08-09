import React from "react";
import { NavLink } from "react-router-dom";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: <SpaceDashboardOutlinedIcon />, end: true },
  { label: "Markets", to: "/dashboard/markets", icon: <ShowChartOutlinedIcon /> },
  { label: "Orders", to: "/dashboard/orders", icon: <ReceiptLongOutlinedIcon /> },
  { label: "Holdings", to: "/dashboard/holdings", icon: <AccountBalanceWalletOutlinedIcon /> },
  { label: "Positions", to: "/dashboard/positions", icon: <TrendingUpOutlinedIcon /> },
  { label: "Funds", to: "/dashboard/funds", icon: <PaidOutlinedIcon /> },
  { label: "Watchlist", to: "/dashboard/watchlist", icon: <VisibilityOutlinedIcon /> },
  { label: "AI Assistant", to: "/dashboard/assistant", icon: <SmartToyOutlinedIcon /> },
];

const Sidebar = ({ onNavigate }) => (
  <Box sx={{ height: "100%", display: "flex", flexDirection: "column", background: "#0F1B33", color: "#fff" }}>
    <Box sx={{ px: 3, py: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
        Trade<Box component="span" sx={{ color: "#00C896" }}>Nova</Box>
      </Typography>
    </Box>

    <List sx={{ px: 1.5, flex: 1 }}>
      {NAV_ITEMS.map((item) => (
        <ListItemButton
          key={item.to}
          component={NavLink}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            color: "rgba(255,255,255,0.72)",
            "&:hover": { background: "rgba(255,255,255,0.06)" },
          }}
          style={({ isActive }) =>
            isActive ? { background: "rgba(0,200,150,0.14)", color: "#fff" } : undefined
          }
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
        </ListItemButton>
      ))}
    </List>

    <Box sx={{ px: 3, py: 2, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
      Paper trading · simulated funds
    </Box>
  </Box>
);

export default Sidebar;
