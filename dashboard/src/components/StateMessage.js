import React from "react";
import { Box, CircularProgress, Typography, Button, Alert, Skeleton, Stack } from "@mui/material";

export const LoadingState = ({ label = "Loading...", rows }) => {
  if (rows) {
    return (
      <Stack spacing={1} sx={{ py: 0.5 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={44} sx={{ borderRadius: 2 }} />
        ))}
      </Stack>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 6, justifyContent: "center", color: "text.secondary" }}>
      <CircularProgress size={20} />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};

export const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <Box sx={{ py: 2 }}>
    <Alert severity="error" action={onRetry && <Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}>
      {message}
    </Alert>
  </Box>
);

export const EmptyState = ({ icon, title, description, action }) => (
  <Box sx={{ textAlign: "center", py: 6, px: 2, color: "text.secondary" }}>
    {icon && (
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: "rgba(30,60,114,0.06)",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        {icon}
      </Box>
    )}
    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>{title}</Typography>
    {description && (
      <Typography variant="body2" sx={{ mb: action ? 2.5 : 0, maxWidth: 380, mx: "auto" }}>
        {description}
      </Typography>
    )}
    {action}
  </Box>
);
