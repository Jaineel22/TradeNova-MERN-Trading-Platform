import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Chip, Table, TableHead, TableRow, TableCell, TableBody, Button, Stack } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import apiClient from "../config/apiClient";
import { DoughnutChart } from "../components/DoughnoutChart";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";
import MetricCard from "../components/MetricCard";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";

const money = (n) => `₹${(Number(n) || 0).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;

const ALLOCATION_COLORS = ["#1E3C72", "#00C896", "#F59E0B", "#E5484D", "#7C5CFC", "#17A2B8"];

const DashboardHome = () => {
  const navigate = useNavigate();
  const [funds, setFunds] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [fundsRes, portfolioRes, ordersRes] = await Promise.all([
        apiClient.get("/funds"),
        apiClient.get("/portfolio/summary"),
        apiClient.get("/allOrders"),
      ]);
      setFunds(fundsRes.data);
      setPortfolio(portfolioRes.data);
      setOrders(ordersRes.data.slice(0, 5));
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || "Failed to load your dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const holdings = portfolio?.holdings || [];
  const isProfit = (portfolio?.totalPnL || 0) >= 0;

  const allocationData = {
    labels: holdings.map((h) => h.symbol),
    datasets: [{
      data: holdings.map((h) => h.currentValue),
      backgroundColor: ALLOCATION_COLORS,
      borderWidth: 0,
    }],
  };

  return (
    <Box>
      <PageHeader title="Overview" description="Your paper-trading portfolio at a glance." />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Available balance" value={money(funds?.balance)} icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Portfolio value" value={money(portfolio?.currentValue)} icon={<PieChartOutlineOutlinedIcon fontSize="small" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Total P&L"
            value={`${isProfit ? "+" : ""}${money(portfolio?.totalPnL)}`}
            tone={isProfit ? "positive" : "negative"}
            icon={<ShowChartOutlinedIcon fontSize="small" />}
            trendValue={portfolio?.totalPnL}
            trendPercent={portfolio?.pnlPercent}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Total account value" value={money(funds?.totalAccountValue)} icon={<AccountBalanceOutlinedIcon fontSize="small" />} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <SectionCard
            title="Holdings"
            action={<Button size="small" onClick={() => navigate("/dashboard/holdings")}>View all</Button>}
            sx={{ mb: 2 }}
          >
            {holdings.length === 0 ? (
              <EmptyState
                icon={<AccountBalanceWalletOutlinedIcon />}
                title="No holdings yet"
                description="Start building your portfolio by adding a stock from Markets or your Watchlist and placing your first paper trade."
                action={<Button variant="contained" onClick={() => navigate("/dashboard/watchlist")}>Explore watchlist</Button>}
              />
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Avg</TableCell>
                      <TableCell align="right">P&L</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {holdings.map((h) => (
                      <TableRow key={h.symbol} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{h.symbol}</TableCell>
                        <TableCell align="right">{h.quantity}</TableCell>
                        <TableCell align="right">{h.averagePrice.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ color: h.pnl >= 0 ? "success.main" : "error.main", fontWeight: 700 }}>
                          {h.pnl >= 0 ? "+" : ""}{h.pnl.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </SectionCard>

          <SectionCard title="Portfolio performance">
            <EmptyState
              icon={<InsightsOutlinedIcon />}
              title="Performance history isn't tracked yet"
              description="TradeNova currently shows your live portfolio snapshot. A performance-over-time chart will appear here once historical portfolio tracking is added."
            />
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <SectionCard title="Allocation" sx={{ mb: 2 }}>
            {holdings.length === 0 ? (
              <EmptyState icon={<PieChartOutlineOutlinedIcon />} title="No allocation data" description="Your holdings breakdown will appear here once you own at least one position." />
            ) : (
              <>
                <Box sx={{ maxWidth: 220, mx: "auto" }}>
                  <DoughnutChart data={allocationData} />
                </Box>
                <Stack direction="row" flexWrap="wrap" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
                  {holdings.map((h, i) => (
                    <Chip
                      key={h.symbol}
                      size="small"
                      variant="outlined"
                      label={`${h.symbol} · ${h.allocation.toFixed(0)}%`}
                      sx={{ borderColor: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length], color: "text.primary" }}
                    />
                  ))}
                </Stack>
              </>
            )}
          </SectionCard>

          <SectionCard
            title="Recent orders"
            action={<Button size="small" onClick={() => navigate("/dashboard/orders")}>View all</Button>}
          >
            {orders.length === 0 ? (
              <EmptyState icon={<ReceiptLongOutlinedIcon />} title="No orders placed yet" description="Your executed paper trades will show up here." />
            ) : (
              <Stack divider={<Box sx={{ borderBottom: "1px solid", borderColor: "divider" }} />} spacing={1}>
                {orders.map((o) => (
                  <Box key={o._id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.5, gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 56 }}>{o.name}</Typography>
                    <Chip label={o.mode} size="small" color={o.mode === "BUY" ? "success" : "error"} variant="outlined" />
                    <Typography variant="body2" color="text.secondary">{o.qty} @ ₹{o.price.toFixed(2)}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
