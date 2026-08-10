import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import PublicLayout from "./layout/PublicLayout";
import AppShell from "./layout/AppShell";

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ProductPage from "./pages/ProductPage";
import PricingPage from "./pages/PricingPage";
import SupportPage from "./pages/SupportPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

import DashboardHome from "./pages/DashboardHome";
import HoldingsPage from "./pages/HoldingsPage";
import PositionsPage from "./pages/PositionsPage";
import OrdersPage from "./pages/OrdersPage";
import FundsPage from "./pages/FundsPage";
import WatchlistPage from "./pages/WatchlistPage";
import AssistantPage from "./pages/AssistantPage";
import MarketsPage from "./pages/MarketsPage";
import StockDetailPage from "./pages/StockDetailPage";

// Extracted from index.js so the route tree can be rendered directly in
// tests (React Testing Library needs a component to render - index.js's
// ReactDOM.createRoot(...).render(...) call can't be exercised that way).
// This is a pure extraction: identical JSX, no behaviour change.
const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="markets" element={<MarketsPage />} />
            <Route path="market/:symbol" element={<StockDetailPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="holdings" element={<HoldingsPage />} />
            <Route path="positions" element={<PositionsPage />} />
            <Route path="funds" element={<FundsPage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="assistant" element={<AssistantPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
