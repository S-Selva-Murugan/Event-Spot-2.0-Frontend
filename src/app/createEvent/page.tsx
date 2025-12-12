"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

const steps = ["Event Details", "Tickets & Pricing", "Logistics", "Review & Submit"];

export default function CreateEventPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventType: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    date: "",
    startTime: "",
    endTime: "",
    totalTickets: "",
    ticketPrice: "",
    parkingAvailable: false,
    foodAvailable: false,
    contactEmail: "",
    contactPhone: "",
    photos: [] as string[],
  });

  const locationRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!locationRef.current) return;
    if (!(window as any).google) return;

    if (autocompleteRef.current) return;

    autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(locationRef.current, {
      fields: ["formatted_address", "geometry", "name"],
    });

    autocompleteRef?.current?.addListener("place_changed", () => {
      const place = autocompleteRef.current!.getPlace();
      const formatted = place.formatted_address || place.name || "";
      const lat = place.geometry?.location?.lat?.() ?? null;
      const lng = place.geometry?.location?.lng?.() ?? null;

      handleChange("location", formatted);
      handleChange("latitude", lat);
      handleChange("longitude", lng);
    });

    return () => {
      autocompleteRef.current = null;
    };
  }, [locationRef.current, (typeof window !== "undefined" ? (window as any).google : null)]);

  // Handle photo uploads (ready for backend)
const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const selectedFiles = Array.from(files).slice(0, 3);
  handleChange("photos", selectedFiles); // store File objects
};

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      submitEvent();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

const submitEvent = async () => {
  if (!formData.eventName || !formData.location || !formData.date) {
    alert("Please fill event name, location and date.");
    return;
  }

  try {
    // ✅ Prepare form data (multipart/form-data)
    const formDataToSend = new FormData();

    // Add all event fields except photos
    formDataToSend.append("eventName", formData.eventName);
    formDataToSend.append("eventDescription", formData.eventDescription || "");
    formDataToSend.append("location", formData.location);
    formDataToSend.append("date", new Date(formData.date).toISOString());
    formDataToSend.append("eventType", formData.eventType || "");
    formDataToSend.append("latitude", formData.latitude ? String(formData.latitude) : "");
    formDataToSend.append("longitude", formData.longitude ? String(formData.longitude) : "");
    formDataToSend.append("startTime", formData.startTime || "");
    formDataToSend.append("endTime", formData.endTime || "");
    formDataToSend.append("parkingAvailable", String(formData.parkingAvailable));
    formDataToSend.append("foodAvailable", String(formData.foodAvailable));
    formDataToSend.append("contactEmail", formData.contactEmail || "");
    formDataToSend.append("contactPhone", formData.contactPhone || "");
    formDataToSend.append("totalTickets", String(formData.totalTickets || 0));
    formDataToSend.append("ticketPrice", String(formData.ticketPrice || 0));

    // ✅ Add photo files (if any)
    if (formData.photos && formData.photos.length > 0) {
      formData.photos.forEach((file) => {
        formDataToSend.append("photos", file);
      });
    }

    const token = localStorage.getItem("token") || "";

    // ✅ Make the request (DO NOT set Content-Type manually)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      method: "POST",
      body: formDataToSend,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert("🎉 Event created successfully!");
      console.log("Created Event:", data);
    } else {
      console.error("Failed to create:", data);
      alert(data.error || "Error creating event.");
    }
  } catch (err) {
    console.error("Error submitting event:", err);
    alert("Error submitting event.");
  }
};


  // Render content per step
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Event Name"
              margin="normal"
              value={formData.eventName}
              onChange={(e) => handleChange("eventName", e.target.value)}
            />

            <TextField
              fullWidth
              label="Event Description"
              margin="normal"
              value={formData.eventDescription}
              onChange={(e) => handleChange("eventDescription", e.target.value)}
            />

            <TextField
              fullWidth
              label="Event Type"
              select
              margin="normal"
              value={formData.eventType}
              onChange={(e) => handleChange("eventType", e.target.value)}
            >
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Conference">Conference</MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Location"
              margin="normal"
              inputRef={locationRef}
              value={formData.location}
              onChange={(e) => {
                handleChange("location", e.target.value);
                handleChange("latitude", null);
                handleChange("longitude", null);
              }}
              helperText={
                formData.latitude && formData.longitude
                  ? `Lat: ${formData.latitude.toFixed(4)}, Lng: ${formData.longitude.toFixed(4)}`
                  : "Select a suggested location to capture coordinates"
              }
            />

            <TextField
              type="date"
              fullWidth
              label="Event Date"
              InputLabelProps={{ shrink: true }}
              margin="normal"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />

            <Box display="flex" gap={2}>
              <TextField
                type="time"
                fullWidth
                label="Start Time"
                InputLabelProps={{ shrink: true }}
                margin="normal"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
              />
              <TextField
                type="time"
                fullWidth
                label="End Time"
                InputLabelProps={{ shrink: true }}
                margin="normal"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
              />
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Upload Event Photos (max 3)
              </Typography>
              <Button variant="outlined" component="label">
                Upload Photos
                <input type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload} />
              </Button>

              <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                {formData.photos.map((src, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #ccc",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Event photo ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        );

      case 1:
        return (
          <>
            <TextField
              fullWidth
              type="number"
              label="Total Tickets"
              margin="normal"
              value={formData.totalTickets}
              onChange={(e) => handleChange("totalTickets", e.target.value)}
            />

            <TextField
              fullWidth
              type="number"
              label="Ticket Price (₹)"
              margin="normal"
              value={formData.ticketPrice}
              onChange={(e) => handleChange("ticketPrice", e.target.value)}
            />
          </>
        );

      case 2:
        return (
          <>
            <FormControlLabel
              control={
                <input
                  type="checkbox"
                  checked={formData.parkingAvailable}
                  onChange={(e) => handleChange("parkingAvailable", e.currentTarget.checked)}
                />
              }
              label="Parking Available"
            />

            <FormControlLabel
              control={
                <input
                  type="checkbox"
                  checked={formData.foodAvailable}
                  onChange={(e) => handleChange("foodAvailable", e.currentTarget.checked)}
                />
              }
              label="Food Available"
            />

            <TextField
              fullWidth
              label="Contact Email"
              margin="normal"
              value={formData.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
            />

            <TextField
              fullWidth
              label="Contact Phone"
              margin="normal"
              value={formData.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
            />
          </>
        );

      case 3:
        return (
          <Box textAlign="left">
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Review Your Event
            </Typography>
            {Object.entries(formData).map(([key, value]) => (
              <Typography key={key} sx={{ mb: 1 }}>
                <strong>{key.replace(/([A-Z])/g, " $1")}: </strong>
                {Array.isArray(value)
                  ? `${value.length} photo(s) uploaded`
                  : typeof value === "boolean"
                  ? value
                    ? "Yes"
                    : "No"
                  : String(value)}
              </Typography>
            ))}
          </Box>
        );
    }
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
      />

      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 5,
        }}
      >
        <Paper elevation={5} sx={{ width: "100%", maxWidth: 900, p: 5, borderRadius: 4, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Create Your Event
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>

            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
