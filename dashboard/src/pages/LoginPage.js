import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Link, InputAdornment, IconButton, Stack } from "@mui/material";
import CandlestickChartRoundedIcon from "@mui/icons-material/CandlestickChartRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import apiClient from "../config/apiClient";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await apiClient.post("/login", { email, password });
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #0B1626 0%, #0F1B33 100%)",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, border: "none", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
        <CardContent sx={{ p: 4.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 3.5 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #00C896 0%, #00A67D 100%)",
                color: "#0B1626",
              }}
            >
              <CandlestickChartRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Trade<Box component="span" sx={{ color: "secondary.main" }}>Nova</Box>
            </Typography>
          </Stack>

          <Typography variant="h6" sx={{ mb: 0.5 }}>Welcome back</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Log in to your paper-trading account.</Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      size="small"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Button type="submit" fullWidth variant="contained" size="large" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </Button>
          </form>
          <Typography variant="body2" sx={{ mt: 2.5, textAlign: "center" }}>
            Don't have an account? <Link component={RouterLink} to="/signup">Sign up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
