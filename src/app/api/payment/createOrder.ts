import Razorpay from "razorpay";
import crypto from "crypto";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { amount } = req.body; // amount in INR

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create Razorpay order" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
