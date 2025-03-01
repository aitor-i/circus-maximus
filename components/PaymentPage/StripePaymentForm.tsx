"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { processPayment } from "@/server-actions/stripe/stripe";
import { useShoppingBag } from "@/stores/shopingBagContext";

const elementStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#0F2C59", // Deep Blue from your palette
      fontFamily: "'Inter', sans-serif",
      "::placeholder": {
        color: "#A0AEC0", // Placeholder color
      },
    },
    invalid: {
      color: "#FF5A5F", // Red for errors
    },
  },
  showIcon: true,
};

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { items, updateQuantity, removeItem, clearBag } = useShoppingBag();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cardBrand, setCardBrand] = useState<string | null>(null);

  // Detect card type (Visa, Mastercard, etc.)
  const handleCardNumberChange = (event: any) => {
    if (event.brand) {
      setCardBrand(event.brand !== "unknown" ? event.brand : null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    try {
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (!paymentMethod) throw new Error("Failed to create PaymentMethod");

      // TODO: Real price
      const price = items.reduce((acc, item) => acc + item.price, 0);
      const { error, success, paymentIntentId } = await processPayment({
        amount: price,
        currency: "usd",
        paymentMethodId: paymentMethod.id,
        items,
        email: "",
      });

      if (error) {
        setError(error.message || "Payment failed");
      } else if (success) {
        clearBag();
        // TODO: Redirect to success page
        alert("Payment successful!");
      }
    } catch (err) {
      setError("Unexpected error occurred");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 🔹 Card Number Input */}
      <div className="grid gap-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <div className="relative border-2 rounded-md p-2 bg-white shadow-sm">
          <CardNumberElement
            id="cardNumber"
            options={elementStyle}
            onChange={handleCardNumberChange}
          />
        </div>
      </div>

      {/* 🔹 Expiry & CVC Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <div className="border-2 rounded-md p-2 bg-white shadow-sm">
            <CardExpiryElement id="expiry" options={elementStyle} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cvc">CVC</Label>
          <div className="border-2 rounded-md p-2 bg-white shadow-sm">
            <CardCvcElement id="cvc" options={elementStyle} />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};
