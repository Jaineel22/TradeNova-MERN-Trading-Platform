import React, { useEffect, useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, Box, ToggleButtonGroup, ToggleButton, Typography } from "@mui/material";
import apiClient from "../config/apiClient";
import { LoadingState, ErrorState, EmptyState } from "./StateMessage";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const RANGES = ["1D", "1W", "1M", "3M", "1Y"];

const formatLabel = (iso, range) => {
  const date = new Date(iso);
  if (range === "1D" || range === "1W") {
    return date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
};

const PriceHistoryChart = ({ symbol }) => {
  const [range, setRange] = useState("1M");
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get(`/market/history/${symbol}`, { params: { range } });
      setPoints(res.data.points || []);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || "Failed to load price history.");
      }
      setPoints([]);
    } finally {
      setLoading(false);
    }
  }, [symbol, range]);

  useEffect(() => {
    load();
  }, [load]);

  const isUp = points.length > 1 && points[points.length - 1].close >= points[0].close;
  const lineColor = isUp ? "#1DB954" : "#E5484D";

  const chartData = {
    labels: points.map((p) => formatLabel(p.date, range)),
    datasets: [
      {
        data: points.map((p) => p.close),
        borderColor: lineColor,
        backgroundColor: `${lineColor}22`,
        pointRadius: 0,
        borderWidth: 2,
        fill: true,
        tension: 0.25,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { intersect: false, mode: "index" },
    },
    scales: {
      x: { display: true, ticks: { maxTicksLimit: 6, color: "#667085" }, grid: { display: false } },
      y: { display: true, ticks: { color: "#667085" }, grid: { color: "#F0F1F3" } },
    },
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Price history</Typography>
          <ToggleButtonGroup size="small" value={range} exclusive onChange={(e, v) => v && setRange(v)}>
            {RANGES.map((r) => (
              <ToggleButton key={r} value={r} sx={{ px: 1.5, py: 0.25, fontSize: 12 }}>{r}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {loading ? (
          <LoadingState label="Loading chart..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : points.length === 0 ? (
          <EmptyState title="No chart data" description="Historical data isn't available for this symbol right now." />
        ) : (
          <Box sx={{ height: 260 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceHistoryChart;
