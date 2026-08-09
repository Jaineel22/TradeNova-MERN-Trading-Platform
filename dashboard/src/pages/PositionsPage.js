import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import apiClient from "../config/apiClient";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";

const PositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setPositions((await apiClient.get("/allPositions")).data);
    } catch (err) {
      if (err.response?.status !== 401) setError(err.response?.data?.message || "Failed to load positions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Positions</Typography>
      <Card>
        <CardContent>
          {loading ? (
            <LoadingState label="Loading positions..." />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : positions.length === 0 ? (
            <EmptyState
              title="No open positions"
              description="TradeNova currently tracks delivery-style holdings (see Holdings) rather than intraday positions."
            />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Instrument</TableCell>
                  <TableCell align="right">Qty.</TableCell>
                  <TableCell align="right">Avg.</TableCell>
                  <TableCell align="right">LTP</TableCell>
                  <TableCell align="right">P&L</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map((s, i) => {
                  const pnl = s.price * s.qty - s.avg * s.qty;
                  return (
                    <TableRow key={i}>
                      <TableCell>{s.product}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell align="right">{s.qty}</TableCell>
                      <TableCell align="right">{s.avg.toFixed(2)}</TableCell>
                      <TableCell align="right">{s.price.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: pnl >= 0 ? "success.main" : "error.main" }}>{pnl.toFixed(2)}</TableCell>
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

export default PositionsPage;
