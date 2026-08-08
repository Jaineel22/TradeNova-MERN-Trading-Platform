const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const marketRoutes = require("./routes/marketRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const aiRoutes = require("./routes/aiRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: [
      "https://trade-nova-mern-trading-platform.vercel.app",
      "https://trade-nova-mern-trading-platform-re.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use(authRoutes);
app.use(orderRoutes);
app.use(marketRoutes);
app.use(portfolioRoutes);
app.use(watchlistRoutes);
app.use(aiRoutes);

app.use(errorHandler);

module.exports = app;
