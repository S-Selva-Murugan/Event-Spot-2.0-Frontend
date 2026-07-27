"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "assistant", text: "Hi there! 👋 I'm your Event Spot Assistant. How can I help you today?" },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // ❗ We'll replace this mock AI reply with Gemini API later
    setTimeout(() => {
      const aiMsg = { role: "assistant", text: "Got it! (This is a mock response — Gemini coming soon 😎)" };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "calc(100vh - 64px)", // below navbar height
        p: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Event Spot AI Chatbot 🤖
      </Typography>

      {/* Chat Window */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 700,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Messages area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            mb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pr: 1,
          }}
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                gap: 1,
              }}
            >
              {msg.role === "assistant" && <Avatar alt="AI" src="/bot-icon.png" sx={{ width: 32, height: 32 }} />}
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: msg.role === "user" ? "#1976d2" : "#f1f1f1",
                  color: msg.role === "user" ? "white" : "black",
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  maxWidth: "75%",
                }}
              >
                {msg.text}
              </Typography>
              {msg.role === "user" && <Avatar alt="You" src="/user-avatar.png" sx={{ width: 32, height: 32 }} />}
            </Box>
          ))}
        </Box>

        {/* Input area */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, height: "56px" }}
            endIcon={<SendIcon />}
            onClick={sendMessage}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
