import React, { useState, useContext, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Alert, Stack, Box, CircularProgress, IconButton, Chip, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import GeneralContext from "./GeneralContext";
import apiClient from "../config/apiClient";

// Orders always execute at the live market price fetched here - the backend
// independently re-fetches it at execution time and is the final authority,
// so this is a display estimate only, never sent as the trade price.
const BuyActionWindow = ({ uid }) => {
  const { closeBuyWindow } = useContext(GeneralContext);
  const [qty, setQty] = useState(1);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let mounted = true;
    setQuoteLoading(true);
    setQuoteError("");
    apiClient
      .get(`/quote/${uid}`)
      .then((res) => {
        if (mounted) setQuote(res.data);
      })
      .catch((err) => {
        if (mounted && err.response?.status !== 401) {
          setQuoteError(err.response?.data?.message || "Failed to load current price.");
        }
      })
      .finally(() => {
        if (mounted) setQuoteLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [uid]);

  const placeOrder = async (mode) => {
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await apiClient.post("/newOrder", {
        name: uid,
        qty: Number(qty),
        mode,
      });
      setFeedback({ type: "success", message: res.data.message });
      setTimeout(() => closeBuyWindow(true), 900);
    } catch (err) {
      if (err.response?.status !== 401) {
        setFeedback({ type: "error", message: err.response?.data?.message || "Order failed." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const price = quote?.price ?? null;
  const total = price !== null ? (Number(qty) || 0) * price : null;
  const canSubmit = !submitting && !quoteLoading && price !== null && Number(qty) > 0 && Number.isInteger(Number(qty));
  const step = (delta) => setQty((q) => Math.max(1, (Number(q) || 0) + delta));

  return (
    <Dialog open onClose={() => closeBuyWindow(false)} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Box>
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>{uid}</Typography>
          <Typography component="div" variant="body2" color="text.secondary">Place a paper trade</Typography>
        </Box>
        <Chip
          size="small"
          icon={<ScienceOutlinedIcon sx={{ fontSize: "14px !important" }} />}
          label="Simulated"
          variant="outlined"
          color="secondary"
        />
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">Market price</Typography>
            {quoteLoading ? (
              <CircularProgress size={14} />
            ) : (
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{price !== null ? `₹${price.toFixed(2)}` : "--"}</Typography>
            )}
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>Quantity</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                size="small"
                aria-label="Decrease quantity"
                onClick={() => step(-1)}
                disabled={submitting || Number(qty) <= 1}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <TextField
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                inputProps={{ min: 1, step: 1, style: { textAlign: "center", fontWeight: 700 } }}
                size="small"
                disabled={submitting}
                sx={{ width: 96 }}
              />
              <IconButton
                size="small"
                aria-label="Increase quantity"
                onClick={() => step(1)}
                disabled={submitting}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1.25,
              borderRadius: 2,
              bgcolor: "rgba(30,60,114,0.05)",
            }}
          >
            <Typography variant="body2" color="text.secondary">Estimated total</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{total !== null ? `₹${total.toFixed(2)}` : "--"}</Typography>
          </Box>

          {quoteError && <Alert severity="warning">{quoteError}</Alert>}
          {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, gap: 1 }}>
        <Button onClick={() => closeBuyWindow(false)} disabled={submitting} color="inherit">Cancel</Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<TrendingDownIcon />}
          onClick={() => placeOrder("SELL")}
          disabled={!canSubmit}
          sx={{ flex: 1 }}
        >
          {submitting ? "Placing..." : "Sell"}
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<TrendingUpIcon />}
          onClick={() => placeOrder("BUY")}
          disabled={!canSubmit}
          sx={{ flex: 1 }}
        >
          {submitting ? "Placing..." : "Buy"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuyActionWindow;
