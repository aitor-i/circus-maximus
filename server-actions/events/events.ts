"use server";
import { ObjectId } from "mongodb";
import { getMongoClinet, getPointer } from "../mongo/mongo";
import { ShoppingBagItem } from "@/stores/shopingBagContext";

export interface Seat {
  type: string;
  price: number;
  available: number;
}

export type EventType = "gladiator" | "naval" | "beast";
export type Icon = "Gladiator" | "Naval" | "Beast";

export interface Event {
  _id?: ObjectId;
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

interface Purchase {
  userEmail: string;
  eventId: string;
  seatType: string;
  quantity: number;
  type: "event";
}

export async function addEventsToUserByUserEmail(
  userEmail: string,
  events: Event[],
  shoppingBag: ShoppingBagItem[],
) {
  try {
    var mongoClient = await getMongoClinet();
    await mongoClient.connect();
    const pointer = await getPointer("purchases");
    const purchases: Purchase[] = [];
    shoppingBag.forEach((item) => {
      const event = events.find(
        (event) => event._id!.toString() === item.id.split("_")[0],
      );
      if (!event) return;
      purchases.push({
        userEmail,
        eventId: event._id!.toString(),
        seatType: item.name,
        quantity: item.quantity,
        type: "event",
      });
    });
    const result = await pointer.insertMany(purchases);
  } catch (Error: Error | unknown) {
  } finally {
    setTimeout(async () => {
      await mongoClient.close();
      console.log("Db closed");
    }, 4000);
  }
}

export async function substractEventsFromDB(
  events: Event[],
  shoppingBag: ShoppingBagItem[],
) {
  try {
    var mongoClient = await getMongoClinet();
    await mongoClient.connect();
    const pointer = await getPointer("events");

    const eventsIds = events.map((event) => event._id!);

    // For each event in the shopping bag, substract the quantity from the event' seat type
    for (const item of shoppingBag) {
      const event = events.find(
        (event) => event._id!.toString() === item.id.split("_")[0],
      );
      if (!event) continue;

      // Find the seat type in the event
      const seatType = event.availableSeats.find(
        (seat) => seat.type === item.name,
      );
      if (!seatType) continue;

      // Substract the quantity from the seat type
      seatType.available -= item.quantity;

      // If the seat type is now empty, remove it from the event
      if (seatType.available <= 0) {
        event.availableSeats = event.availableSeats.filter(
          (seat) => seat.type !== item.name,
        );
      }
      await pointer.updateOne({ _id: event._id }, { $set: event });
    }
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

export async function getEventsFromById(eventIds: string[]) {
  try {
    var mongoClient = await getMongoClinet();
    await mongoClient.connect();
    const pointer = await getPointer("events");

    const eventObjectsIds = eventIds.map((id) => new ObjectId(id));
    console.log("IDS", eventObjectsIds);

    const events = await pointer
      .find<Event>({ _id: { $in: eventObjectsIds } })
      .toArray();
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

export async function getEventsWithPagination(
  page: number = 1,
  limit: number = 10,
) {
  try {
    var mongoClient = await getMongoClinet();
    await mongoClient.connect();
    const pointer = await getPointer("events");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Count total events
    const totalEvents = await pointer.countDocuments({
      date: { $gte: today },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalEvents / limit);

    // Fetch paginated events
    const events = await pointer
      .find<Event>({ date: { $gte: today } }) // Only future events
      .sort({ date: -1 }) // -1 for descending (newest first), 1 for ascending (oldest first)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return {
      events,
      pagination: {
        totalEvents,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (error: unknown) {
    console.error("Error getting events:", error);
    throw new Error("Error getting events");
  } finally {
    setTimeout(async () => {
      await mongoClient.close();
      console.log("DB closed");
    }, 4000);
  }
}

export async function getEvent(id: string) {
  try {
    var mongoClient = await getMongoClinet();
    await mongoClient.connect();
    const pointer = await getPointer("events");

    const eventId = new ObjectId(id);
    const event = await pointer.findOne<Event>({ _id: eventId });
    return event;
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

export async function fixCorruptedEvents() {
  try {
    var mongoClient = await getMongoClinet();
    await mongoClient.connect();
    const pointer = await getPointer("events");

    const corruptedEvents = await pointer
      .find({
        $or: [
          { performers: { $type: "string" } },
          { availableSeats: { $type: "string" } },
        ],
      })
      .toArray();

    let updatedCount = 0;

    for (const event of corruptedEvents) {
      const updatedFields: Record<string, any> = {};

      // Helper function to fix JSON format
      const fixJsonString = (str: string): string => {
        return str
          .replace(/'/g, '"') // Convert single quotes to double quotes
          .replace(/\s/g, " "); // Remove any unintended whitespace issues
      };

      // Fix performers if it's a string
      if (typeof event.performers === "string") {
        try {
          updatedFields.performers = JSON.parse(
            fixJsonString(event.performers),
          );
        } catch (e) {
          console.error(
            `Skipping event ${event._id}: Invalid JSON in performers`,
          );
          continue;
        }
      }

      // Fix availableSeats if it's a string
      if (typeof event.availableSeats === "string") {
        try {
          updatedFields.availableSeats = JSON.parse(
            fixJsonString(event.availableSeats),
          );
        } catch (e) {
          console.error(
            `Skipping event ${event._id}: Invalid JSON in availableSeats`,
          );
          continue;
        }
      }

      // Update the document if any field was fixed
      if (Object.keys(updatedFields).length > 0) {
        await pointer.updateOne({ _id: event._id }, { $set: updatedFields });
        updatedCount++;
      }
    }

    console.log(`Fixed ${updatedCount} corrupted events.`);
  } catch (error) {
    console.error("Error fixing corrupted events:", error);
  } finally {
    setTimeout(async () => {
      await mongoClient.close();
      console.log("DB connection closed.");
    }, 4000);
  }
}
