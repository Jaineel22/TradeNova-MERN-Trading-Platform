import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ = [
  {
    q: "Is this real money?",
    a: "No. Every account starts with ₹1,00,000 in simulated funds. No real money is ever deposited, withdrawn, or traded, and TradeNova is not connected to any brokerage or exchange for order execution.",
  },
  {
    q: "How do I start paper trading?",
    a: "Create a free account from the Sign Up page. You'll land on the Dashboard with your starting balance. Search a symbol in Markets or add one to your Watchlist, open its stock detail page, and use the Trade button to place a simulated buy or sell.",
  },
  {
    q: "How does an order actually execute?",
    a: "When you submit a buy or sell, the backend fetches the live market price at that moment and executes the order at that price — the price shown in the trade dialog is an estimate only, never something you can set yourself. Your balance, holding quantity, and average cost update immediately.",
  },
  {
    q: "Where does the market data come from?",
    a: "Live quotes and historical price charts come from Yahoo Finance, covering NSE-listed Indian stocks and indices (like NIFTY 50 and SENSEX) as well as major global tickers.",
  },
  {
    q: "What can the AI assistant do?",
    a: "The assistant answers natural-language questions about your own portfolio — balance, holdings, P&L — grounded in your real account data. It's advisory only: it cannot place, modify, or cancel trades.",
  },
  {
    q: "Can other users see my portfolio?",
    a: "No. Every account is authenticated with a JWT, and every API request is scoped to the logged-in user — holdings, orders, funds, and watchlist are only ever readable by their owner.",
  },
  {
    q: "What are Holdings vs Positions?",
    a: "Holdings track the delivery-style stocks you currently own. Positions is reserved for intraday-style position tracking, which isn't implemented yet — that page will stay empty until it is.",
  },
];

const SupportPage = () => (
  <Box>
    <Box sx={{ background: "linear-gradient(180deg,#0B1626 0%,#152648 100%)", color: "#fff", py: { xs: 6, md: 8 } }}>
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: "2rem", md: "2.75rem" } }}>Support</Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, color: "rgba(255,255,255,0.75)" }}>
          How TradeNova works, and answers to common questions.
        </Typography>
      </Container>
    </Box>

    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Frequently asked questions</Typography>
      {FAQ.map((item) => (
        <Accordion key={item.q} disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider", "&:before": { display: "none" }, mb: 1, borderRadius: 2, overflow: "hidden" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>{item.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{item.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 5, p: 3, borderRadius: 2, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>About this project</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          TradeNova is an independently built portfolio project, not a company with a support team. For questions
          about how it's implemented, the source code and architecture are the best reference.
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button component={RouterLink} to="/about" variant="outlined" size="small">About TradeNova</Button>
          <Button component={RouterLink} to="/signup" variant="contained" size="small">Try it out</Button>
        </Stack>
      </Box>
    </Container>
  </Box>
);

export default SupportPage;
