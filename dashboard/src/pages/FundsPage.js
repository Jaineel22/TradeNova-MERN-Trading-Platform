import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, LinearProgress, Stack } from "@mui/material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import apiClient from "../config/apiClient";
import { LoadingState, ErrorState } from "../components/StateMessage";
import PageHeader from "../components/PageHeader";
import MetricCard from "../components/MetricCard";
import SectionCard from "../components/SectionCard";

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

  if (loading) return <LoadingState label="Loading funds..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const total = funds?.totalAccountValue || 0;
  const investedPct = total > 0 ? ((funds.investedValue || 0) / total) * 100 : 0;

  return (
    <Box>
      <PageHeader title="Funds" description="A financial summary of your simulated trading account." />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <MetricCard label="Available balance" value={money(funds?.balance)} icon={<PaidOutlinedIcon fontSize="small" />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard label="Invested value" value={money(funds?.investedValue)} icon={<PieChartOutlineOutlinedIcon fontSize="small" />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard label="Total account value" value={money(funds?.totalAccountValue)} icon={<AccountBalanceOutlinedIcon fontSize="small" />} />
        </Grid>
      </Grid>

      <SectionCard title="Fund allocation">
        <Stack spacing={1} sx={{ mb: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">Invested</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{investedPct.toFixed(1)}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={investedPct}
            sx={{ height: 10, borderRadius: 5, bgcolor: "rgba(30,60,114,0.08)", "& .MuiLinearProgress-bar": { borderRadius: 5, bgcolor: "secondary.main" } }}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {investedPct.toFixed(1)}% of your total account value is currently invested in holdings; the remainder is available cash balance.
        </Typography>
      </SectionCard>
    </Box>
  );
};

export default FundsPage;
