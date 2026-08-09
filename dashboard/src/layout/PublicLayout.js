import React from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";

const PublicLayout = () => (
  <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #EAECF0", background: "#fff" }}>
      <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ fontWeight: 700, textDecoration: "none", color: "text.primary", flexGrow: 1 }}>
          Trade<Box component="span" sx={{ color: "#00C896" }}>Nova</Box>
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, mr: 2 }}>
          <Button component={RouterLink} to="/about" color="inherit">About</Button>
          <Button component={RouterLink} to="/product" color="inherit">Product</Button>
          <Button component={RouterLink} to="/pricing" color="inherit">Pricing</Button>
          <Button component={RouterLink} to="/support" color="inherit">Support</Button>
        </Box>
        <Button component={RouterLink} to="/login" sx={{ mr: 1 }}>Login</Button>
        <Button component={RouterLink} to="/signup" variant="contained">Sign up</Button>
      </Toolbar>
    </AppBar>

    <Box sx={{ flex: 1 }}>
      <Outlet />
    </Box>

    <Box sx={{ borderTop: "1px solid #EAECF0", py: 3, textAlign: "center", color: "text.secondary" }}>
      <Typography variant="body2">TradeNova · paper-trading simulator for learning, not real investing.</Typography>
    </Box>
  </Box>
);

export default PublicLayout;
