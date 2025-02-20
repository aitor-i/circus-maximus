import { getEventImage } from "@/lib/events";
import {
  fixCorruptedEvents,
  getEvent,
  getEvents,
} from "@/server-actions/events/events";
import Image from "next/image";
import { Event } from "@/server-actions/events/events";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShoppingCartIcon } from "lucide-react";
import EventSeats from "@/components/EventSeats/EventSeats";

interface EventParams {
  params: { id: string };
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => event._id);
}

export default async function Page({ params }: EventParams) {
  const event = await getEvent(params.id);
  if (!event) return notFound();

  return (
    <div>
      <Image
        className="w-full h-[30vh] overflow-y-hidden object-cover object-bottom"
        src={getEventImage(event.eventType!) ?? ""}
        alt={event.title}
        width={1500}
        height={1000}
      />
      <div className="px-4 md:px-8 py-4">
        <h1 className="text-4xl py-2 font-bold">{event.title.split(":")[1]}</h1>
        <p className="text-xl">{event.description}</p>

        <div className="flex gap-4 py-4 md:py-8 justify-center ">
          <div className="flex flex-col gap-8">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-lg">{event.performers.join(", ")}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-lg italic">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold">Seats</h2>
              <div className="text-lg flex flex-col md:gap-3 gap-8">
                {event.availableSeats?.map((seat) => (
                  <EventSeats
                    key={seat.type}
                    image={event.eventType}
                    seat={seat}
                    eventId={event._id!.toString()}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
