"use client";

import React from "react";
import { Seat } from "@/server-actions/events/events";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useShoppingBag } from "@/stores/shopingBagContext";
import { getEventImage } from "@/lib/events";

interface EventSeatsProps {
  seat: Seat;
  eventId: string;
  image: string;
}

export default function EventSeats({ seat, eventId, image }: EventSeatsProps) {
  const { addItem } = useShoppingBag();

  const onAddEventSeat = () => {
    addItem({
      id: eventId + seat.type,
      name: seat.type,
      price: seat.price,
      image: image,
      quantity: 1,
    });
  };
  return (
    <div
      className="grid-cols-3 gap-2 md:grid flex  flex-col w-full"
      key={seat.type}
    >
      <p>
        {seat.type}({seat.available}):
      </p>
      <p>${seat.price}</p>
      <Button onClick={onAddEventSeat} disabled={seat.available <= 0}>
        Add to Cart
        <ShoppingBag className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}
