import React, { useState, useContext, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Alert, Stack, Box, CircularProgress } from "@mui/material";
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

  return (
    <Dialog open onClose={() => closeBuyWindow(false)} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {uid} <Typography component="span" variant="body2" color="text.secondary">Buy / Sell</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Quantity"
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            inputProps={{ min: 1, step: 1 }}
            size="small"
            fullWidth
            disabled={submitting}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", px: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Market price</Typography>
            {quoteLoading ? (
              <CircularProgress size={14} />
            ) : (
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{price !== null ? `₹${price.toFixed(2)}` : "--"}</Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", px: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Estimated total</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{total !== null ? `₹${total.toFixed(2)}` : "--"}</Typography>
          </Box>

          {quoteError && <Alert severity="warning">{quoteError}</Alert>}
          {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => closeBuyWindow(false)} disabled={submitting}>Cancel</Button>
        <Button variant="contained" color="error" onClick={() => placeOrder("SELL")} disabled={!canSubmit}>
          {submitting ? "Placing..." : "Sell"}
        </Button>
        <Button variant="contained" color="success" onClick={() => placeOrder("BUY")} disabled={!canSubmit}>
          {submitting ? "Placing..." : "Buy"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuyActionWindow;
