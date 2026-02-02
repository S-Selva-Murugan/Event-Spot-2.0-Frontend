'use client';

import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm Namitha, your EventSpot Assistant. The chatbot feature is currently under development. Please use the website to explore events and make bookings!",
    },
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);

  const toggleChat = () => {
    setOpen(!open);
  };

  const sendMessage = () => {
    const messageText = input.trim();
    if (!messageText) return;

    const userMsg = { role: "user", text: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simple static response
    setTimeout(() => {
      const aiMsg = {
        role: "assistant",
        text: "Thank you for your message! The chatbot feature is currently under development. Please browse our events or contact support for assistance.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
            zIndex: 1000,
            "&:hover": { bgcolor: "#1258a8" },
          }}
          aria-label="Open chat"
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
            width: 380,
            height: 500,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 5,
            zIndex: 1000,
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="subtitle1" fontWeight="bold">
                Namitha - EventSpot Assistant
              </Typography>
            </Box>
            <IconButton onClick={toggleChat} sx={{ color: "white" }} aria-label="Close chat">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages area */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              bgcolor: "#fafafa",
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  gap: 1,
                }}
              >
                {msg.role === "assistant" && (
                  <Avatar
                    alt="AI"
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#1976d2",
                    }}
                  >
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                )}
                <Box
                  sx={{
                    maxWidth: "75%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: msg.role === "user" ? "#1976d2" : "#e3f2fd",
                      color: msg.role === "user" ? "white" : "black",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Box>
                {msg.role === "user" && (
                  <Avatar
                    alt="You"
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#9e9e9e",
                    }}
                  >
                    👤
                  </Avatar>
                )}
              </Box>
            ))}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input area */}
          <Box
            sx={{
              display: "flex",
              p: 1.5,
              gap: 1,
              bgcolor: "white",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <TextField
              inputRef={inputRef}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              multiline
              maxRows={3}
            />
            <Button
              onClick={sendMessage}
              variant="contained"
              disabled={!input.trim()}
              sx={{ minWidth: 48 }}
              aria-label="Send message"
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
}
