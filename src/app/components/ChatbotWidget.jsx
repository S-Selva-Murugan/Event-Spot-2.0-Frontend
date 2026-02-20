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
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles";

export default function ChatbotWidget() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm Namitha, your EventSpot Assistant. How can i help you today?",
      documents: [],
    },
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:3001";

  const getDocMetadata = (doc) => doc?.metadata || doc?.metdata || {};
  const assistantAvatarSrc = "/support.jpg";
  const AssistantAvatar = ({ size = 36 }) => (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.78)",
        backgroundColor: "#dbeafe",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={assistantAvatarSrc}
        alt="Namitha"
        sx={{
          width: "118%",
          height: "118%",
          objectFit: "cover",
          objectPosition: "center top",
        }}
      />
    </Box>
  );

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

  const sendMessage = async () => {
    const messageText = input.trim();
    if (!messageText || isSending) return;

    const userMsg = { role: "user", text: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const query = new URLSearchParams({ message: messageText }).toString();
      const res = await fetch(`${backendBaseUrl}/chat?${query}`);
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: "Unexpected response from chatbot service." };

      if (!res.ok) {
        throw new Error(data?.message || "Failed to get chatbot response.");
      }

      const aiMsg = {
        role: "assistant",
        text: data?.message || "I could not generate a response.",
        documents: Array.isArray(data?.docs) ? data.docs : [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error?.message ||
            "Something went wrong while fetching the answer. Please try again.",
          documents: [],
        },
      ]);
    } finally {
      setIsSending(false);
    }
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
            background: theme.eventSpot.gradients.navbar,
            color: "white",
            width: 62,
            height: 62,
            boxShadow: "0 18px 36px rgba(15, 106, 200, 0.35)",
            zIndex: 1000,
            animation: "eventSpotPulse 2.2s ease-in-out infinite",
            "@keyframes eventSpotPulse": {
              "0%, 100%": { transform: "translateY(0)", boxShadow: "0 18px 36px rgba(15, 106, 200, 0.35)" },
              "50%": { transform: "translateY(-3px)", boxShadow: "0 26px 44px rgba(15, 106, 200, 0.45)" },
            },
            "&:hover": {
              filter: "brightness(0.95)",
            },
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
            width: { xs: "calc(100vw - 24px)", sm: 420 },
            maxWidth: 420,
            height: { xs: "min(78vh, 620px)", sm: 600 },
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.65)",
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.26)",
            zIndex: 1000,
            animation: "chatIn 260ms ease-out",
            "@keyframes chatIn": {
              "0%": { opacity: 0, transform: "translateY(12px) scale(0.985)" },
              "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: theme.eventSpot.gradients.navbar,
              color: "white",
              p: 1.6,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <AssistantAvatar size={36} />
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "0.2px",
                  }}
                >
                  Namitha
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
                  EventSpot Concierge Assistant
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={toggleChat} sx={{ color: "white" }} aria-label="Close chat">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages area */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2.2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1.8,
              background: theme.eventSpot.surfaces.page,
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
                  <Box sx={{ boxShadow: "0 8px 18px rgba(15, 106, 200, 0.24)", borderRadius: "50%" }}>
                    <AssistantAvatar size={36} />
                  </Box>
                )}
                <Box
                  sx={{
                    maxWidth: "78%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.7,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      background:
                        msg.role === "user"
                          ? "linear-gradient(120deg, #0f6ac8 0%, #2488f5 100%)"
                          : "rgba(255,255,255,0.95)",
                      color: msg.role === "user" ? "#ffffff" : "#0f172a",
                      px: 1.8,
                      py: 1.1,
                      borderRadius: msg.role === "user" ? "16px 16px 6px 16px" : "16px 16px 16px 6px",
                      border: msg.role === "assistant" ? "1px solid #e6ecf4" : "none",
                      boxShadow:
                        msg.role === "user"
                          ? "0 14px 26px rgba(15, 106, 200, 0.25)"
                          : "0 10px 24px rgba(15, 23, 42, 0.08)",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      fontSize: "0.95rem",
                      lineHeight: 1.45,
                    }}
                  >
                    {msg.text}
                  </Typography>

                  {msg.role === "assistant" && Array.isArray(msg.documents) && msg.documents.length > 0 && (
                    <Box
                      sx={{
                        mt: 0.3,
                        px: 1.1,
                        py: 0.9,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.88)",
                        border: "1px solid #dfe9f7",
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#0b4d93" }}>
                        Context from PDF
                      </Typography>
                      {msg.documents.map((doc, docIndex) => {
                        const metadata = getDocMetadata(doc);
                        const page = metadata?.loc?.pageNumber;
                        const source = metadata?.source;
                        const pageContent = doc?.pageContent || "";
                        const snippet = pageContent.slice(0, 180);

                        return (
                          <Typography
                            key={`${i}-doc-${docIndex}`}
                            variant="caption"
                            sx={{ display: "block", mt: 0.5, color: "#374151" }}
                          >
                            [{docIndex + 1}] {page ? `Page ${page}` : "Page N/A"}
                            {source ? ` | ${source}` : ""}
                            {snippet ? ` | ${snippet}${pageContent.length > 180 ? "..." : ""}` : ""}
                          </Typography>
                        );
                      })}
                    </Box>
                  )}
                </Box>
                {msg.role === "user" && (
                  <Avatar
                    alt="You"
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#203047",
                      fontSize: "0.95rem",
                    }}
                  >
                    <PersonIcon fontSize="small" />
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
              bgcolor: "rgba(255,255,255,0.92)",
              borderTop: "1px solid #e6edf7",
              backdropFilter: "blur(6px)",
            }}
          >
            <TextField
              inputRef={inputRef}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Ask about events, bookings, tickets..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              multiline
              maxRows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  backgroundColor: "rgba(248, 250, 255, 0.95)",
                },
              }}
            />
            <Button
              onClick={sendMessage}
              variant="contained"
              disabled={!input.trim() || isSending}
              sx={{
                minWidth: 50,
                borderRadius: 2.3,
                background: "linear-gradient(120deg, #0f6ac8 0%, #2b8cff 100%)",
                boxShadow: "0 10px 20px rgba(15, 106, 200, 0.28)",
                "&:hover": {
                  background: "linear-gradient(120deg, #0a5baa 0%, #207be5 100%)",
                },
              }}
              aria-label="Send message"
            >
              {isSending ? "..." : <SendIcon />}
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
}
