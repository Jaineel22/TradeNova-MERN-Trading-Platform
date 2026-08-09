import React, { useState, useRef, useEffect } from "react";
import { Box, Card, Typography, TextField, Button, Chip, Stack } from "@mui/material";
import apiClient from "../config/apiClient";

const SUGGESTED_QUESTIONS = [
  "What is my current P&L?",
  "Which holding is largest?",
  "Summarize my portfolio.",
  "What is my available balance?",
];

const AssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your TradeNova portfolio assistant. Ask me about your holdings, balance, P&L, or watchlist. I'm advisory only and can't place trades.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendQuestion = async (question) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await apiClient.post("/ai/ask", { question: trimmed });
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.answer }]);
    } catch (err) {
      if (err.response?.status === 401) return;
      setError(err.response?.data?.message || "The assistant is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendQuestion(input);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Box sx={{ maxWidth: 760, mx: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Portfolio Assistant</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Grounded in your live TradeNova data. Advisory only — cannot place trades.
      </Typography>

      <Card sx={{ display: "flex", flexDirection: "column", height: 520 }}>
        <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
          {messages.map((m, i) => (
            <Box key={i} sx={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", mb: 1.5 }}>
              <Box
                sx={{
                  maxWidth: "75%",
                  px: 2,
                  py: 1.25,
                  borderRadius: 2,
                  fontSize: 14,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  bgcolor: m.role === "user" ? "primary.main" : "#F4F6FA",
                  color: m.role === "user" ? "#fff" : "text.primary",
                }}
              >
                {m.text}
              </Box>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1.5 }}>
              <Box sx={{ px: 2, py: 1.25, borderRadius: 2, fontSize: 14, bgcolor: "#F4F6FA", color: "text.secondary" }}>Thinking...</Box>
            </Box>
          )}

          {error && (
            <Box sx={{ px: 2, py: 1.25, borderRadius: 2, fontSize: 13, bgcolor: "#FDECEA", color: "#b3261e", mb: 1.5 }}>{error}</Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {messages.length <= 1 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ px: 2.5, pb: 1.5, gap: 1 }}>
            {SUGGESTED_QUESTIONS.map((q) => (
              <Chip key={q} label={q} size="small" clickable disabled={loading} onClick={() => sendQuestion(q)} />
            ))}
          </Stack>
        )}

        <Box sx={{ display: "flex", gap: 1.5, p: 2, borderTop: "1px solid #EAECF0" }}>
          <TextField
            fullWidth
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your portfolio, balance, or watchlist..."
            disabled={loading}
          />
          <Button variant="contained" onClick={handleSend} disabled={loading || !input.trim()}>Send</Button>
        </Box>
      </Card>
    </Box>
  );
};

export default AssistantPage;
