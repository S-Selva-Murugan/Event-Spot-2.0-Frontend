"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Cancel, Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface Event {
  _id: string;
  eventName: string;
  date: string;
  location: string;
  totalTickets: number;
  ticketPrice: number;
  isApproved: boolean | null;
  suggestion?: string;
}

export default function OrganisingEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // ✅ Fetch events from backend
const fetchEvents = async () => {
  try {
    const token = localStorage.getItem("token") || "";
    const provider = localStorage.getItem("provider") || undefined; // ✅ convert null → undefined

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/myEvents`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(provider ? { "x-auth-provider": provider } : {}), // ✅ only include if present
      },
    });

    const data = await res.json();

    if (res.ok) setEvents(data);
    else console.error("Failed to fetch events:", data);
  } catch (err) {
    console.error("Error fetching events:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      setDeleting(id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setEvents((prev) => prev.filter((event) => event._id !== id));
      } else {
        console.error("Failed to delete event:", data);
        alert(data.error || "Failed to delete event");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting the event.");
    } finally {
      setDeleting(null);
    }
  };

  // ✅ Loader
  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Events You’re Organising
      </Typography>

      {events.length === 0 ? (
        <Paper
          sx={{
            p: 3,
            backgroundColor: "#fafafa",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography color="text.secondary">
            You haven’t listed any events yet.
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, borderRadius: 2, overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Event Name</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Total Tickets</strong></TableCell>
                <TableCell><strong>Ticket Price (₹)</strong></TableCell>
                <TableCell align="center"><strong>Approved</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell> {/* ✅ New column */}
                <TableCell align="center"><strong>Update</strong></TableCell>
                <TableCell align="center"><strong>Delete</strong></TableCell>
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
      <TableCell align="center">
        {event.isApproved === true ? (
          <CheckCircle color="success" />
        ) : event.isApproved === false ? (
          <Cancel color="error" />
        ) : (
          <Typography color="text.secondary" variant="body2">
            Pending
          </Typography>
        )}
      </TableCell>
      <TableCell>
        {event.isApproved === false && event.suggestion ? (
          <Typography variant="body2" color="error.main">
            {event.suggestion}
          </Typography>
        ) : event.isApproved === null ? (
          <Typography variant="body2" color="text.secondary">
            Awaiting review
          </Typography>
        ) : (
          <Typography variant="body2" color="success.main">
            Approved
          </Typography>
        )}
      </TableCell>
      <TableCell align="center">
        {!event.isApproved ? (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Edit />}
            onClick={() => router.push(`/updateEvent/${event._id}`)}
          >
            Update
          </Button>
        ) : (
          <Typography color="text.secondary" variant="body2">
            -
          </Typography>
        )}
      </TableCell>
      <TableCell align="center">
        {!event.isApproved ? (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Delete />}
            onClick={() => handleDelete(event._id)}
            disabled={deleting === event._id}
          >
            {deleting === event._id ? "Deleting..." : "Delete"}
          </Button>
        ) : (
          <Cancel color="disabled" />
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </Paper>
      )}
    </Box>
  );
}
