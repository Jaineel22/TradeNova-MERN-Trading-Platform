import React, { useEffect, useState } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Chip, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import apiClient from "../config/apiClient";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setOrders((await apiClient.get("/allOrders")).data);
    } catch (err) {
      if (err.response?.status !== 401) setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      <PageHeader title="Orders" description="Every paper trade you've executed, most recent first." />
      <SectionCard contentSx={{ p: 0, "&:last-child": { pb: 0 } }}>
        {loading ? (
          <Box sx={{ p: 2.5 }}><LoadingState rows={5} /></Box>
        ) : error ? (
          <Box sx={{ p: 2.5 }}><ErrorState message={error} onRetry={load} /></Box>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<ReceiptLongOutlinedIcon />}
            title="No orders yet"
            description="Your executed paper trades will appear here once you place your first buy or sell."
          />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Instrument</TableCell>
                  <TableCell>Side</TableCell>
                  <TableCell align="right">Qty.</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total value</TableCell>
                  <TableCell align="right">Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o._id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{o.name}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={o.mode === "BUY" ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        label={o.mode}
                        color={o.mode === "BUY" ? "success" : "error"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">{o.qty}</TableCell>
                    <TableCell align="right">₹{o.price.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>₹{(o.qty * o.price).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </SectionCard>
    </Box>
  );
};

export default OrdersPage;
