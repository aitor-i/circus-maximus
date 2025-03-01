"use server";

import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
export interface PaymentIntent {
  paymentMethodId: string;
  amount: number;
  currency: string;
}

export async function processPayment({
  currency,
  paymentMethodId,
  amount,
}: PaymentIntent) {
  try {
    if (!paymentMethodId || !amount || !currency) {
      throw new Error("Invalid payment details.");
    }

    // Create & confirm the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents (e.g., 5000 -> $50.00)
      currency, // e.g., "usd"
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      // If you need a redirect for 3D Secure, you can set a return_url:
      // return_url: "https://yourdomain.com/success",
    });

    return { success: true, paymentIntentId: paymentIntent.id };
  } catch (error: any) {
    console.error("Payment processing error:", error);
    return { error: error.message || "Payment failed." };
  }
}

export async function POST(req: Request) {
  try {
    const { paymentMethodId, amount, currency } = await req.json();

    if (!paymentMethodId || !amount || !currency) {
      throw new Error("Invalid payment details.");
    }

    // Create & confirm the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents (e.g., 5000 -> $50.00)
      currency, // e.g., "usd"
      payment_method: paymentMethodId,
      confirm: true,
      // If you need a redirect for 3D Secure, you can set a return_url:
      // return_url: "https://yourdomain.com/success",
    });

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error: any) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: error.message || "Payment failed." },
      { status: 400 },
    );
  }
}
