"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
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
    photos: [] as File[],
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
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <TextField
              fullWidth
              label="Event Name"
              value={formData.eventName}
              onChange={(e) => handleChange("eventName", e.target.value)}
            />

            <TextField
              fullWidth
              label="Event Description"
              multiline
              minRows={3}
              value={formData.eventDescription}
              onChange={(e) => handleChange("eventDescription", e.target.value)}
            />

            <TextField
              fullWidth
              label="Event Type"
              select
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

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 1.2 }}>
              <TextField
                type="date"
                fullWidth
                label="Event Date"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />

              <TextField
                type="time"
                fullWidth
                label="Start Time"
                InputLabelProps={{ shrink: true }}
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
              />
              <TextField
                type="time"
                fullWidth
                label="End Time"
                InputLabelProps={{ shrink: true }}
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
              />
            </Box>

            <Paper
              variant="outlined"
              sx={{
                mt: 0.5,
                p: 1.5,
                borderRadius: 2.5,
                borderStyle: "dashed",
                borderColor: "rgba(55, 95, 145, 0.45)",
                background: "rgba(248, 252, 255, 0.72)",
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} mb={1}>
                Event Photos (max 3)
              </Typography>
              <Button variant="outlined" component="label" sx={{ textTransform: "none", borderRadius: 2 }}>
                Upload Photos
                <input type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload} />
              </Button>

              <Box mt={1.4} display="flex" gap={1} flexWrap="wrap">
                {formData.photos.map((file, idx) => (
                  <Chip key={`${file.name}-${idx}`} label={file.name} variant="outlined" />
                ))}
              </Box>
            </Paper>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <TextField
              fullWidth
              type="number"
              label="Total Tickets"
              value={formData.totalTickets}
              onChange={(e) => handleChange("totalTickets", e.target.value)}
            />

            <TextField
              fullWidth
              type="number"
              label="Ticket Price (₹)"
              value={formData.ticketPrice}
              onChange={(e) => handleChange("ticketPrice", e.target.value)}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "grid", gap: 1.2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.parkingAvailable}
                  onChange={(e) => handleChange("parkingAvailable", e.currentTarget.checked)}
                />
              }
              label="Parking Available"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.foodAvailable}
                  onChange={(e) => handleChange("foodAvailable", e.currentTarget.checked)}
                />
              }
              label="Food Available"
            />

            <TextField
              fullWidth
              label="Contact Email"
              value={formData.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
            />

            <TextField
              fullWidth
              label="Contact Phone"
              value={formData.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
            />
          </Box>
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
          position: "relative",
          minHeight: "calc(100dvh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: { xs: 2, sm: 3.5 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/bg_event3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.96,
            filter: "saturate(1.14) contrast(1.02)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(242,247,254,0.60) 0%, rgba(230,239,250,0.67) 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Paper
          elevation={0}
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 960,
            p: { xs: 2, sm: 3.5, md: 4.5 },
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: "rgba(245, 249, 255, 0.82)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(178, 193, 212, 0.7)",
            boxShadow: "0 18px 40px rgba(30, 60, 95, 0.18)",
          }}
        >
          <Typography variant="h4" fontWeight={800} mb={1.2} color="#144b8b">
            Create Your Event
          </Typography>
          <Typography variant="body2" sx={{ mb: 2.5, color: "rgba(26, 46, 76, 0.85)" }}>
            Complete all steps to publish your event for review.
          </Typography>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 2.8,
              "& .MuiStepLabel-label": { fontWeight: 600, fontSize: { xs: "0.74rem", sm: "0.84rem" } },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              textAlign: "left",
              borderRadius: 3,
              p: { xs: 1.2, sm: 2 },
              background: "rgba(255,255,255,0.62)",
              border: "1px solid rgba(190, 206, 225, 0.6)",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.2,
                backgroundColor: "rgba(255,255,255,0.85)",
              },
            }}
          >
            {renderStepContent(activeStep)}
          </Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0} sx={{ borderRadius: 2.3, px: 2.6, textTransform: "none", fontWeight: 700 }}>
              Back
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                borderRadius: 2.3,
                px: 2.8,
                textTransform: "none",
                fontWeight: 700,
                background: "linear-gradient(90deg, #1e67b9 0%, #2f82de 100%)",
                boxShadow: "0 10px 18px rgba(35, 105, 190, 0.34)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1e67b9 0%, #2f82de 100%)",
                },
              }}
            >
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
