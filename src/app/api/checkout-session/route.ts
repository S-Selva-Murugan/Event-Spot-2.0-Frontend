import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const CURRENCY = "usd";

/**
 * Helper to format amount to cents (Stripe requires smallest currency unit)
 */
function formatAmountForStripe(amount: number, currency: string) {
  // For USD, multiply by 100
  return Math.round(amount * 100);
}

export async function POST(req: Request) {
  try {
    const { amount, eventTitle } = await req.json();

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: eventTitle || "Event Ticket",
            },
            unit_amount: formatAmountForStripe(amount, CURRENCY),
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (err: any) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
