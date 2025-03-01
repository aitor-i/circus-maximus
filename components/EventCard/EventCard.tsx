import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { getEventIcon, getEventImage, getEventTitle } from "@/lib/events";
import { Event } from "@/server-actions/events/events";
import { getDictionary } from "@/translations/getDictionary";
import Image from "next/image";

interface EventProps {
  event: Event;
}

export default async function EventCard({ event }: EventProps) {
  const dict = await getDictionary("en");
  return (
    <Link href={`/events/event/${event._id}`} key={event._id?.toString()}>
      <Card key={event.title} className="overflow-hidden h-full group">
        <div className="relative h-48 overflow-hidden">
          <Image
            height={500}
            width={1000}
            placeholder="blur"
            blurDataURL={getEventImage(event.eventType)}
            src={getEventImage(event.eventType) ?? ""}
            alt={event.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            {getEventIcon(event.icon)}
            <h3 className="text-xl font-semibold">{getEventTitle(event)}</h3>
          </div>
          <p className="text-muted-foreground mb-4">{event.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold">${event.price}</span>
            <span className="font-bold">
              {new Date(event.date).toLocaleDateString()}
            </span>
            <Button>{dict.eventSection.bookNow}</Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
