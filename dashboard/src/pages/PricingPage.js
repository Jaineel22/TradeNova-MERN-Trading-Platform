import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Container, Typography, Card, CardContent, Button } from "@mui/material";

const PricingPage = () => (
  <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Pricing</Typography>
    <Typography color="text.secondary" sx={{ mb: 4 }}>
      TradeNova is a free, paper-trading educational tool. No subscriptions, no hidden fees — it's not connected to
      real brokerage accounts.
    </Typography>
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>₹0</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>forever, for learning</Typography>
        <Button component={RouterLink} to="/signup" variant="contained" size="large">Create free account</Button>
      </CardContent>
    </Card>
  </Container>
);

export default PricingPage;
