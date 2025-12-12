'use client';

import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Avatar, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false); // toggle chat window
  const [input, setInput] = useState("");
const [messages, setMessages] = useState([
  { role: "assistant", text: "Hi! I'm your Event Spot Assistant. How can I help you today?" },
]);


  const toggleChat = () => setOpen(!open);

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const aiMsg = { role: "assistant", text: data.reply };
    setMessages((prev) => [...prev, aiMsg]);
  } catch (err) {
    console.error(err);
    const aiMsg = { role: "assistant", text: "Oops! Something went wrong." };
    setMessages((prev) => [...prev, aiMsg]);
  }
};

  return (
    <>
      {/* Floating button */}
      {!open && (
        <IconButton
          onClick={toggleChat}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            bgcolor: "#1976d2",
            color: "white",
            width: 56,
            height: 56,
            boxShadow: 3,
            "&:hover": { bgcolor: "#1258a8" },
          }}
        >
          <ChatIcon />
        </IconButton>
      )}

      {/* Chat window */}
      {open && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 320,
            height: 400,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 5,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#1976d2",
              color: "white",
              p: 1.5,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Event Spot Assistant
            </Typography>
            <IconButton onClick={toggleChat} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages area */}
          <Box sx={{ flexGrow: 1, p: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
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
                {msg.role === "assistant" && <Avatar alt="AI" sx={{ width: 28, height: 28 }}>🤖</Avatar>}
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor: msg.role === "user" ? "#1976d2" : "#f1f1f1",
                    color: msg.role === "user" ? "white" : "black",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    maxWidth: "75%",
                  }}
                >
                  {msg.text}
                </Typography>
                {msg.role === "user" && <Avatar alt="You" sx={{ width: 28, height: 28 }}>🙂</Avatar>}
              </Box>
            ))}
          </Box>

          {/* Input area */}
          <Box sx={{ display: "flex", p: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} sx={{ ml: 1 }} variant="contained">
              <SendIcon />
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
}
