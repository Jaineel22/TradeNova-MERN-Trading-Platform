import React from "react";
import { Container, Typography } from "@mui/material";

const AboutPage = () => (
  <Container maxWidth="md" sx={{ py: 8 }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>About TradeNova</Typography>
    <Typography color="text.secondary" sx={{ mb: 2 }}>
      TradeNova is an educational paper-trading platform built to help people practice trading strategies using
      simulated funds and real market quotes, without any real-money risk.
    </Typography>
    <Typography color="text.secondary">
      Every account starts with ₹100,000 in simulated capital. Buy and sell orders update your holdings and paper
      balance instantly, and portfolio values are computed from live quotes where available.
    </Typography>
  </Container>
);

export default AboutPage;
