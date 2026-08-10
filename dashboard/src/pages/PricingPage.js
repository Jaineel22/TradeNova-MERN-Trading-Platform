import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Typography, Card, CardContent, Button, List, ListItem, ListItemIcon, ListItemText, Chip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const INCLUDED = [
  "₹1,00,000 in simulated starting capital",
  "Real, live market data (Yahoo Finance)",
  "Unlimited paper trades",
  "Watchlist, portfolio analytics & historical charts",
  "AI portfolio assistant",
];

const PricingPage = () => (
  <Box>
    <Box sx={{ background: "linear-gradient(180deg,#0B1626 0%,#152648 100%)", color: "#fff", py: { xs: 6, md: 8 } }}>
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: "2rem", md: "2.75rem" } }}>Pricing</Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, color: "rgba(255,255,255,0.75)" }}>
          TradeNova is a free, educational paper-trading project — not a commercial brokerage.
        </Typography>
      </Container>
    </Box>

    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
      <Card sx={{ boxShadow: "0 16px 40px rgba(16,24,40,0.10)" }}>
        <CardContent sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}>
          <Chip label="Free, forever" color="secondary" size="small" sx={{ mb: 2 }} />
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>₹0</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>No subscriptions, no hidden fees, no paid tiers.</Typography>

          <List sx={{ textAlign: "left", mb: 3 }}>
            {INCLUDED.map((item) => (
              <ListItem key={item} disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleOutlineIcon sx={{ color: "secondary.main" }} />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Button component={RouterLink} to="/signup" variant="contained" size="large" fullWidth>
            Create free account
          </Button>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, p: 2.5, borderRadius: 2, bgcolor: "background.default", border: "1px solid", borderColor: "divider", display: "flex", gap: 1.5 }}>
        <InfoOutlinedIcon color="action" sx={{ flexShrink: 0, mt: 0.25 }} />
        <Typography variant="body2" color="text.secondary">
          TradeNova does not trade with real money and is not connected to any brokerage or exchange for order
          execution. All balances, holdings and orders are simulated for learning and demonstration purposes only.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default PricingPage;
