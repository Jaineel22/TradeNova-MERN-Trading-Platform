import React from "react";
import { Container, Typography } from "@mui/material";

const SupportPage = () => (
  <Container maxWidth="md" sx={{ py: 8 }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Support</Typography>
    <Typography color="text.secondary" sx={{ mb: 1 }}>
      TradeNova is a portfolio project. For questions about how it works, reach out to the developer directly.
    </Typography>
    <Typography color="text.secondary">Email: support@tradenova.example</Typography>
  </Container>
);

export default SupportPage;
