import React, { useEffect, useState } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import apiClient from "../config/apiClient";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";

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
      <PageHeader title="Positions" description="Delivery-style positions, distinct from your long-term Holdings." />
      <SectionCard contentSx={{ p: 0, "&:last-child": { pb: 0 } }}>
        {loading ? (
          <Box sx={{ p: 2.5 }}><LoadingState rows={3} /></Box>
        ) : error ? (
          <Box sx={{ p: 2.5 }}><ErrorState message={error} onRetry={load} /></Box>
        ) : positions.length === 0 ? (
          <EmptyState
            icon={<TrendingUpOutlinedIcon />}
            title="No open positions"
            description="TradeNova currently tracks delivery-style holdings (see Holdings) rather than intraday trading positions. This page will populate if/when intraday-style position tracking is added."
          />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
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
                  const isProfit = pnl >= 0;
                  return (
                    <TableRow key={i} hover>
                      <TableCell>{s.product}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{s.name}</TableCell>
                      <TableCell align="right">{s.qty}</TableCell>
                      <TableCell align="right">₹{s.avg.toFixed(2)}</TableCell>
                      <TableCell align="right">₹{s.price.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: isProfit ? "success.main" : "error.main", fontWeight: 700 }}>
                        {isProfit ? "+" : ""}₹{pnl.toFixed(2)}
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

export default PositionsPage;
