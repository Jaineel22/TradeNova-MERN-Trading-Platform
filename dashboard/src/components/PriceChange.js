import React from "react";
import { Chip, Stack, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// Single source of truth for "±value (±percent%)" styling used across
// quotes, watchlist, holdings, orders and the dashboard - so the same number
// never renders three different ways in three different places.
const PriceChange = ({ value, percent, variant = "chip", size = "small" }) => {
  const reference = typeof percent === "number" ? percent : value;
  const isNegative = typeof reference === "number" && reference < 0;
  const Icon = isNegative ? TrendingDownIcon : TrendingUpIcon;

  const parts = [];
  if (typeof value === "number") parts.push(`${value >= 0 ? "+" : ""}${value.toFixed(2)}`);
  if (typeof percent === "number") parts.push(`(${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%)`);
  const label = parts.length ? parts.join(" ") : "--";
  const color = isNegative ? "error" : "success";

  if (variant === "text") {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: `${color}.main` }}>
        <Icon sx={{ fontSize: 16 }} />
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{label}</Typography>
      </Stack>
    );
  }

  return <Chip size={size} icon={<Icon />} label={label} color={color} variant="outlined" />;
};

export default PriceChange;
