import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, TextField, List, ListItem, ListItemText, Chip, IconButton, Stack, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import apiClient from "../config/apiClient";
import GeneralContext, { GeneralContextProvider } from "../components/GeneralContext";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";

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
      setWatchlist(res.data.map((i) => ({ name: i.symbol, price: null, percent: "--", isDown: false })));
    } catch (err) {
      if (err.response?.status !== 401) setError(err.response?.data?.message || "Failed to load watchlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    if (e.key !== "Enter") return;
    const symbol = searchValue.trim();
    if (!symbol) return;
    try {
      await apiClient.post("/watchlist", { symbol });
      setSearchValue("");
      let quote = null;
      try {
        quote = (await apiClient.get(`/quote/${symbol}`)).data;
      } catch {
        // live price unavailable - still add the symbol
      }
      setWatchlist((prev) => [
        ...prev,
        {
          name: symbol.toUpperCase(),
          price: quote ? quote.price : null,
          percent: quote ? `${quote.changePercent.toFixed(2)}%` : "--",
          isDown: quote ? quote.changePercent < 0 : false,
        },
      ]);
    } catch (err) {
      if (err.response?.status !== 401) alert(err.response?.data?.message || "Failed to add symbol");
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await apiClient.delete(`/watchlist/${symbol}`);
      setWatchlist((prev) => prev.filter((i) => i.name !== symbol));
    } catch (err) {
      if (err.response?.status !== 401) alert(err.response?.data?.message || "Failed to remove symbol");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Watchlist</Typography>
      <Card>
        <CardContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Search e.g. AAPL, TCS - press Enter to add"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleAdd}
            sx={{ mb: 2 }}
          />
          {loading ? (
            <LoadingState label="Loading watchlist..." />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : watchlist.length === 0 ? (
            <EmptyState title="Your watchlist is empty" description="Search for a symbol above and press Enter to add it." />
          ) : (
            <List disablePadding>
              {watchlist.map((stock) => (
                <ListItem
                  key={stock.name}
                  divider
                  secondaryAction={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        icon={stock.isDown ? <TrendingDownIcon /> : <TrendingUpIcon />}
                        label={stock.percent}
                        color={stock.isDown ? "error" : "success"}
                        variant="outlined"
                      />
                      <IconButton size="small" color="success" onClick={() => openBuyWindow(stock.name)} title="Buy/Sell">
                        <TrendingUpIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleRemove(stock.name)} title="Remove">
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
                        onClick={() => navigate(`/dashboard/market/${stock.name}`)}
                        sx={{ fontWeight: 500 }}
                      >
                        {stock.name}
                      </Link>
                    }
                    secondary={stock.price !== null ? `₹${stock.price}` : "--"}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

const WatchlistPage = () => (
  <GeneralContextProvider>
    <WatchlistInner />
  </GeneralContextProvider>
);

export default WatchlistPage;
