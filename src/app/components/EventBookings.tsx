import React from "react";
import { Typography, Box, Paper } from "@mui/material";

export default function EventBookings() {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Your Event Bookings
      </Typography>
      <Paper
        sx={{
          p: 3,
          backgroundColor: "#fafafa",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">
          You haven’t booked any events yet.
        </Typography>
      </Paper>
    </Box>
  );
}
