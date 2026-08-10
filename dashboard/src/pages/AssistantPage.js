import React, { useState, useRef, useEffect } from "react";
import { Box, Card, TextField, Chip, Stack, Avatar, IconButton } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import apiClient from "../config/apiClient";
import PageHeader from "../components/PageHeader";

const SUGGESTED_QUESTIONS = [
  "What is my current P&L?",
  "Which holding is largest?",
  "Summarize my portfolio.",
  "What is my available balance?",
];

const TypingIndicator = () => (
  <Stack direction="row" spacing={0.5} sx={{ px: 0.5 }}>
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: "text.disabled",
          animation: "tn-bounce 1.2s infinite",
          animationDelay: `${i * 0.15}s`,
          "@keyframes tn-bounce": {
            "0%, 60%, 100%": { opacity: 0.3, transform: "translateY(0)" },
            "30%": { opacity: 1, transform: "translateY(-3px)" },
          },
        }}
      />
    ))}
  </Stack>
);

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
    <Box sx={{ maxWidth: 780, mx: "auto" }}>
      <PageHeader
        title="Portfolio Assistant"
        description="Grounded in your live TradeNova data. Advisory only - it cannot place trades."
      />

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip size="small" icon={<VerifiedOutlinedIcon />} label="Grounded in your data" variant="outlined" color="secondary" />
        <Chip size="small" icon={<BlockOutlinedIcon />} label="Cannot place trades" variant="outlined" />
      </Stack>

      <Card sx={{ display: "flex", flexDirection: "column", height: 540 }}>
        <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 1.5, sm: 2.5 } }}>
          {messages.map((m, i) => (
            <Stack
              key={i}
              direction={m.role === "user" ? "row-reverse" : "row"}
              spacing={1}
              alignItems="flex-end"
              sx={{ mb: 1.75 }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: m.role === "user" ? "primary.main" : "secondary.main",
                  fontSize: 13,
                }}
              >
                {m.role === "user" ? "U" : <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />}
              </Avatar>
              <Box
                sx={{
                  maxWidth: "75%",
                  px: 2,
                  py: 1.25,
                  borderRadius: 2.5,
                  fontSize: 14,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                  bgcolor: m.role === "user" ? "primary.main" : "background.default",
                  color: m.role === "user" ? "#fff" : "text.primary",
                  border: m.role === "user" ? "none" : "1px solid",
                  borderColor: "divider",
                }}
              >
                {m.text}
              </Box>
            </Stack>
          ))}

          {loading && (
            <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ mb: 1.75 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: "secondary.main" }}>
                <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Box sx={{ px: 2, py: 1.5, borderRadius: 2.5, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                <TypingIndicator />
              </Box>
            </Stack>
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

        <Box sx={{ display: "flex", gap: 1.5, p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <TextField
            fullWidth
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your portfolio, balance, or watchlist..."
            disabled={loading}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            sx={{ bgcolor: "primary.main", color: "#fff", "&:hover": { bgcolor: "primary.dark" }, "&.Mui-disabled": { bgcolor: "action.disabledBackground" } }}
          >
            <SendRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
};

export default AssistantPage;
