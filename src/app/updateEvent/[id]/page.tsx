"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useParams, useRouter } from "next/navigation";
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

const steps = ["Event Details", "Tickets & Pricing", "Logistics", "Review & Update"];

export default function UpdateEventPage() {
  const router = useRouter();
  const { id } = useParams();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<any>({
    eventName: "",
    eventType: "",
    location: "",
    latitude: null,
    longitude: null,
    date: "",
    startTime: "",
    endTime: "",
    totalTickets: "",
    ticketPrice: "",
    parkingAvailable: false,
    foodAvailable: false,
    contactEmail: "",
    contactPhone: "",
    photos: [],
  });

  const locationRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // ✅ Fetch existing event
  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            ...data,
            date: data.date ? data.date.split("T")[0] : "",
            photos: data.photos || [],
          });
        } else {
          alert(data.error || "Failed to load event");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        alert("Error fetching event data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, []);

  // ✅ Google Autocomplete setup
  useEffect(() => {
    if (typeof window === "undefined" || !locationRef.current || !(window as any).google) return;
    if (autocompleteRef.current) return;

    autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(locationRef.current, {
      fields: ["formatted_address", "geometry", "name"],
    });

    autocompleteRef?.current?.addListener("place_changed", () => {
      const place = autocompleteRef.current!.getPlace();
      handleChange("location", place.formatted_address || place.name || "");
      handleChange("latitude", place.geometry?.location?.lat() ?? null);
      handleChange("longitude", place.geometry?.location?.lng() ?? null);
    });

    return () => {
      autocompleteRef.current = null;
    };
  }, []);

  // ✅ Handle photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const selectedFiles = Array.from(files).slice(0, 3);
    handleChange("photos", selectedFiles); // store File objects
  };

  // ✅ Handle update submit
const submitUpdate = async () => {
  if (!formData.eventName || !formData.location || !formData.date) {
    alert("Please fill event name, location and date.");
    return;
  }

  try {
    const formDataToSend = new FormData();

    const fields = [
      "eventName",
      "eventType",
      "location",
      "date",
      "latitude",
      "longitude",
      "startTime",
      "endTime",
      "parkingAvailable",
      "foodAvailable",
      "contactEmail",
      "contactPhone",
      "totalTickets",
      "ticketPrice",
    ];

    fields.forEach((field) => {
      const val = formData[field];
      formDataToSend.append(field, val !== undefined ? String(val) : "");
    });

    if (formData.photos && formData.photos.length > 0) {
      formData.photos.forEach((file: any) => formDataToSend.append("photos", file));
    }

    // ✅ Force event back into review mode
    formDataToSend.append("isApproved", "null");
    formDataToSend.append("suggestion", "");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
      method: "PUT",
      body: formDataToSend,
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Event updated successfully and sent for re-approval!");
      router.push("/profile");
    } else {
      console.error("Failed:", data);
      alert(data.error || "Error updating event.");
    }
  } catch (err) {
    console.error("Error updating event:", err);
    alert("Error updating event.");
  }
};


  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      submitUpdate();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // ✅ Loading state
  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">Loading event details...</Typography>
      </Box>
    );
  }

  // ✅ Reuse form layout
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
              onChange={(e) => handleChange("location", e.target.value)}
              helperText={
                formData.latitude && formData.longitude
                  ? `Lat: ${formData.latitude.toFixed(4)}, Lng: ${formData.longitude.toFixed(4)}`
                  : "Select a suggested location"
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

            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Upload New Photos (max 3)
              </Typography>
              <Button variant="outlined" component="label">
                Upload Photos
                <input type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload} />
              </Button>
            </Box>
          </>
        );

      case 3:
        return (
          <Box textAlign="left">
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Review Event Changes
            </Typography>
            {Object.entries(formData).map(([key, value]) => (
              <Typography key={key} sx={{ mb: 1 }}>
                <strong>{key.replace(/([A-Z])/g, " $1")}: </strong>
                {Array.isArray(value)
                  ? `${value.length} photo(s)`
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
            Update Event
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
              {activeStep === steps.length - 1 ? "Update" : "Next"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
