import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Stack, Chip, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import apiClient from "../config/apiClient";
import QuoteCard from "../components/QuoteCard";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";
import { displaySymbol } from "../utils/symbol";

const INDEX_SYMBOLS = [
  { label: "NIFTY 50", symbol: "^NSEI" },
  { label: "SENSEX", symbol: "^BSESN" },
];
const STOCK_SYMBOLS = ["TCS", "INFY", "RELIANCE", "HDFCBANK", "ITC", "SBIN", "AAPL", "MSFT", "NVDA"];

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
      <PageHeader title="Markets" description="Search any NSE or global symbol for a live quote, backed by real Yahoo Finance data." />

      <SectionCard sx={{ mb: 3 }}>
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

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, mb: 0.75 }}>
          Indices
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
          {INDEX_SYMBOLS.map((idx) => (
            <Chip
              key={idx.symbol}
              label={idx.label}
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => runSearch(idx.symbol)}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
          Popular symbols
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {STOCK_SYMBOLS.map((s) => (
            <Chip key={s} label={s} size="small" variant="outlined" onClick={() => runSearch(s)} sx={{ cursor: "pointer" }} />
          ))}
        </Stack>
      </SectionCard>

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
        <EmptyState
          icon={<TravelExploreOutlinedIcon />}
          title="Search for a stock"
          description="Enter a symbol above, or pick one of the examples, to see its live quote."
        />
      )}
    </Box>
  );
};

export default MarketsPage;
