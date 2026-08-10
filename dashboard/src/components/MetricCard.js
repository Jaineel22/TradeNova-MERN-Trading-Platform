import React from "react";
import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import PriceChange from "./PriceChange";

const MetricCard = ({ label, value, icon, trendValue, trendPercent, sub, tone }) => {
  const positive = tone === "positive" ? true : tone === "negative" ? false : undefined;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Typography variant="subtitle2">{label}</Typography>
          {icon && (
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(30,60,114,0.08)",
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>

        <Typography
          variant="h4"
          sx={{ mt: 1, color: positive === undefined ? "text.primary" : positive ? "success.main" : "error.main" }}
        >
          {value}
        </Typography>

        {(trendPercent !== undefined || sub) && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75, minHeight: 20 }}>
            {trendPercent !== undefined && <PriceChange value={trendValue} percent={trendPercent} variant="text" />}
            {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
