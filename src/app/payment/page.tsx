'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed');
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 420,
        mx: 'auto',
        mt: 4,
        p: 3,
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Complete Your Payment
      </Typography>

      <form onSubmit={handleSubmit}>
        <PaymentElement />
        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading || !stripe}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
        </Button>
      </form>
    </Box>
  );
}

export default function CheckoutForm({
  amount,
  eventTitle,
}: {
  amount: number;
  eventTitle: string;
}) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, eventTitle }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, eventTitle]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#1976d2',
        borderRadius: '8px',
      },
    },
  } as any;

  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      ) : (
        <Typography align="center" sx={{ mt: 4 }}>
          Loading payment form...
        </Typography>
      )}
    </>
  );
}
