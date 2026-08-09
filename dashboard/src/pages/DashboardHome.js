import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, CardContent, Typography, Chip, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import apiClient from "../config/apiClient";
import { DoughnutChart } from "../components/DoughnoutChart";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";

const money = (n) => `₹${(Number(n) || 0).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;

const StatCard = ({ label, value, positive, sub }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: positive === undefined ? "text.primary" : positive ? "success.main" : "error.main" }}>
        {value}
      </Typography>
      {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
    </CardContent>
  </Card>
);

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
      backgroundColor: ["#1E3C72", "#00C896", "#F5A623", "#E5484D", "#7C5CFC", "#17A2B8"],
      borderWidth: 0,
    }],
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Overview</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><StatCard label="Available balance" value={money(funds?.balance)} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard label="Portfolio value" value={money(portfolio?.currentValue)} /></Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Total P&L" value={`${isProfit ? "+" : ""}${money(portfolio?.totalPnL)}`} positive={isProfit} sub={`${(portfolio?.pnlPercent || 0).toFixed(2)}%`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard label="Total account value" value={money(funds?.totalAccountValue)} /></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Holdings</Typography>
                <Button size="small" onClick={() => navigate("/dashboard/holdings")}>View all</Button>
              </Box>
              {holdings.length === 0 ? (
                <EmptyState
                  title="No holdings yet"
                  description="Place your first paper trade from the watchlist to start building your portfolio."
                  action={<Button variant="contained" onClick={() => navigate("/dashboard/watchlist")}>Go to watchlist</Button>}
                />
              ) : (
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
                      <TableRow key={h.symbol}>
                        <TableCell>{h.symbol}</TableCell>
                        <TableCell align="right">{h.quantity}</TableCell>
                        <TableCell align="right">{h.averagePrice.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ color: h.pnl >= 0 ? "success.main" : "error.main" }}>
                          {h.pnl >= 0 ? "+" : ""}{h.pnl.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Allocation</Typography>
              {holdings.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No allocation data yet.</Typography>
              ) : (
                <Box sx={{ maxWidth: 240, mx: "auto" }}><DoughnutChart data={allocationData} /></Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Recent orders</Typography>
                <Button size="small" onClick={() => navigate("/dashboard/orders")}>View all</Button>
              </Box>
              {orders.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No orders placed yet.</Typography>
              ) : (
                orders.map((o) => (
                  <Box key={o._id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.75, borderBottom: "1px solid #F0F1F3", gap: 1 }}>
                    <Typography variant="body2">{o.name}</Typography>
                    <Chip label={o.mode} size="small" color={o.mode === "BUY" ? "success" : "error"} variant="outlined" />
                    <Typography variant="body2">{o.qty} @ {o.price.toFixed(2)}</Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
