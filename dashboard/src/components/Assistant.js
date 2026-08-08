import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL as API_BASE } from "../config/api";

const SUGGESTED_QUESTIONS = [
  "What is my current P&L?",
  "Which holding is largest?",
  "Summarize my portfolio.",
  "What is my available balance?",
];

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hi! I'm your TradeNova portfolio assistant. Ask me about your holdings, balance, P&L, or watchlist. I'm advisory only and can't place trades.",
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
      const res = await axios.post(
        `${API_BASE}/ai/ask`,
        { question: trimmed },
        { headers: authHeaders() }
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.answer },
      ]);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      setError(
        err.response?.data?.message ||
          "The assistant is temporarily unavailable. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendQuestion(input);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "760px", margin: "0 auto" }}>
      <h2
        style={{
          fontSize: "24px",
          color: "#1e3c72",
          fontWeight: "600",
          marginBottom: "4px",
        }}
      >
        Portfolio Assistant
      </h2>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
        Grounded in your live TradeNova data. Advisory only — cannot place
        trades.
      </p>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          height: "520px",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  background: m.role === "user" ? "#1e3c72" : "#f5f5f5",
                  color: m.role === "user" ? "white" : "#333",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  background: "#f5f5f5",
                  color: "#888",
                }}
              >
                Thinking...
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                background: "#fdecea",
                color: "#b3261e",
                marginBottom: "12px",
              }}
            >
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div
            style={{
              padding: "0 20px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendQuestion(q)}
                disabled={loading}
                style={{
                  fontSize: "12px",
                  padding: "6px 12px",
                  borderRadius: "16px",
                  border: "1px solid #dbe2f0",
                  background: "#f5f7fc",
                  color: "#1e3c72",
                  cursor: loading ? "default" : "pointer",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            padding: "16px 20px",
            borderTop: "1px solid #eee",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your portfolio, balance, or watchlist..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: loading || !input.trim() ? "#a8b6d6" : "#1e3c72",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: loading || !input.trim() ? "default" : "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
