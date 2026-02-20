"use client";

import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Popover,
  TextField,
  Box,
} from "@mui/material";
import { getValidatedAuthHeaders, handleAuthFailure } from "@/utils/authSession";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loadingEventId, setLoadingEventId] = useState(null);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
        const data = await res.json();
        if (res.ok) setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleApprove = async (id) => {
    setLoadingEventId(id);
    try {
      const headers = getValidatedAuthHeaders(true);
      if (!headers) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/events/${id}/moderation`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ isApproved: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (handleAuthFailure(res.status, data)) return;
        throw new Error(data?.error || "Failed to approve event");
      }
      setEvents((prev) => prev.map((e) => (e._id === id ? { ...e, isApproved: true } : e)));
    } catch (err) {
      console.error("Approve error:", err);
      alert(err?.message || "Failed to approve event");
    } finally {
      setLoadingEventId(null);
    }
  };

  const handleDisapproveClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setCurrentEventId(id);
  };

const handleDisapproveSubmit = async () => {
  if (!suggestion.trim() || !currentEventId) return;

  setLoadingEventId(currentEventId); // 🔹 start loader
  try {
    const headers = getValidatedAuthHeaders(true);
    if (!headers) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/events/${currentEventId}/moderation`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ isApproved: false, suggestion }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (handleAuthFailure(res.status, data)) return;
      throw new Error(data?.error || "Failed to disapprove event");
    }

    setEvents((prev) =>
      prev.map((e) =>
        e._id === currentEventId ? { ...e, isApproved: false, suggestion } : e
      )
    );
  } catch (err) {
    console.error("Disapprove error:", err);
    alert(err?.message || "Failed to disapprove event");
  } finally {
    // 🔹 stop loader and close popover
    setAnchorEl(null);
    setSuggestion("");
    setCurrentEventId(null);
    setLoadingEventId(null);
  }
};


  const open = Boolean(anchorEl);
  const id = open ? "suggestion-popover" : undefined;

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Event Name</TableCell>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Location</TableCell>
              <TableCell sx={{ color: "white" }}>Tickets</TableCell>
              <TableCell sx={{ color: "white" }}>Ticket Price</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.eventName}</TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.totalTickets}</TableCell>
                <TableCell>{event.ticketPrice}</TableCell>
<TableCell>
  {event.isApproved === null ? (
    // PENDING STATE
    <Box display="flex" gap={1}>
      <Button
        size="small"
        variant="contained"
        color="success"
        onClick={() => handleApprove(event._id)}
        disabled={loadingEventId === event._id}
      >
        {loadingEventId === event._id ? "Approving..." : "Approve"}
      </Button>

      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={(e) => handleDisapproveClick(e, event._id)}
      >
        Disapprove
      </Button>
    </Box>
  ) : event.isApproved === true ? (
    // APPROVED STATE
    <Typography color="success.main">Approved</Typography>
  ) : (
    // DISAPPROVED STATE
    <Box>
      <Typography color="error.main">Disapproved</Typography>
      {event.suggestion && (
        <Typography variant="body2" color="text.secondary">
          Reason: {event.suggestion}
        </Typography>
      )}
    </Box>
  )}
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

<Popover
  id={id}
  open={open}
  anchorEl={anchorEl}
  onClose={() => setAnchorEl(null)}
  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
>
  <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, width: 250 }}>
    <TextField
      label="Suggestion"
      multiline
      rows={3}
      value={suggestion}
      onChange={(e) => setSuggestion(e.target.value)}
    />
    <Button
      variant="contained"
      color="error"
      onClick={handleDisapproveSubmit}
      disabled={loadingEventId === currentEventId}
    >
      {loadingEventId === currentEventId ? "Submitting..." : "Submit"}
    </Button>
  </Box>
</Popover>

    </>
  );
}
