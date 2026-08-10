import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography, Button, Link } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import apiClient from "../config/apiClient";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";

const HoldingsPage = () => {
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setHoldings((await apiClient.get("/allHoldings")).data);
    } catch (err) {
      if (err.response?.status !== 401) setError(err.response?.data?.message || "Failed to load holdings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      <PageHeader title="Holdings" description="Stocks you currently own in your paper-trading portfolio." />
      <SectionCard contentSx={{ p: 0, "&:last-child": { pb: 0 } }}>
        {loading ? (
          <Box sx={{ p: 2.5 }}><LoadingState rows={4} /></Box>
        ) : error ? (
          <Box sx={{ p: 2.5 }}><ErrorState message={error} onRetry={load} /></Box>
        ) : holdings.length === 0 ? (
          <EmptyState
            icon={<AccountBalanceWalletOutlinedIcon />}
            title="No holdings yet"
            description="Buy a stock from Markets or your Watchlist to start building your portfolio."
            action={<Button variant="contained" onClick={() => navigate("/dashboard/markets")}>Explore markets</Button>}
          />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Instrument</TableCell>
                  <TableCell align="right">Qty.</TableCell>
                  <TableCell align="right">Avg. cost</TableCell>
                  <TableCell align="right">LTP</TableCell>
                  <TableCell align="right">Cur. value</TableCell>
                  <TableCell align="right">P&L</TableCell>
                  <TableCell align="right">P&L %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {holdings.map((s, i) => {
                  const investedValue = s.avg * s.qty;
                  const curValue = s.price * s.qty;
                  const pnl = curValue - investedValue;
                  const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;
                  const isProfit = pnl >= 0;
                  return (
                    <TableRow key={i} hover>
                      <TableCell>
                        <Link
                          component="button"
                          underline="hover"
                          color="inherit"
                          onClick={() => navigate(`/dashboard/market/${s.name}`)}
                          sx={{ fontWeight: 700 }}
                        >
                          {s.name}
                        </Link>
                      </TableCell>
                      <TableCell align="right">{s.qty}</TableCell>
                      <TableCell align="right">₹{s.avg.toFixed(2)}</TableCell>
                      <TableCell align="right">₹{s.price.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>₹{curValue.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: isProfit ? "success.main" : "error.main", fontWeight: 700 }}>
                        {isProfit ? "+" : ""}₹{pnl.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ color: isProfit ? "success.main" : "error.main", fontWeight: 700 }}>
                          {isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </SectionCard>
    </Box>
  );
};

export default HoldingsPage;
