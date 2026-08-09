import React from "react";
import { Box, Card, CardContent, Typography, Stack, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { displaySymbol } from "../utils/symbol";

const formatTimestamp = (iso) => {
  if (!iso) return "--";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const QuoteCard = ({ quote, action }) => {
  if (!quote) return null;
  const isDown = quote.changePercent < 0;

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{displaySymbol(quote.symbol)}</Typography>
            <Typography variant="caption" color="text.secondary">As of {formatTimestamp(quote.timestamp)}</Typography>
          </Box>
          {action}
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>₹{quote.price.toFixed(2)}</Typography>
          <Chip
            size="small"
            sx={{ mt: 1 }}
            icon={isDown ? <TrendingDownIcon /> : <TrendingUpIcon />}
            label={`${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)} (${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%)`}
            color={isDown ? "error" : "success"}
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
