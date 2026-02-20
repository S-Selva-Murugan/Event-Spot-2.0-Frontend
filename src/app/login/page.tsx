"use client";

import { Box, TextField, Button, Typography, Paper, Divider } from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./../redux/authSlice";
import { AppDispatch } from "./../redux/store";
import GoogleIcon from "../components/GoogleIcon";
import { loginUser } from "../../../lib/cognito";
import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "session_expired") {
      setAuthError("Your session expired. Please login again.");
    } else if (reason === "login_required") {
      setAuthError("Please login to continue.");
    }
  }, [searchParams]);

useEffect(() => {
  async function verifyUser() {
    if (status === "authenticated" && session?.user?.email) {
      try {
        setAuthError("");
        const res = await fetch("http://localhost:3001/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            provider: "google",
            idToken: session.idToken, // ✅ send google token
          }),
        });

        const data = await res.json();

        if (data.success && data.user) {
          if (session.idToken) {
            localStorage.setItem("token", session.idToken);
          }
          localStorage.setItem("provider", "google");

          dispatch(
            login({
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
            })
          );

          router.push(data.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
        } else {
          const errorText = `${data?.message || ""} ${data?.error || ""} ${data?.details || ""}`.toLowerCase();
          const tokenExpired = /token used too late|invalid or expired token|expired token|jwt.*expired/.test(errorText);

          if (tokenExpired) {
            localStorage.removeItem("token");
            localStorage.removeItem("provider");
            await signOut({ redirect: false });
            setAuthError("Google session expired. Please continue with Google again.");
            return;
          }

          setAuthError(data.error || data.message || "Login failed. Please try again.");
        }
      } catch (error) {
        setAuthError("Unable to verify login right now. Please try again.");
      }
    }
  }

  verifyUser();
}, [status, session]);



  const handleGoogleSignIn = async () => {
    setAuthError("");
    await signIn("google");
  };

  const handleManualLogin = async () => {
    if (!email || !password) {
      setAuthError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const userSession = await loginUser(email, password);

      const idToken = userSession.getIdToken().getJwtToken();
      localStorage.setItem("token", idToken);
      localStorage.setItem("provider", "cognito");

      const res = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "cognito",
          idToken,
          email,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || data.message || "Login failed");
      }

      if (!data.user) {
        throw new Error("User data not found in response");
      }

      dispatch(
        login({
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        })
      );

      router.push(data.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      let message = "An unknown error occurred.";
      if (err && typeof err === "object" && "message" in err) {
        message = (err as { message: string }).message;
      } else {
        message = JSON.stringify(err);
      }
      setAuthError(message);
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
          backgroundColor: "#f9f9f9",
          px: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 5,
            width: "100%",
            maxWidth: 380,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Welcome to Event Spot 👋
          </Typography>

          {authError && (
            <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: "left" }}>
              {authError}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.2,
              backgroundColor: "#1976d2",
              ":hover": { backgroundColor: "#1258a8" },
            }}
            onClick={handleManualLogin}
            disabled={loading}
          >
            {loading ? "Logging in…" : "Login"}
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              py: 1.2,
              color: "#444",
              borderColor: "#ccc",
              ":hover": { borderColor: "#999", backgroundColor: "#f5f5f5" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
            onClick={handleGoogleSignIn}
            startIcon={<GoogleIcon width={20} height={20} />}
          >
            Continue with Google
          </Button>

          <Typography variant="body2" mt={3} color="text.secondary">
            Don’t have an account?{" "}
            <span
              style={{ color: "#1976d2", fontWeight: 500, cursor: "pointer" }}
              onClick={() => router.push("/signup")}
            >
              Sign up
            </span>
          </Typography>
        </Paper>
      </Box>

      {/* Right side - image */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: { xs: "none", md: "block" },
        }}
      >
        <Image
          src="/login.jpg"
          alt="Login illustration"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </Box>
    </Box>
  );
}
