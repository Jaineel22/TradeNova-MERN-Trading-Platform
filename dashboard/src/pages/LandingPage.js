import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Typography, Button, Grid, Card, CardContent } from "@mui/material";

const FEATURES = [
  { title: "Paper trading", desc: "Practice buying and selling with simulated funds — zero real-money risk." },
  { title: "Real market data", desc: "Live quotes power your watchlist and portfolio valuation." },
  { title: "AI portfolio assistant", desc: "Ask questions about your holdings, P&L, and balance, grounded in your real data." },
];

const LandingPage = () => (
  <Box>
    <Box sx={{ background: "linear-gradient(135deg,#0F1B33,#1E3C72)", color: "#fff", py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Learn to trade, risk-free.</Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, mb: 4, color: "rgba(255,255,255,0.8)" }}>
          TradeNova is a paper-trading simulator with real market data, a portfolio dashboard, and an AI assistant.
        </Typography>
        <Button component={RouterLink} to="/signup" variant="contained" size="large" sx={{ background: "#00C896", "&:hover": { background: "#00b285" } }}>
          Get started free
        </Button>
      </Container>
    </Box>

    <Container maxWidth="md" sx={{ py: 8 }}>
      <Grid container spacing={3}>
        {FEATURES.map((f) => (
          <Grid item xs={12} md={4} key={f.title}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default LandingPage;
