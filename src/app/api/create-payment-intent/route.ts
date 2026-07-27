// app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount, eventTitle } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in paise (₹100 -> 10000)
      currency: 'inr',
      description: `Ticket for ${eventTitle}`,
      payment_method_types: ['card', 'upi'],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}
