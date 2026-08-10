import React from "react";
import { NavLink } from "react-router-dom";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Stack } from "@mui/material";
import CandlestickChartRoundedIcon from "@mui/icons-material/CandlestickChartRounded";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: <SpaceDashboardOutlinedIcon fontSize="small" />, end: true },
  { label: "Markets", to: "/dashboard/markets", icon: <ShowChartOutlinedIcon fontSize="small" /> },
  { label: "Orders", to: "/dashboard/orders", icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
  { label: "Holdings", to: "/dashboard/holdings", icon: <AccountBalanceWalletOutlinedIcon fontSize="small" /> },
  { label: "Positions", to: "/dashboard/positions", icon: <TrendingUpOutlinedIcon fontSize="small" /> },
  { label: "Funds", to: "/dashboard/funds", icon: <PaidOutlinedIcon fontSize="small" /> },
  { label: "Watchlist", to: "/dashboard/watchlist", icon: <VisibilityOutlinedIcon fontSize="small" /> },
  { label: "AI Assistant", to: "/dashboard/assistant", icon: <SmartToyOutlinedIcon fontSize="small" /> },
];

const Sidebar = ({ onNavigate }) => (
  <Box
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: (t) => t.custom.navy,
      color: "#fff",
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 2.5, py: 2.75 }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "9px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #00C896 0%, #00A67D 100%)",
          color: "#0B1626",
          flexShrink: 0,
        }}
      >
        <CandlestickChartRoundedIcon sx={{ fontSize: 19 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.2, lineHeight: 1 }}>
        Trade<Box component="span" sx={{ color: "secondary.main" }}>Nova</Box>
      </Typography>
    </Stack>

    <List sx={{ px: 1.5, flex: 1, overflowY: "auto" }}>
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
            color: "rgba(255,255,255,0.68)",
            transition: "background-color 0.15s ease, color 0.15s ease",
            "&:hover": { background: "rgba(255,255,255,0.06)", color: "#fff" },
          }}
          style={({ isActive }) => ({
            background: isActive ? "rgba(0,200,150,0.14)" : undefined,
            color: isActive ? "#fff" : undefined,
            borderLeft: isActive ? "3px solid #00C896" : "3px solid transparent",
            paddingLeft: 9,
          })}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13.5, fontWeight: 600 }} />
        </ListItemButton>
      ))}
    </List>

    <Box
      sx={{
        mx: 2,
        mb: 2,
        px: 1.5,
        py: 1.25,
        borderRadius: 2,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: "secondary.main", textTransform: "uppercase" }}>
        Paper Trading
      </Typography>
      <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.45)", mt: 0.25 }}>
        Simulated funds · real market data
      </Typography>
    </Box>
  </Box>
);

export default Sidebar;
