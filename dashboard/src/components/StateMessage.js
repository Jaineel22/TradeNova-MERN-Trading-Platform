import React from "react";
import { Box, CircularProgress, Typography, Button, Alert } from "@mui/material";

export const LoadingState = ({ label = "Loading..." }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 6, justifyContent: "center", color: "text.secondary" }}>
    <CircularProgress size={20} />
    <Typography variant="body2">{label}</Typography>
  </Box>
);

export const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <Box sx={{ py: 2 }}>
    <Alert severity="error" action={onRetry && <Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}>
      {message}
    </Alert>
  </Box>
);

export const EmptyState = ({ title, description, action }) => (
  <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}>{title}</Typography>
    {description && <Typography variant="body2" sx={{ mb: 2 }}>{description}</Typography>}
    {action}
  </Box>
);
