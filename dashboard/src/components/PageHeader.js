import React from "react";
import { Box, Typography, Stack } from "@mui/material";

const PageHeader = ({ title, description, actions }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", sm: "center" }}
    spacing={1.5}
    sx={{ mb: 3 }}
  >
    <Box>
      <Typography variant="h5">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {description}
        </Typography>
      )}
    </Box>
    {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
  </Stack>
);

export default PageHeader;
