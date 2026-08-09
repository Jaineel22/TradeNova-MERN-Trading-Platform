import React from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

const ITEMS = [
  { t: "Portfolio dashboard", d: "Real-time balance, P&L, and allocation, computed from your actual paper trades." },
  { t: "Watchlist", d: "Track symbols with live quotes and place trades directly from the list." },
  { t: "AI assistant", d: "Ask natural-language questions about your holdings and balance, answered from your real account data." },
];

const ProductPage = () => (
  <Container maxWidth="md" sx={{ py: 8 }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>Product</Typography>
    <Grid container spacing={3}>
      {ITEMS.map((i) => (
        <Grid item xs={12} md={4} key={i.t}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{i.t}</Typography>
              <Typography color="text.secondary" variant="body2">{i.d}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default ProductPage;
