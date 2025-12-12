"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUpUser } from "../../../lib/cognito"; // adjust if needed

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    if (typeof err === "object" && err && "message" in err)
      return String((err as any).message);
    return JSON.stringify(err);
  };

  const handleCognitoSignup = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords must match.");
      return;
    }
    if (password.trim().length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
if (!phoneNumber.startsWith("+") || phoneNumber.length < 10) {
  alert("Phone number must start with + and include country code, e.g., +919876543210");
  return;
}

    try {
      setLoading(true);
      await signUpUser(email, password, fullName, phoneNumber);
      alert("Signup successful! Please check your email for the verification code.");
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Signup error:", err);
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left side - form */}
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
          }}
          elevation={4}
        >
          <Typography variant="h5" mb={2} fontWeight="bold">
            Create Account
          </Typography>

          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            helperText="Include country code, e.g. +91XXXXXXXXXX"
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleCognitoSignup}
            disabled={loading}
          >
            {loading ? "Signing up…" : "Sign Up"}
          </Button>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => router.push("/login")}
            >
              Log in
            </span>
          </Typography>
        </Paper>
      </Box>

      {/* Right side - image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          position: "relative",
        }}
      >
        <Image src="/signup.jpg" alt="signup" fill style={{ objectFit: "cover" }} />
      </Box>
    </Box>
  );
}
