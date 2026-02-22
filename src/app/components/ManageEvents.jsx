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
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { getValidatedAuthHeaders, handleAuthFailure } from "@/utils/authSession";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loadingEventId, setLoadingEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const fetchEvents = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events?page=${page + 1}&limit=${rowsPerPage}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch events");
      }

      if (Array.isArray(data)) {
        setEvents(data);
        setTotalEvents(data.length);
      } else {
        setEvents(Array.isArray(data?.data) ? data.data : []);
        setTotalEvents(Number(data?.total) || 0);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
      setTotalEvents(0);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          mt: 1,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: 2,
          backgroundColor: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: { xs: 420, sm: 760 },
            borderCollapse: "separate",
            borderSpacing: "0 3px",
            "& .MuiTableCell-root": {
              borderBottom: "none",
              fontSize: "0.86rem",
              py: 0.75,
              lineHeight: 1.2,
            },
          }}
        >
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", borderTopLeftRadius: 12, borderBottomLeftRadius: 12, py: 0.85, fontSize: "0.83rem" }}>Event Name</TableCell>
              <TableCell sx={{ color: "white", py: 0.85, fontSize: "0.83rem" }}>Date</TableCell>
              <TableCell sx={{ color: "white", display: { xs: "none", sm: "table-cell" }, py: 0.85, fontSize: "0.83rem" }}>Location</TableCell>
              <TableCell sx={{ color: "white", display: { xs: "none", sm: "table-cell" }, py: 0.85, fontSize: "0.83rem" }}>Tickets</TableCell>
              <TableCell sx={{ color: "white", display: { xs: "none", sm: "table-cell" }, py: 0.85, fontSize: "0.83rem" }}>Ticket Price</TableCell>
              <TableCell sx={{ color: "white", borderTopRightRadius: 12, borderBottomRightRadius: 12, py: 0.85, fontSize: "0.83rem" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 2 }}>
                  <CircularProgress size={22} />
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No events found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
              <TableRow
                key={event._id}
                sx={{
                  "& .MuiTableCell-root": {
                    backgroundColor: "rgba(231, 236, 244, 0.88)",
                    py: 0.68,
                    transition: "background-color 0.2s ease, transform 0.2s ease",
                  },
                  "& .MuiTableCell-root:first-of-type": {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  "& .MuiTableCell-root:last-of-type": {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                  "&:hover .MuiTableCell-root": {
                    backgroundColor: "rgba(220, 228, 239, 0.95)",
                  },
                }}
              >
                <TableCell>
                  <Typography
                    fontWeight={500}
                    fontSize="0.95rem"
                    sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}
                    title={event.eventName}
                  >
                    {event.eventName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: { xs: "block", sm: "none" },
                      mt: 0.5,
                      maxWidth: 180,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={event.location}
                  >
                    {event.location}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  <Typography
                    sx={{
                      maxWidth: { sm: 220, md: 320, lg: 420 },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "0.88rem",
                    }}
                    title={event.location}
                  >
                    {event.location}
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{event.totalTickets}</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{event.ticketPrice}</TableCell>
<TableCell>
  {event.isApproved === null ? (
    // PENDING STATE
    <Box display="flex" gap={1} flexDirection={{ xs: "column", sm: "row" }}>
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
    <Typography
      sx={{
        color: "success.dark",
        fontWeight: 600,
        display: "inline-block",
        px: 0.8,
        py: 0.15,
        fontSize: "0.82rem",
        borderRadius: 999,
        backgroundColor: "rgba(56, 142, 60, 0.14)",
      }}
    >
      Approved
    </Typography>
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalEvents}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
        sx={{
          "& .MuiTablePagination-toolbar": { minHeight: 30, px: 0.25 },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": { display: "none" },
          "& .MuiTablePagination-displayedRows": { margin: 0, fontSize: "0.75rem" },
          "& .MuiIconButton-root": { p: 0.5 },
        }}
      />

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
