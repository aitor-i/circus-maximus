"use server";

import { getMongoClinet, getPointer } from "../mongo/mongo";

interface Seat {
  type: string;
  price: number;
  available: number;
}

export type EventType = "gladiator" | "naval" | "beast";
export type Icon = "Gladiator" | "Naval" | "Beast";

export interface Event {
  _id?: string;
  title: string;
  description: string;
  date: string; // Format: 'YYYY-MM-DD'
  time: string; // Format: 'HH:mm'
  duration: string; // Example: '2 hours'
  icon: Icon; // Icon name based on event type
  price: number; // Base price for the event
  image: string; // Image URL or path
  eventType: EventType; // Event type
  availableSeats: Seat[]; // List of available seat types
  performers: string[]; // List of performer names
}

export async function getEvents() {
  try {
    var mongoClient = await getMongoClinet();
    await mongoClient.connect();
    const pointer = await getPointer("events");

    const events = await pointer.find<Event>({}).toArray();
    return events;
  } catch (error: Error | unknown) {
    console.log(Error.toString());
    throw new Error("Erro geting events");
  } finally {
    setTimeout(async () => {
      await mongoClient.close();
      console.log("Db closed");
    }, 4000);
  }
}
