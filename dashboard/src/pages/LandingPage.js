import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Typography, Button, Grid, Card, CardContent, Stack, Chip } from "@mui/material";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const FEATURES = [
  { icon: <ScienceOutlinedIcon />, title: "Paper trading", desc: "Every account starts with ₹1,00,000 in simulated funds. Buy and sell orders execute at the real market price and update your holdings and balance instantly — zero real-money risk." },
  { icon: <ShowChartOutlinedIcon />, title: "Real market data", desc: "Live quotes and historical price charts sourced from Yahoo Finance, covering NSE-listed Indian stocks, major indices, and global tickers." },
  { icon: <PieChartOutlineOutlinedIcon />, title: "Portfolio analytics", desc: "Live balance, invested value, unrealized P&L, and allocation breakdowns computed directly from your actual paper trades." },
  { icon: <VisibilityOutlinedIcon />, title: "Watchlist", desc: "Track the symbols you care about with live prices, and jump straight into a trade from the list or a stock's detail page." },
  { icon: <SmartToyOutlinedIcon />, title: "AI portfolio assistant", desc: "Ask natural-language questions about your holdings, P&L, or balance. Grounded in your real account data — advisory only, it can't place trades." },
];

const HOW_IT_WORKS = [
  "Market data", "Watchlist / monitoring", "Paper order", "Portfolio update", "Analytics", "AI assistant",
];

const TECH = ["React", "MUI", "Chart.js", "Node.js", "Express", "MongoDB", "JWT auth", "Yahoo Finance", "Google Gemini"];

const LandingPage = () => (
  <Box>
    <Box sx={{ background: "linear-gradient(180deg,#0B1626 0%,#0F1B33 60%,#152648 100%)", color: "#fff", py: { xs: 8, md: 11 } }}>
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Chip
          size="small"
          icon={<ScienceOutlinedIcon sx={{ fontSize: "14px !important" }} />}
          label="Paper trading · simulated funds · real market data"
          variant="outlined"
          color="secondary"
          sx={{ mb: 3 }}
        />
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: "2.25rem", md: "3.25rem" } }}>
          Trade smarter.<br />Learn without the risk.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, mb: 4, color: "rgba(255,255,255,0.75)", maxWidth: 640, mx: "auto" }}>
          TradeNova is a paper-trading platform: real market data, portfolio analytics, a watchlist, simulated buy/sell
          execution, and an AI portfolio assistant — built to practice trading without risking real money.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
          <Button component={RouterLink} to="/signup" variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
            Launch TradeNova
          </Button>
          <Button component={RouterLink} to="/product" size="large" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }} variant="outlined">
            Explore the platform
          </Button>
        </Stack>
      </Container>
    </Box>

    <Container maxWidth="lg" sx={{ mt: { xs: -5, md: -8 }, mb: { xs: 6, md: 8 }, position: "relative", zIndex: 1 }}>
      <Card sx={{ overflow: "hidden", boxShadow: "0 24px 60px rgba(11,22,38,0.25)" }}>
        <Box
          component="img"
          src="/dashboard-preview.png"
          alt="TradeNova portfolio dashboard showing balance, P&L, holdings and allocation"
          sx={{ width: "100%", display: "block" }}
        />
      </Card>
    </Container>

    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Typography variant="overline" color="secondary.dark" sx={{ display: "block", textAlign: "center", mb: 1 }}>What's actually built</Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 5 }}>Everything you'd expect from a trading platform</Typography>
      <Grid container spacing={3}>
        {FEATURES.map((f) => (
          <Grid item xs={12} sm={6} md={4} key={f.title}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(30,60,114,0.08)", color: "primary.main", mb: 1.5 }}>
                  {f.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>

    <Box sx={{ background: "background.default", py: { xs: 6, md: 8 }, borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 5 }}>How it works</Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 1.5, md: 1 }}
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
        >
          {HOW_IT_WORKS.map((step, i) => (
            <React.Fragment key={step}>
              <Chip label={step} sx={{ px: 1.5, py: 2.5, fontWeight: 700, bgcolor: "#fff", border: "1px solid", borderColor: "divider" }} />
              {i < HOW_IT_WORKS.length - 1 && (
                <ArrowForwardIcon sx={{ color: "text.disabled", transform: { xs: "rotate(90deg)", md: "none" } }} />
              )}
            </React.Fragment>
          ))}
        </Stack>
      </Container>
    </Box>

    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, textAlign: "center" }}>
      <Typography variant="overline" color="secondary.dark">Under the hood</Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Built with a standard, real-world stack</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
        {TECH.map((t) => (
          <Chip key={t} label={t} variant="outlined" />
        ))}
      </Stack>
    </Container>

    <Box sx={{ background: "linear-gradient(135deg,#0F1B33,#1E3C72)", color: "#fff", py: { xs: 7, md: 9 } }}>
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Ready to start?</Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.75)", mb: 4 }}>
          Create a free account and get ₹1,00,000 in simulated funds instantly.
        </Typography>
        <Button component={RouterLink} to="/signup" variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
          Start paper trading
        </Button>
      </Container>
    </Box>
  </Box>
);

export default LandingPage;
