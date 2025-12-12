"use client";

import * as React from "react";
import {
  Popover,
  Box,
  Typography,
  Rating,
  TextField,
  Button,
} from "@mui/material";

export default function ReviewPopover({
  anchorEl,
  onClose,
  eventName,
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  eventName: string;
}) {
  const open = Boolean(anchorEl);
  const [rating, setRating] = React.useState<number | null>(0);
  const [review, setReview] = React.useState("");

  const handleSubmit = () => {
    console.log("Submitted Review:", { eventName, rating, review });
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box sx={{ p: 2, width: 300 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Review for {eventName}
        </Typography>
        <Rating
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
          sx={{ mb: 1 }}
        />
        <TextField
          label="Write your review"
          multiline
          fullWidth
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!rating}
        >
          Submit Review
        </Button>
      </Box>
    </Popover>
  );
}
