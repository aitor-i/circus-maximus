import React from "react";
import { getDictionary } from "@/translations/getDictionary";
import { getEvents } from "@/server-actions/events/events";
import EventCard from "@/components/EventCard/EventCard";

export default async function page() {
  const dict = await getDictionary("en");
  const events = (await getEvents())
    .filter(
      (event) =>
        event.availableSeats.length > 0 && new Date(event.date) > new Date(),
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="px-4 md:px-8">
      <h1>Events</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {events.map((event) => (
          <EventCard event={event} />
        ))}
      </div>
    </div>
  );
}
