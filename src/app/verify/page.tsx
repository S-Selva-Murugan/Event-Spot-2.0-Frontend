"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { confirmUser, resendConfirmation } from "../../../lib/cognito";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      await confirmUser(email, code);
      alert("Verified! You can now log in.");
      router.push("/login");
    } catch (err: unknown) {
  console.error("Signup error:", err);
  
  let message = "An unknown error occurred.";
  
  if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === "object" && err && "message" in err) {
    message = String((err as any).message);
  } else {
    message = JSON.stringify(err);
  }

  alert(message);
} finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendConfirmation(email);
      alert("Verification code resent to your email.");
    } catch (err: unknown) {
  console.error("Signup error:", err);
  
  let message = "An unknown error occurred.";
  
  if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === "object" && err && "message" in err) {
    message = String((err as any).message);
  } else {
    message = JSON.stringify(err);
  }

  alert(message);
}
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 480 }}>
        <Typography variant="h6" mb={2}>Verify email</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>Code sent to <b>{email}</b></Typography>
        <TextField label="Verification code" fullWidth value={code} onChange={(e) => setCode(e.target.value)} />
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying…" : "Verify"}
          </Button>
          <Button variant="outlined" onClick={handleResend}>Resend code</Button>
        </Box>
      </Paper>
    </Box>
  );
}
