import React, { useState } from "react";
import { Outlet, Link as RouterLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, Button, Typography, IconButton, Drawer, List, ListItemButton, ListItemText, Stack, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CandlestickChartRoundedIcon from "@mui/icons-material/CandlestickChartRounded";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Product", to: "/product" },
  { label: "Pricing", to: "/pricing" },
  { label: "Support", to: "/support" },
];

const Brand = () => (
  <Stack direction="row" alignItems="center" spacing={1} component={RouterLink} to="/" sx={{ textDecoration: "none", color: "inherit" }}>
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #00C896 0%, #00A67D 100%)",
        color: "#0B1626",
        flexShrink: 0,
      }}
    >
      <CandlestickChartRoundedIcon sx={{ fontSize: 17 }} />
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
      Trade<Box component="span" sx={{ color: "secondary.main" }}>Nova</Box>
    </Typography>
  </Stack>
);

const PublicLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLaunch = () => navigate(isAuthenticated ? "/dashboard" : "/login");
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider", background: "#fff" }}>
        <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%", gap: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Brand />
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, mr: 2 }}>
            {NAV_LINKS.map((link) => (
              <Button key={link.to} component={RouterLink} to={link.to} color="inherit" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {link.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            {isAuthenticated ? (
              <>
                <Button onClick={handleLogout} color="inherit">Logout</Button>
                <Button variant="contained" onClick={handleLaunch}>Go to Dashboard</Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color="inherit">Login</Button>
                <Button component={RouterLink} to="/signup" variant="contained">Launch App</Button>
              </>
            )}
          </Box>

          <IconButton
            edge="end"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }} role="presentation">
          <Box sx={{ px: 2, pb: 1 }}>
            <Brand />
          </Box>
          <List sx={{ px: 1 }}>
            {NAV_LINKS.map((link) => (
              <ListItemButton key={link.to} component={RouterLink} to={link.to} onClick={() => setMobileOpen(false)}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
            {isAuthenticated ? (
              <>
                <Button variant="contained" fullWidth onClick={() => { setMobileOpen(false); handleLaunch(); }}>Go to Dashboard</Button>
                <Button fullWidth onClick={() => { setMobileOpen(false); handleLogout(); }}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="contained" fullWidth component={RouterLink} to="/signup" onClick={() => setMobileOpen(false)}>Launch App</Button>
                <Button fullWidth component={RouterLink} to="/login" onClick={() => setMobileOpen(false)}>Login</Button>
              </>
            )}
          </Stack>
        </Box>
      </Drawer>

      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", py: 4, background: "background.default" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", gap: 1.5 }}>
          <Brand />
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: "center", sm: "right" } }}>
            TradeNova · paper-trading simulator for learning, not real investing.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PublicLayout;
