import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Link,
  InputAdornment,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import apiClient from "../config/apiClient";
import GeneralContext, { GeneralContextProvider } from "../components/GeneralContext";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";
import PriceChange from "../components/PriceChange";

const fetchQuote = async (symbol) => {
  try {
    const res = await apiClient.get(`/quote/${symbol}`);
    return { price: res.data.price, change: res.data.change, changePercent: res.data.changePercent };
  } catch {
    return { price: null, change: null, changePercent: null };
  }
};

const WatchlistInner = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { openBuyWindow } = useContext(GeneralContext);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get("/watchlist");
      const symbols = res.data.map((i) => i.symbol);
      const quotes = await Promise.all(symbols.map(fetchQuote));
      setWatchlist(symbols.map((symbol, i) => ({ symbol, ...quotes[i] })));
    } catch (err) {
      if (err.response?.status !== 401) setError(err.response?.data?.message || "Failed to load watchlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const refreshQuote = useCallback(async (symbol) => {
    const quote = await fetchQuote(symbol);
    setWatchlist((prev) => prev.map((row) => (row.symbol === symbol ? { ...row, ...quote } : row)));
  }, []);

  const handleAdd = async (e) => {
    if (e.key !== "Enter") return;
    const symbol = searchValue.trim().toUpperCase();
    if (!symbol) return;
    try {
      await apiClient.post("/watchlist", { symbol });
      setSearchValue("");
      const quote = await fetchQuote(symbol);
      setWatchlist((prev) => [...prev, { symbol, ...quote }]);
    } catch (err) {
      if (err.response?.status !== 401) alert(err.response?.data?.message || "Failed to add symbol");
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await apiClient.delete(`/watchlist/${symbol}`);
      setWatchlist((prev) => prev.filter((i) => i.symbol !== symbol));
    } catch (err) {
      if (err.response?.status !== 401) alert(err.response?.data?.message || "Failed to remove symbol");
    }
  };

  return (
    <Box>
      <PageHeader title="Watchlist" description="Track the symbols you care about and jump straight into a trade." />

      <SectionCard>
        <TextField
          fullWidth
          size="small"
          placeholder="Search e.g. AAPL, TCS - press Enter to add"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleAdd}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" color="disabled" /></InputAdornment> }}
          sx={{ mb: watchlist.length || loading || error ? 2 : 0 }}
        />

        {loading ? (
          <LoadingState rows={3} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : watchlist.length === 0 ? (
          <EmptyState
            icon={<VisibilityOutlinedIcon />}
            title="Your watchlist is empty"
            description="Add stocks to quickly monitor prices and start paper trading."
            action={<Button variant="contained" onClick={() => navigate("/dashboard/markets")}>Add your first stock</Button>}
          />
        ) : (
          <List disablePadding>
            {watchlist.map((stock) => (
              <ListItem
                key={stock.symbol}
                divider
                sx={{ px: 0 }}
                secondaryAction={
                  <Stack direction="row" spacing={1} alignItems="center">
                    {stock.price !== null ? (
                      <PriceChange value={stock.change} percent={stock.changePercent} />
                    ) : (
                      <Typography variant="caption" color="text.disabled">price unavailable</Typography>
                    )}
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openBuyWindow(stock.symbol, () => refreshQuote(stock.symbol))}
                      title="Buy/Sell"
                    >
                      <SwapHorizOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleRemove(stock.symbol)} title="Remove">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText
                  primary={
                    <Link
                      component="button"
                      underline="hover"
                      color="inherit"
                      onClick={() => navigate(`/dashboard/market/${stock.symbol}`)}
                      sx={{ fontWeight: 700 }}
                    >
                      {stock.symbol}
                    </Link>
                  }
                  secondary={stock.price !== null ? `₹${stock.price.toFixed(2)}` : "--"}
                />
              </ListItem>
            ))}
          </List>
        )}
      </SectionCard>
    </Box>
  );
};

const WatchlistPage = () => (
  <GeneralContextProvider>
    <WatchlistInner />
  </GeneralContextProvider>
);

export default WatchlistPage;
