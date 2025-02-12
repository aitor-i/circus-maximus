import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { getDictionary } from "@/translations/getDictionary";
import { getEvents } from "@/server-actions/events/events";
import { getEventIcon, getEventImage, getEventTitle } from "@/lib/events";
import EventCard from "../EventCard/EventCard";

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
            <EventCard event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
