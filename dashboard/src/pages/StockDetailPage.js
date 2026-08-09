import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Grid, Card, CardContent, Typography, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import apiClient from "../config/apiClient";
import QuoteCard from "../components/QuoteCard";
import PriceHistoryChart from "../components/PriceHistoryChart";
import { LoadingState, ErrorState } from "../components/StateMessage";
import { displaySymbol } from "../utils/symbol";
import GeneralContext, { GeneralContextProvider } from "../components/GeneralContext";

const money = (n) => `₹${(Number(n) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const StockDetailInner = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const bareSymbol = displaySymbol(symbol).toUpperCase();
  const { openBuyWindow } = useContext(GeneralContext);

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistChecked, setWatchlistChecked] = useState(false);
  const [watchlistBusy, setWatchlistBusy] = useState(false);

  const [holding, setHolding] = useState(null);
  const [holdingChecked, setHoldingChecked] = useState(false);

  const loadQuote = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get(`/quote/${symbol}`);
      setQuote(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || "Failed to load this symbol.");
      }
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  const checkWatchlist = useCallback(async () => {
    try {
      const res = await apiClient.get("/watchlist");
      setInWatchlist(res.data.some((i) => i.symbol === bareSymbol));
    } catch {
      // Non-fatal: the Add to Watchlist button just falls back to "not yet added".
    } finally {
      setWatchlistChecked(true);
    }
  }, [bareSymbol]);

  // Reuses portfolio/summary's existing per-holding P&L math instead of
  // recomputing it here.
  const loadHolding = useCallback(async () => {
    try {
      const res = await apiClient.get("/portfolio/summary");
      setHolding(res.data.holdings.find((h) => h.symbol === bareSymbol) || null);
    } catch {
      // Non-fatal: the "You own" panel just stays hidden.
    } finally {
      setHoldingChecked(true);
    }
  }, [bareSymbol]);

  useEffect(() => {
    loadQuote();
    checkWatchlist();
    loadHolding();
  }, [loadQuote, checkWatchlist, loadHolding]);

  const handleAddToWatchlist = async () => {
    setWatchlistBusy(true);
    try {
      await apiClient.post("/watchlist", { symbol: bareSymbol });
      setInWatchlist(true);
    } catch (err) {
      if (err.response?.status !== 401) {
        alert(err.response?.data?.message || "Failed to add to watchlist.");
      }
    } finally {
      setWatchlistBusy(false);
    }
  };

  const handleTrade = () => {
    openBuyWindow(bareSymbol, () => {
      loadQuote();
      loadHolding();
    });
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard/markets")} sx={{ mb: 2 }}>
        Back to Markets
      </Button>

      {loading ? (
        <LoadingState label="Loading quote..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadQuote} />
      ) : quote ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <QuoteCard
              quote={quote}
              action={
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button
                    variant={inWatchlist ? "outlined" : "text"}
                    color={inWatchlist ? "success" : "primary"}
                    startIcon={inWatchlist ? <BookmarkAddedOutlinedIcon /> : <BookmarkAddOutlinedIcon />}
                    onClick={handleAddToWatchlist}
                    disabled={!watchlistChecked || inWatchlist || watchlistBusy}
                  >
                    {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </Button>
                  <Button variant="contained" startIcon={<SwapHorizOutlinedIcon />} onClick={handleTrade}>
                    Trade
                  </Button>
                </Stack>
              }
            />
          </Grid>

          {holdingChecked && holding && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">You own</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{holding.quantity} shares</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Avg. cost</Typography>
                    <Typography variant="h6">{money(holding.averagePrice)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Current value</Typography>
                    <Typography variant="h6">{money(holding.currentValue)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">P&L</Typography>
                    <Typography variant="h6" sx={{ color: holding.pnl >= 0 ? "success.main" : "error.main" }}>
                      {holding.pnl >= 0 ? "+" : ""}{money(holding.pnl)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          <Grid item xs={12}>
            <PriceHistoryChart symbol={bareSymbol} />
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
};

const StockDetailPage = () => (
  <GeneralContextProvider>
    <StockDetailInner />
  </GeneralContextProvider>
);

export default StockDetailPage;
