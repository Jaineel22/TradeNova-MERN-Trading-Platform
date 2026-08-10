import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";

const SectionCard = ({ title, action, children, contentSx, ...cardProps }) => (
  <Card {...cardProps}>
    <CardContent sx={contentSx}>
      {(title || action) && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, gap: 1 }}>
          {title && <Typography variant="subtitle1">{title}</Typography>}
          {action}
        </Box>
      )}
      {children}
    </CardContent>
  </Card>
);

export default SectionCard;
