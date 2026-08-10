import React from "react";
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Stack } from "@mui/material";

const ARCHITECTURE = [
  { layer: "Frontend", detail: "React (Create React App) + MUI, one React Router tree covering both the public site and the authenticated trading app." },
  { layer: "Backend", detail: "Node.js + Express REST API, JWT-authenticated, MongoDB (Mongoose) for users, orders, holdings and watchlists." },
  { layer: "Market data", detail: "Yahoo Finance via yahoo-finance2 — live quotes and historical price charts, with NSE resolution for bare Indian symbols." },
  { layer: "AI assistant", detail: "Google Gemini (gemini-2.5-flash), grounded in the authenticated user's live portfolio data." },
];

const AboutPage = () => (
  <Box>
    <Box sx={{ background: "linear-gradient(180deg,#0B1626 0%,#152648 100%)", color: "#fff", py: { xs: 6, md: 8 } }}>
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: "2rem", md: "2.75rem" } }}>About TradeNova</Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, color: "rgba(255,255,255,0.75)", maxWidth: 640, mx: "auto" }}>
          A full-stack paper-trading platform, built to practice the mechanics of trading and portfolio management
          without financial risk.
        </Typography>
      </Container>
    </Box>

    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>What it is</Typography>
      <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
        TradeNova is a paper-trading simulator. Every account opens with ₹1,00,000 in simulated capital. Orders execute
        at real, live market prices pulled from Yahoo Finance, and every trade updates your balance, holdings and
        portfolio value exactly as a real brokerage would — except no real money ever changes hands.
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 5, lineHeight: 1.8 }}>
        It exists to make the mechanics of investing tangible: what a buy order actually does to your balance and
        average cost, how a portfolio's P&L moves with the market, and how to read a watchlist or a price chart —
        without the cost of getting it wrong on a real account.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Why paper trading</Typography>
      <Typography color="text.secondary" sx={{ mb: 5, lineHeight: 1.8 }}>
        Learning to trade by reading about it is different from watching your own simulated balance move after you
        place an order. Paper trading closes that gap: real market data and real order-execution logic, with the
        downside removed. TradeNova is not connected to any brokerage and never executes a real trade.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Architecture</Typography>
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {ARCHITECTURE.map((a) => (
          <Grid item xs={12} sm={6} key={a.layer}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{a.layer}</Typography>
                <Typography variant="body2" color="text.secondary">{a.detail}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Technology</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {["React", "React Router", "MUI", "Chart.js", "Node.js", "Express", "MongoDB", "Mongoose", "JWT", "yahoo-finance2", "Google Gemini API"].map((t) => (
          <Chip key={t} label={t} variant="outlined" />
        ))}
      </Stack>
    </Container>
  </Box>
);

export default AboutPage;
