import { Sword, Anchor, PawPrint as Paw, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/translations/getDictionary";
import beastArena from "@/public/asests/beast-arena.webp";
import gladiators from "@/public/asests/gladiators.webp";
import navalSpectacle from "@/public/asests/naval-spectacle.webp";
import {
  getEvents,
  EventType,
  Icon,
  Event,
} from "@/server-actions/events/events";

export const getEventImage = (eventType: EventType) => {
  switch (eventType) {
    case "beast":
      return beastArena.src;
    case "gladiator":
      return gladiators.src;
    case "naval":
      return navalSpectacle.src;
  }
};

export const getEventIcon = (Icon: Icon) => {
  switch (Icon) {
    case "Gladiator":
      return <Sword className="w-5 h-5" />;
    case "Naval":
      return <Anchor className="w-5 h-5" />;
    case "Beast":
      return <Paw className="w-5 h-5" />;
  }
};

export const getEventTitle = (event: Event) => {
  switch (event.eventType) {
    case "beast":
      return "Beast Arena";
    case "gladiator":
      return "Gladiator Arena";
    case "naval":
      return "Naval Spectacle";
  }
};
