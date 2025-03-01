"use server";

import { stripe } from "@/lib/stripe";
import { ShoppingBagItem } from "@/stores/shopingBagContext";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getEventsFromById, substractEventsFromDB } from "../events/events";
import { revalidatePath } from "next/cache";
export interface PaymentIntent {
  paymentMethodId: string;
  amount: number;
  currency: string;
  items?: ShoppingBagItem[];
  email?: string;
}

export async function processPayment({
  currency,
  paymentMethodId,
  amount,
  items,
  email,
}: PaymentIntent) {
  try {
    if (!paymentMethodId || !currency) {
      throw new Error("Invalid payment details.");
    }

    const itmeIds = items?.map((item) => item.id.split("_")[0].toString());
    const events = await getEventsFromById(itmeIds ?? []);

    const price = events.reduce((acc, event) => {
      const item = items?.find(
        (item) => item.id.split("_")[0] === event._id?.toString(),
      );
      if (!item) return acc;
      const seatType = event.availableSeats.find(
        (seat) => seat.type === item.name,
      );

      return acc + seatType?.price! * item.quantity;
    }, 0);

    // Create & confirm the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // in cents (e.g., 5000 -> $50.00)
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

    await substractEventsFromDB(events, items ?? []);
    // TODO: Add items to user's purchases

    revalidatePath("/events");
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
