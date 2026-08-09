import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import apiClient from "../config/apiClient";
import QuoteCard from "../components/QuoteCard";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";
import { displaySymbol } from "../utils/symbol";

const EXAMPLE_SYMBOLS = ["TCS", "INFY", "RELIANCE", "HDFCBANK", "ITC", "SBIN", "AAPL", "MSFT", "NVDA"];

const MarketsPage = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const runSearch = async (rawSymbol) => {
    const symbol = rawSymbol.trim().toUpperCase();
    if (!symbol) return;
    setInput(symbol);
    setLoading(true);
    setError("");
    setQuote(null);
    setSearched(true);
    try {
      const res = await apiClient.get(`/quote/${symbol}`);
      setQuote(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || "Failed to fetch a quote for this symbol.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(input);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Markets</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search symbol e.g. TCS, INFY, RELIANCE, AAPL"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{ flex: 1, minWidth: 220 }}
            />
            <Button type="submit" variant="contained" startIcon={<SearchIcon />} disabled={loading}>
              Search
            </Button>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
            {EXAMPLE_SYMBOLS.map((s) => (
              <Chip key={s} label={s} size="small" variant="outlined" onClick={() => runSearch(s)} sx={{ cursor: "pointer" }} />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingState label="Fetching quote..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => runSearch(input)} />
      ) : quote ? (
        <QuoteCard
          quote={quote}
          action={
            <Button variant="outlined" onClick={() => navigate(`/dashboard/market/${displaySymbol(quote.symbol)}`)}>
              View details
            </Button>
          }
        />
      ) : searched ? null : (
        <EmptyState title="Search for a stock" description="Enter a symbol above, or pick one of the examples, to see its live quote." />
      )}
    </Box>
  );
};

export default MarketsPage;
