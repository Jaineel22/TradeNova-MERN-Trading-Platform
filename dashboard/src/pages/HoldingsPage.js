import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import apiClient from "../config/apiClient";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";

const HoldingsPage = () => {
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
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Holdings</Typography>
      <Card>
        <CardContent>
          {loading ? (
            <LoadingState label="Loading holdings..." />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : holdings.length === 0 ? (
            <EmptyState title="No holdings yet" description="Buy a stock from your watchlist to start building your portfolio." />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Instrument</TableCell>
                  <TableCell align="right">Qty.</TableCell>
                  <TableCell align="right">Avg. cost</TableCell>
                  <TableCell align="right">LTP</TableCell>
                  <TableCell align="right">Cur. val</TableCell>
                  <TableCell align="right">P&L</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {holdings.map((s, i) => {
                  const curValue = s.price * s.qty;
                  const pnl = curValue - s.avg * s.qty;
                  return (
                    <TableRow key={i}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell align="right">{s.qty}</TableCell>
                      <TableCell align="right">{s.avg.toFixed(2)}</TableCell>
                      <TableCell align="right">{s.price.toFixed(2)}</TableCell>
                      <TableCell align="right">{curValue.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: pnl >= 0 ? "success.main" : "error.main" }}>
                        {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default HoldingsPage;
