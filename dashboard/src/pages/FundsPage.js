import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid, Divider } from "@mui/material";
import apiClient from "../config/apiClient";
import { LoadingState, ErrorState } from "../components/StateMessage";

const money = (n) => `₹${(Number(n) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const FundsPage = () => {
  const [funds, setFunds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setFunds((await apiClient.get("/funds")).data);
    } catch (err) {
      if (err.response?.status !== 401) setError(err.response?.data?.message || "Failed to load funds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Funds</Typography>
      <Card sx={{ maxWidth: 480 }}>
        <CardContent>
          {loading ? (
            <LoadingState label="Loading funds..." />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Available balance</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>{money(funds?.balance)}</Typography>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Invested value</Typography>
                <Typography variant="h6">{money(funds?.investedValue)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Total account value</Typography>
                <Typography variant="h6">{money(funds?.totalAccountValue)}</Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FundsPage;
