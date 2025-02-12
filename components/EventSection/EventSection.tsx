import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { getDictionary } from "@/translations/getDictionary";
import { getEvents } from "@/server-actions/events/events";
import { getEventIcon, getEventImage, getEventTitle } from "@/lib/events";

export default async function EventSection() {
  const dict = await getDictionary("en");
  const events = (await getEvents())
    .filter(
      (event) =>
        event.availableSeats.length > 0 && new Date(event.date) > new Date(),
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          {dict.eventSection.upcoming}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link href={`/events/${event._id}`} key={event._id}>
              <Card key={event.title} className="overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getEventImage(event.eventType)}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {getEventIcon(event.icon)}
                    <h3 className="text-xl font-semibold">
                      {getEventTitle(event)}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {event.description}
                  </p>
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
          ))}
        </div>
      </div>
    </section>
  );
}
