'use client';

import { Box, Typography, Button, Popover, CardMedia } from '@mui/material';
import React from 'react';

export default function EventDetailsPopover({ anchorEl, handleClose, event }: any) {
  const open = Boolean(anchorEl);
  const id = open ? 'event-details-popover' : undefined;

  if (!event) return null;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: 320,
          boxShadow: 4,
          overflow: 'hidden',
        },
      }}
    >
      <Box>
        {/* 🖼️ Event Image */}
        {event.photos && event.photos.length > 0 && (
          <CardMedia
            component="img"
            height="160"
            image={event.photos[0]}
            alt={event.eventName}
            sx={{ objectFit: 'cover' }}
          />
        )}

        {/* 📄 Event Details */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {event.eventName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {event.eventDescription}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📍 {event.location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            🗓️ {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ⏰ {event.startTime} - {event.endTime}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            🎟️ Tickets: {event.totalTickets}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            💰 Price: ₹{event.ticketPrice}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => alert(`Booking ${event.eventName}...`)} // integrate later
          >
            Book Now
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}
