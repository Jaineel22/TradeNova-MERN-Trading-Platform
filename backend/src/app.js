const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const marketRoutes = require("./routes/marketRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const aiRoutes = require("./routes/aiRoutes");
const errorHandler = require("./middleware/errorHandler");

const DEFAULT_ALLOWED_ORIGINS = [
  "https://trade-nova-mern-trading-platform.vercel.app",
  "https://trade-nova-mern-trading-platform-re.vercel.app",
  "http://localhost:3000",
];

// ALLOWED_ORIGINS lets the origin list be changed per-deployment (e.g. a new
// Vercel URL) without a code change; falls back to the known-good defaults
// above so behavior is unchanged unless the env var is explicitly set.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : DEFAULT_ALLOWED_ORIGINS;

const app = express();

// Render (and most hosting platforms) put the app behind a reverse proxy;
// without this, req.ip resolves to the proxy's address for every request,
// which would make IP-based rate limiting effectively global instead of
// per-client.
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50kb" }));

app.use(authRoutes);
app.use(orderRoutes);
app.use(marketRoutes);
app.use(portfolioRoutes);
app.use(watchlistRoutes);
app.use(aiRoutes);

app.use(errorHandler);

module.exports = app;
