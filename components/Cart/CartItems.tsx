"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialItems = [
  {
    id: 1,
    name: "Product 1",
    price: 19.99,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Product 2",
    price: 29.99,
    quantity: 2,
    image: "/placeholder.svg?height=100&width=100",
  },
];

export default function CartItems() {
  const [items, setItems] = useState(initialItems);

  const updateQuantity = (id: number, newQuantity: number) => {
    setItems(
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, newQuantity) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <div className="w-full lg:w-2/3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 py-4 border-b">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            width={100}
            height={100}
            className="rounded-md"
          />
          <div className="flex-grow">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateQuantity(item.id, 0)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
