"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  Delete,
  Edit,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { getValidatedAuthHeaders, handleAuthFailure } from "@/utils/authSession";

interface EventItem {
  _id: string;
  eventName: string;
  date: string;
  location: string;
  totalTickets: number;
  ticketPrice: number;
  isApproved: boolean | null;
  suggestion?: string;
}

type PagedResponse<T> = {
  data?: T[];
  total?: number;
};

type ErrorPayload = {
  error?: string;
  message?: string;
  details?: string;
};

const rowsPerPage = 10;

export default function OrganisingEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const fetchEvents = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = getValidatedAuthHeaders();
      if (!headers) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/myEvents?page=${page + 1}&limit=${rowsPerPage}`,
        { headers }
      );
      const data: EventItem[] | PagedResponse<EventItem> = await res.json();

      if (!res.ok) {
        const payload = data as ErrorPayload;
        if (handleAuthFailure(res.status, payload)) return;
        throw new Error(payload.error || payload.message || "Failed to fetch events");
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
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      setDeleting(id);
      const headers = getValidatedAuthHeaders();
      if (!headers) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();

      if (!res.ok) {
        if (handleAuthFailure(res.status, data)) return;
        throw new Error(data?.error || "Failed to delete event");
      }

      if (events.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        fetchEvents();
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong while deleting the event.");
    } finally {
      setDeleting(null);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Events You&apos;re Organising
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
            minWidth: { xs: 430, sm: 760 },
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
              <TableCell sx={{ color: "white", borderTopLeftRadius: 12, borderBottomLeftRadius: 12, py: 0.85, fontSize: "0.83rem" }}>
                Event
              </TableCell>
              <TableCell sx={{ color: "white", py: 0.85, fontSize: "0.83rem" }}>
                Date
              </TableCell>
              <TableCell sx={{ color: "white", display: { xs: "none", sm: "table-cell" }, py: 0.85, fontSize: "0.83rem" }}>
                Location
              </TableCell>
              <TableCell sx={{ color: "white", display: { xs: "none", sm: "table-cell" }, py: 0.85, fontSize: "0.83rem" }}>
                Tickets
              </TableCell>
              <TableCell sx={{ color: "white", py: 0.85, fontSize: "0.83rem" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", borderTopRightRadius: 12, borderBottomRightRadius: 12, py: 0.85, fontSize: "0.83rem" }}>
                Actions
              </TableCell>
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
                    You haven&apos;t listed any events yet.
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
                      sx={{ display: { xs: "block", sm: "none" }, mt: 0.5 }}
                    >
                      {event.ticketPrice ? `Rs. ${event.ticketPrice}` : "Free"}
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

                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {event.totalTickets}
                  </TableCell>

                  <TableCell>
                    {event.isApproved === true ? (
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
                    ) : event.isApproved === false ? (
                      <Box>
                        <Typography
                          sx={{
                            color: "error.dark",
                            fontWeight: 600,
                            display: "inline-block",
                            px: 0.8,
                            py: 0.15,
                            fontSize: "0.82rem",
                            borderRadius: 999,
                            backgroundColor: "rgba(211, 47, 47, 0.12)",
                          }}
                        >
                          Disapproved
                        </Typography>
                        {event.suggestion && (
                          <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "error.main" }}>
                            {event.suggestion}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography
                        sx={{
                          color: "warning.dark",
                          fontWeight: 600,
                          display: "inline-block",
                          px: 0.8,
                          py: 0.15,
                          fontSize: "0.82rem",
                          borderRadius: 999,
                          backgroundColor: "rgba(255, 160, 0, 0.12)",
                        }}
                      >
                        Pending
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Box display="flex" gap={1} flexDirection={{ xs: "column", sm: "row" }}>
                      {event.isApproved !== true && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => router.push(`/updateEvent/${event._id}`)}
                        >
                          Update
                        </Button>
                      )}
                      {event.isApproved !== true ? (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(event._id)}
                          disabled={deleting === event._id}
                        >
                          {deleting === event._id ? "Deleting..." : "Delete"}
                        </Button>
                      ) : (
                        <CheckCircle fontSize="small" color="success" />
                      )}
                    </Box>
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
    </>
  );
}
