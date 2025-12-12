'use client';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import Script from "next/script";
import axios from "axios";

export default function EventBookingPage() {
  const params = useParams();
  const eventId = params.id;
  const [event, setEvent] = useState<any>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);

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

  // 💳 Handle Payment
const handlePayment = async () => {

  const token = localStorage.getItem("token") || "";
  const provider = localStorage.getItem("provider") || undefined;

  if (!ticketCount || ticketCount <= 0) {
    alert("Please enter a valid number of tickets");
    return;
  }

  setLoading(true);
  try {
    // Step 1️⃣: Create Razorpay order via backend
    const totalAmount = event.ticketPrice * ticketCount;
    const { data: order } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`,
      { amount: totalAmount }
    );

    // Step 2️⃣: Configure Razorpay checkout options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Event Spot",
      description: `Booking for ${event.eventName}`,
      order_id: order.id,

      // ✅ Step 3️⃣: Success handler
      handler: async function (response: any) {
        try {
          alert("✅ Payment successful!");
          console.log("Payment ID:", response.razorpay_payment_id);

          // Step 4️⃣: Save booking details in backend
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
            eventId: event._id,
            userId: "TEMP_USER_ID", // replace later with actual Cognito ID
            tickets: ticketCount,
            totalAmount,
            razorpayOrderId: order.id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          alert("🎟️ Booking confirmed!");
        } catch (err) {
          console.error("❌ Failed to save booking:", err);
          alert("Booking save failed, please contact support.");
        }
      },

      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: { color: "#1976d2" },
    };

    // Step 5️⃣: Open Razorpay payment window
    const rzp = new (window as any).Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("❌ Payment creation failed:", err);
    alert("Error while creating payment");
  } finally {
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
                disabled={loading}
              >
                {loading ? "Processing..." : "Book Tickets"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
