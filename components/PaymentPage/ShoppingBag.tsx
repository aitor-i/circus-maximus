"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useShoppingBag } from "@/stores/shopingBagContext";
import { getEventImage } from "@/lib/events";

export function ShoppingBag() {
  const { updateQuantity, items, removeItem } = useShoppingBag();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Shopping Bag</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((product) => (
          <div key={product.id} className="flex items-center space-x-4 py-2">
            <div className="relative h-16 w-16 overflow-hidden rounded">
              <Image
                src={getEventImage(product.image ?? "") || "/placeholder.svg"}
                alt={product.name ?? ""}
                width={100}
                height={100}
                className="rounded-md"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(product.id, product.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{product.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(product.id, product.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(product.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col items-end space-y-2">
        <div className="flex justify-between w-full">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-full">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-full font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
