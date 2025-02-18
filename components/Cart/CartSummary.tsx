"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CartSummary() {
  const [subtotal, setSubtotal] = useState(0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  useEffect(() => {
    // In a real application, you would calculate this based on the actual cart items
    setSubtotal(69.97);
  }, []);

  return (
    <div className="w-full lg:w-1/3 border bg-foreground text-muted p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Button className="w-full text-secondary-foreground mt-6">
        Proceed to Checkout
      </Button>
    </div>
  );
}
