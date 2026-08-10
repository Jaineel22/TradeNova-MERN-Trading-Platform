import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Typography, Grid, Card, CardContent, Stack, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const SECTIONS = [
  {
    icon: <PieChartOutlineOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "Portfolio dashboard",
    desc: "A single overview of your simulated account, computed live from your actual trades.",
    points: ["Available balance & total account value", "Portfolio value & unrealized P&L (with %)", "Holdings preview with per-symbol P&L", "Allocation breakdown by current value", "Recent orders feed"],
  },
  {
    icon: <SwapHorizOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "Trading",
    desc: "Buy and sell orders that execute at the live market price — never a price you type in.",
    points: ["Order execution priced server-side from the live quote", "Balance and holding-quantity checks before every order", "Weighted-average cost tracking as you add to a position", "Full order history, newest first", "Holdings table with LTP, current value, P&L and P&L%"],
  },
  {
    icon: <ShowChartOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "Markets & watchlist",
    desc: "Search and monitor real symbols, then trade straight from where you're looking at them.",
    points: ["Live quotes for NSE stocks, indices (NIFTY 50, SENSEX) and global tickers", "Historical price charts with 1D/1W/1M/3M/1Y ranges", "A personal watchlist with live prices on every symbol", "One click from Markets or Watchlist into a trade"],
  },
  {
    icon: <SmartToyOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "AI portfolio assistant",
    desc: "A Gemini-powered assistant grounded in your real account data.",
    points: ["Answers questions about your holdings, balance and P&L", "Reads your actual portfolio state — nothing fabricated", "Advisory only: it cannot place trades on your behalf"],
  },
];

const ProductPage = () => (
  <Box>
    <Box sx={{ background: "linear-gradient(180deg,#0B1626 0%,#152648 100%)", color: "#fff", py: { xs: 6, md: 8 } }}>
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: "2rem", md: "2.75rem" } }}>The product</Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, color: "rgba(255,255,255,0.75)", maxWidth: 640, mx: "auto" }}>
          A full paper-trading workflow: real market data in, simulated trades through, live portfolio analytics and an
          AI assistant out.
        </Typography>
      </Container>
    </Box>

    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Grid container spacing={3}>
        {SECTIONS.map((s) => (
          <Grid item xs={12} md={6} key={s.title}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(30,60,114,0.08)", color: "primary.main" }}>
                    {s.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{s.title}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{s.desc}</Typography>
                <List dense disablePadding>
                  {s.points.map((p) => (
                    <ListItem key={p} disableGutters sx={{ py: 0.4 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ variant: "body2" }} primary={p} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>

    <Box sx={{ background: "background.default", borderTop: "1px solid", borderColor: "divider", py: { xs: 6, md: 7 }, textAlign: "center" }}>
      <Container maxWidth="sm">
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>See it on your own portfolio</Typography>
        <Button component={RouterLink} to="/signup" variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
          Create a free account
        </Button>
      </Container>
    </Box>
  </Box>
);

export default ProductPage;
