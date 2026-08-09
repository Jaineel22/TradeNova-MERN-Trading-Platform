import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";

const NotFoundPage = () => (
  <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
    <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>404</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>Page not found.</Typography>
    <Button component={RouterLink} to="/" variant="contained">Go home</Button>
  </Container>
);

export default NotFoundPage;
