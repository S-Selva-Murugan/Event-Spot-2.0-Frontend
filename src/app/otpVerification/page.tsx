"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OTPVerificationPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Send OTP (calls Next.js API route)
  const handleSendOTP = async () => {
    if (!phoneNumber.startsWith("+") || phoneNumber.length < 10) {
      alert("Enter a valid phone number with country code, e.g. +919876543210");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setOtpSent(true);
      alert("OTP sent successfully!");
    } catch (err: any) {
      alert(err.message || "Something went wrong while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.trim().length < 4) {
      alert("Enter a valid 4-6 digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed.");

      alert("OTP verified successfully!");
      router.push("/createEvent");
    } catch (err: any) {
      alert(err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResendOTP = async () => {
    setOtp("");
    await handleSendOTP();
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Left Section (Form) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Paper
          sx={{
            p: 5,
            width: "100%",
            maxWidth: 420,
            borderRadius: 3,
            textAlign: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" mb={2} fontWeight="bold">
            {otpSent ? "Verify OTP" : "Mobile Verification"}
          </Typography>

          {!otpSent ? (
            <>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Enter your mobile number to receive an OTP
              </Typography>

              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                helperText="Include country code, e.g. +91XXXXXXXXXX"
              />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: 600,
                  borderRadius: 2,
                }}
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? "Sending…" : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Enter the OTP sent to <strong>{phoneNumber}</strong>
              </Typography>

              <TextField
                label="Enter OTP"
                fullWidth
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{
                  maxLength: 6,
                  style: {
                    textAlign: "center",
                    letterSpacing: "0.5em",
                    fontSize: "1.2rem",
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontWeight: 600,
                  borderRadius: 2,
                }}
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? "Verifying…" : "Verify OTP"}
              </Button>

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: "#1976d2",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={handleResendOTP}
              >
                Resend OTP
              </Typography>
            </>
          )}
        </Paper>
      </Box>

      {/* Right Section (Image) */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          position: "relative",
          height: "100vh",
        }}
      >
        <Image src="/otp.jpg" alt="OTP Verification" fill style={{ objectFit: "cover" }} />
      </Box>
    </Box>
  );
}