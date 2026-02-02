'use client';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import Script from "next/script";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

export default function EventBookingPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const [event, setEvent] = useState<any>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  // Get user data from Redux
  const user = useSelector((state: RootState) => state.auth);

  // ✅ Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`
        );
        setEvent(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch event details:", err);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Show snackbar notification
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 💳 Handle Payment
  const handlePayment = async () => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token || !user.isAuthenticated) {
      showSnackbar("Please login to book tickets", "error");
      router.push("/login");
      return;
    }

    if (!ticketCount || ticketCount <= 0) {
      showSnackbar("Please enter a valid number of tickets", "error");
      return;
    }

    if (ticketCount > event.totalTickets) {
      showSnackbar(`Only ${event.totalTickets} tickets available`, "error");
      return;
    }

    setLoading(true);
    try {
      // Step 1️⃣: Create Razorpay order via backend
      const totalAmount = event.ticketPrice * ticketCount;
      const { data: orderData } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`,
        { amount: totalAmount }
      );

      // Handle both response formats (with or without success wrapper)
      const order = orderData.order || orderData;
      if (!order || !order.id) {
        throw new Error("Failed to create payment order");
      }

      // Step 2️⃣: Configure Razorpay checkout options
      const razorpayKey = orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured");
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: "INR",
        name: "Event Spot",
        description: `Booking for ${event.eventName}`,
        order_id: order.id,

        // ✅ Step 3️⃣: Success handler - Verify payment first, then create booking
        handler: async function (response: any) {
          try {
            setLoading(true);
            console.log("Payment response received:", response);

            // Step 3a: Verify payment with backend
            const verifyRes = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,
              {
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }
            );

            if (!verifyRes.data.success) {
              throw new Error(verifyRes.data.message || "Payment verification failed");
            }

            console.log("✅ Payment verified successfully");

            // Step 3b: Create booking (backend will verify payment again)
            const bookingRes = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
              {
                eventId: event._id,
                tickets: ticketCount,
                totalAmount,
                razorpayOrderId: order.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (bookingRes.data.success) {
              showSnackbar("🎟️ Booking confirmed successfully!", "success");
              // Redirect to bookings page or dashboard after 2 seconds
              setTimeout(() => {
                router.push("/profile");
              }, 2000);
            } else {
              throw new Error(bookingRes.data.message || "Booking creation failed");
            }
          } catch (err: any) {
            console.error("❌ Booking failed:", err);
            const errorMessage = err.response?.data?.message || err.message || "Booking failed. Please contact support.";
            showSnackbar(errorMessage, "error");
          } finally {
            setLoading(false);
          }
        },

        // ✅ Payment cancellation handler
        modal: {
          ondismiss: function () {
            setLoading(false);
            showSnackbar("Payment cancelled", "info");
          },
        },

        // ✅ Prefill with real user data
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: "", // Add phone if available in user object
        },
        theme: { color: "#1976d2" },
      };

      // Step 4️⃣: Open Razorpay payment window
      const rzp = new (window as any).Razorpay(options);

      // ✅ Payment failure handler
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setLoading(false);
        showSnackbar(
          `Payment failed: ${response.error.description || response.error.reason || "Unknown error"}`,
          "error"
        );
      });

      rzp.open();

    } catch (err: any) {
      console.error("❌ Payment creation failed:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error while creating payment";
      showSnackbar(errorMessage, "error");
      setLoading(false);
    }
  };


  if (!event)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <Typography>Loading event details...</Typography>
      </Box>
    );

  return (
    <>
      {/* Load Razorpay script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f8f9fa",
        }}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: 6,
            maxWidth: 500,
            width: "100%",
            bgcolor: "#fff",
          }}
        >
          <CardContent>
            {/* 🏷️ Event Info */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h4" fontWeight={600} mb={1} color="primary">
                {event.eventName}
              </Typography>
              <Typography variant="body1" mb={1}>
                📍 {event.location}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                💰 Price: ₹{event.ticketPrice}
              </Typography>
            </Box>

            <Typography variant="h6" color="text.secondary" mb={3}>
              Tickets available: {event.totalTickets}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* ✍️ Booking Form */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Number of Tickets"
                type="number"
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <Button
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
                onClick={handlePayment}
                disabled={loading || !user.isAuthenticated}
              >
                {loading ? "Processing..." : !user.isAuthenticated ? "Please Login to Book" : "Book Tickets"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
