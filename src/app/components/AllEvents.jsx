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
  Modal,
  Fade,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function AllEvents({ filters }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams({ isApproved: "true" });
        if (filters?.searchQuery) query.set("q", filters.searchQuery);
        if (filters?.category) query.set("category", filters.category);
        if (filters?.minPrice) query.set("minPrice", filters.minPrice);
        if (filters?.maxPrice) query.set("maxPrice", filters.maxPrice);
        if (filters?.startDate) query.set("startDate", filters.startDate);
        if (filters?.endDate) query.set("endDate", filters.endDate);

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events?${query.toString()}`);
        const payload = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setEvents(payload);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedEvents();
  }, [
    filters?.searchQuery,
    filters?.category,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.startDate,
    filters?.endDate,
  ]);

  const handleOpen = (event) => setSelectedEvent(event);
  const handleClose = () => setSelectedEvent(null);

  if (loading && events.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", pt: 0.4, pb: 1.2, px: { xs: 1.2, sm: 1.5, md: 2 } }}>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}

      {!loading && events.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="34vh">
          <Typography variant="h6" color="text.secondary">
            No events found for current search/filters.
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(260px, 320px))",
              },
              justifyContent: "center",
              gap: 1.3,
            }}
          >
            {events.map((event) => (
              <Box key={event._id}>
                <Card
                  sx={{
                    height: 320,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid rgba(177, 192, 213, 0.6)",
                    background:
                      "linear-gradient(180deg, rgba(246,249,253,0.94) 0%, rgba(235,241,248,0.95) 100%)",
                    boxShadow: "0 8px 18px rgba(40, 67, 102, 0.16)",
                  }}
                >
                  {event.photos?.[0] ? (
                    <CardMedia
                      component="img"
                      image={event.photos[0]}
                      alt={event.eventName}
                      sx={{
                        height: 136,
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 136,
                        width: "100%",
                        background:
                          "linear-gradient(120deg, rgba(35,118,208,0.9), rgba(92,152,223,0.85))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.4 }}>
                        EVENTSPOT
                      </Typography>
                    </Box>
                  )}

                  <CardContent sx={{ pt: 1.1, pb: 0.25, px: 1.4, flexGrow: 1 }}>
                    <Typography variant="h6" noWrap sx={{ fontSize: "1rem", fontWeight: 700 }}>
                      {event.eventName}
                    </Typography>
                    <Stack direction="row" spacing={0.7} sx={{ mt: 0.6, mb: 0.7 }} flexWrap="wrap">
                      <Chip
                        size="small"
                        label={event.eventType}
                        sx={{
                          height: 20,
                          fontSize: "0.69rem",
                          backgroundColor: "rgba(25, 118, 210, 0.14)",
                          color: "#0f56a0",
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        size="small"
                        label={`₹${event.ticketPrice || 0}`}
                        sx={{
                          height: 20,
                          fontSize: "0.69rem",
                          backgroundColor: "rgba(46, 125, 50, 0.12)",
                          color: "#1f6b2a",
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.82rem",
                        mt: 0.2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 38,
                      }}
                      title={event.location}
                    >
                      {event.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.74rem" }}>
                      {new Date(event.date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: "flex-end", px: 1.1, py: 0.8 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpen(event)}
                      sx={{
                        borderRadius: 999,
                        px: 1.65,
                        fontSize: "0.74rem",
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.8, display: "block", textAlign: "center", fontSize: "0.73rem" }}
          >
            {events.length} event(s)
          </Typography>
        </>
      )}

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
              textAlign: "left",
              background:
                "linear-gradient(180deg, rgba(245,248,253,0.98) 0%, rgba(231,238,248,0.98) 100%)",
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
