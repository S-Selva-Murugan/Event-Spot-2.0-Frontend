"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  CircularProgress,
  Box,
  Grid,
  Modal,
  Fade,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/events?isApproved=true`
        );
        setEvents(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedEvents();
  }, []);

  const handleOpen = (event) => setSelectedEvent(event);
  const handleClose = () => setSelectedEvent(null);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <Typography variant="h6" color="text.secondary">
          No approved events found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", py: 6, px: 4 }}>
      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                borderRadius: 2,
                boxShadow: 3,
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                  transition: "0.3s",
                },
              }}
            >
              {event.photos?.[0] && (
                <CardMedia
                  component="img"
                  image={event.photos[0]}
                  alt={event.eventName}
                  sx={{
                    height: 180,
                    width: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {event.eventName}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {event.eventType}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button variant="contained" size="small" onClick={() => handleOpen(event)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Modal for Event Details */}
      <Modal
        open={!!selectedEvent}
        onClose={handleClose}
        closeAfterTransition
        sx={{
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={!!selectedEvent}>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              width: "90%",
              maxWidth: 500,
              p: 4,
              outline: "none",
              textAlign: "center",
            }}
          >
            {selectedEvent && (
              <>
                <CardMedia
                  component="img"
                  image={selectedEvent.photos?.[0]}
                  alt={selectedEvent.eventName}
                  sx={{
                    height: 220,
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
                <Typography variant="h5" gutterBottom>
                  {selectedEvent.eventName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {selectedEvent.eventDescription}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  📍 {selectedEvent.location}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  💰 ₹{selectedEvent.ticketPrice}
                </Typography>

<Button
  variant="contained"
  color="primary"
  size="large"
  onClick={() => {
    router.push(`/events/${selectedEvent._id}`);
  }}
>
  Book Now
</Button>

              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
