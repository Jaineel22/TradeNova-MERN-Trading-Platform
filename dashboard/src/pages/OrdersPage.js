import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";
import apiClient from "../config/apiClient";
import { LoadingState, ErrorState, EmptyState } from "../components/StateMessage";

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
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Orders</Typography>
      <Card>
        <CardContent>
          {loading ? (
            <LoadingState label="Loading orders..." />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : orders.length === 0 ? (
            <EmptyState title="No orders yet" description="Your executed paper trades will appear here." />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Instrument</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Qty.</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o._id}>
                    <TableCell>{o.name}</TableCell>
                    <TableCell><Chip size="small" label={o.mode} color={o.mode === "BUY" ? "success" : "error"} variant="outlined" /></TableCell>
                    <TableCell align="right">{o.qty}</TableCell>
                    <TableCell align="right">{o.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrdersPage;
