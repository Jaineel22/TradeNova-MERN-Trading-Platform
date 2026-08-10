import React from "react";
import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import PriceChange from "./PriceChange";
import { displaySymbol } from "../utils/symbol";

const formatTimestamp = (iso) => {
  if (!iso) return "--";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const QuoteCard = ({ quote, action }) => {
  if (!quote) return null;

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

        <Box sx={{ mt: 2.5 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1.15 }}>₹{quote.price.toFixed(2)}</Typography>
          <Box sx={{ mt: 1 }}>
            <PriceChange value={quote.change} percent={quote.changePercent} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
