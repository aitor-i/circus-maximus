"use client";

import { useState } from "react";
import { CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingBag } from "./ShoppingBag";
import { useShoppingBag } from "@/stores/shopingBagContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./StripePaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function PaymentPage() {
  const [paymentMethod] = useState("card");
  const { items, updateQuantity, removeItem } = useShoppingBag();
  const months = 12;
  const startYear = 2025;
  const endYear = 2030;

  const monthAndYearCombinations = () => {
    return Array.from(
      { length: (endYear - startYear + 1) * months },
      (_, i) => {
        const year = startYear + Math.floor(i / months);
        const month = (i % months) + 1;
        return `${year.toString().slice(-2)}/${month.toString().padStart(2, "0")}`;
      },
    ).join(", ");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cardNumber = formData.get("cardNumber");
    if (!cardNumber) return;
    const expiry = formData.get("expiry");
    if (!expiry) return;
    const cvc = formData.get("cvc");
    if (!cvc) return;

    const stripe = await stripePromise;
    if (!stripe) return;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <ShoppingBag />
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Enter your payment information to complete your purchase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup defaultValue="card" className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  Card
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem
                  value="paypal"
                  id="paypal"
                  className="peer sr-only"
                  disabled
                />
                <Label
                  htmlFor="paypal"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary relative overflow-hidden cursor-not-allowed opacity-50"
                >
                  <Wallet className="mb-3 h-6 w-6" />
                  PayPal
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium text-foreground">
                      Coming Soon
                    </span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
            {paymentMethod === "card" && (
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            )}

            {paymentMethod === "_" && (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Select>
                      <SelectTrigger id="expiry">
                        <SelectValue placeholder="MM / YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthAndYearCombinations()
                          .split(", ")
                          .map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        {/* Add more options as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
                <CardFooter>
                  <Button className="w-full">Pay Now</Button>
                </CardFooter>
              </form>
            )}

            {paymentMethod === "paypal" && (
              <div className="text-center">
                <p>
                  You will be redirected to PayPal to complete your payment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
